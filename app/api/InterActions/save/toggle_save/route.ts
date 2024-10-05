import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export interface ReactionInfo {
  userId: number;
  postId: number;
  cateagory: string; // Corrected typo: "cateagory" to "cateagory"
}

export const POST = async (req: Request) => {
  const body = (await req.json()) as ReactionInfo;
  const { postId, userId, cateagory } = body;

  // Check if the post exists
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  // Check if the user exists
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // Find or create an Interaction
  let interaction = await prisma.interaction.findUnique({
    where: {
      author_id_postId_type: {
        postId: postId,
        author_id: userId,
        type: "SAVE",
      },
    },
  });

  if (!interaction) {
    interaction = await prisma.interaction.create({
      data: {
        postId: postId,
        author_id: userId,
        type: "SAVE",
      },
    });
  }

  // Find the existing save
  const existingSave = await prisma.save.findUnique({
    where: {
      InteractionId: interaction.id,
    },
    include: {
      Save_catagory: true, // Include cateagory to check for changes
    },
  });

  if (existingSave) {
    // Check if the cateagory has changed
    const currentcateagoryId = existingSave.save_catagoryId;
    let newSavecateagory = cateagory
      ? await prisma.save_catagory.findUnique({
          where: {
            author_id_name: {
              name: cateagory,
              author_id: userId,
            },
          },
        })
      : await prisma.save_catagory.findUnique({
          where: {
            author_id_name: {
              author_id: userId,
              name: "DEFAULT",
            },
          },
        });

    if (!newSavecateagory) {
      newSavecateagory = await prisma.save_catagory.create({
        data: {
          author_id: userId,
          name: cateagory || "DEFAULT",
        },
      });
    }

    if (currentcateagoryId !== newSavecateagory.id) {
      // Update to the new cateagory
      await prisma.save.delete({ where: { id: existingSave.id } });

      const createNewSave = await prisma.save.create({
        data: {
          InteractionId: interaction.id,
          save_catagoryId: newSavecateagory.id,
        },
        include:{
          Save_catagory :{
            select:{
              name :true
            }
          }
        }
      });

      return NextResponse.json(
        {
          save: createNewSave,
          tag: "update",
        },
        { status: 200 }
      );
    }

    // If no change in cateagory, remove the existing save reaction
    await prisma.save.delete({ where: { id: existingSave.id } });
    await prisma.interaction.delete({ where: { id: interaction.id } });

    console.log({ message: "Reaction removed" });
    return NextResponse.json(
      {
        save: existingSave,
        tag: "delete",
      },
      { status: 200 }
    );
  } else {
    // Handle the case when there is no existing save (create new)
    let savecateagory = cateagory
      ? await prisma.save_catagory.findUnique({
          where: {
            author_id_name: {
              author_id: userId,
              name: cateagory,
            },
          },
        })
      : await prisma.save_catagory.findUnique({
          where: {
            author_id_name: {
              author_id: userId,
              name: "DEFAULT",
            },
          },
        });

    if (!savecateagory) {
      savecateagory = await prisma.save_catagory.create({
        data: {
          author_id: userId,
          name: cateagory || "DEFAULT",
        },
      });
    }

    const createSave = await prisma.save.create({
      data: {
        InteractionId: interaction.id,
        save_catagoryId: savecateagory.id,

      },
      include:{
        Save_catagory :{
          select:{
            name :true
          }
        }
      }
    });

    return NextResponse.json(
      {
        save: createSave,
        tag: "add",
      },
      { status: 201 }
    );
  }
};
