import prisma from "@/lib/prisma";
import { Prisma, typePin,  } from "@prisma/client";
import { NextResponse } from "next/server";

export interface ReactionInfo {
  userId: number;
  postId: number;
  pinType?: typePin ;
  tag?  : string[]
}

export const POST = async (req: Request) => {
  const body = (await req.json()) as ReactionInfo;
  const { postId, pinType, userId , tag } = body;

  // Check if the post exists
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post)
    return NextResponse.json({ message: "Post not found" }, { status: 404 });

  // Check if the user exists
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user)
    return NextResponse.json({ message: "User not found" }, { status: 404 });

  // Find or create an Interaction
  let interaction = await prisma.interaction.findUnique({
    where: {
      author_id_postId_type: {
        postId: postId,
        author_id: userId,
        type:"PIN"
      },
    },
  });

  if (!interaction) {
    interaction = await prisma.interaction.create({
      data: {
        postId: postId,
        author_id: userId,
        type: "PIN",
        
      },
    });
  }

  // Check if the user has already reacted
  const existingSave = await prisma.pin.findFirst({
    where: {
      InteractionId: interaction.id,
    },
  });

  if (existingSave) {
      const Delete = await prisma.pin.delete({
        where: { id: existingSave.id },
      });
      console.log({ message: "Reaction removed" });
      return NextResponse.json(
        {
          react: {
            ...Delete,
          },
          tag: "delete",
        },
        { status: 200 }
      );
    
  } else {

    const createPin = await prisma.pin.create({
        data:{
            tag:tag ,
            type :pinType,
            InteractionId : interaction.id,
        }
    })

    return NextResponse.json(
      {
        react: {
          ...createPin,
        },
        tag: "add",
      },
      {
        status: 201,
      }
    );
  }
};
