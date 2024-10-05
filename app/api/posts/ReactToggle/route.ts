import prisma from "@/lib/prisma";
import { Prisma, ReactionType } from "@prisma/client";
import { NextResponse } from "next/server";

export interface ReactionInfo {
  userId: number;
  postId: number;
  reactionType: ReactionType;
}

export const POST = async (req: Request) => {
  const body = (await req.json()) as ReactionInfo;
  const { postId, reactionType, userId } = body;

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
        type:"REACTION"
      },
    },
  });

  if (!interaction) {
    interaction = await prisma.interaction.create({
      data: {
        postId: postId,
        author_id: userId,
        type: "REACTION",
        
      },
    });
  }

  // Check if the user has already reacted
  const existingReaction = await prisma.reaction.findFirst({
    where: {
      innteractId: interaction.id,
    },
  });

  if (existingReaction) {
    if (existingReaction.type === reactionType) {
      // If the user reacted with the same type, remove the reaction
      const Delete = await prisma.reaction.delete({
        where: { id: existingReaction.id },
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
      // If the user reacted with a different type, update the reaction
      const updatedReaction = await prisma.reaction.update({
        where: { id: existingReaction.id },
        data: { type: reactionType },
        include :{
          Interaction:{
            select:{
              author_id :true ,
              postId : true
            }
          }
        }
      });

      const fixed =  {
        id: updatedReaction.id,
        type: updatedReaction.type,
        created_at: updatedReaction.created_at ,
        updated_at: updatedReaction.updated_at ,
        innteractId: updatedReaction.innteractId,
        author_id :updatedReaction.Interaction.author_id ,
        postId : updatedReaction.Interaction.postId
      }


      return NextResponse.json(
        {
          react: {
            ...fixed,
          },
          tag: "update",
        },
        { status: 200 }
      );
    }
  } else {
    // If the user hasn't reacted yet, create a new reaction
    const newReaction = await prisma.reaction.create({
      data: {
        innteractId: interaction.id,
        type: reactionType,
        Notification:{
          create :{
            notifierId: +userId,
            notifyingId: +post.author_id,
            postId : post.id ,
            type: "POST_REACT",
          }
        }
      },

    });
    return NextResponse.json(
      {
        react: {
          ...newReaction,
        },
        tag: "add",
      },
      {
        status: 201,
      }
    );
  }
};
