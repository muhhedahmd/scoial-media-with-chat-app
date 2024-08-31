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
  const post = await prisma.post.findUnique({ where: { id: +postId } });
  if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });

  // Check if the user exists
  const user = await prisma.user.findUnique({ where: { id: +userId } });
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  // Define the unique combination of post, user, and type
  const where: Prisma.ReactionWhereUniqueInput = {
    post_id_user_id: {
      post_id: +postId,
      user_id: +userId,
    },
  };

  // Check if the user has already reacted
  const existingReaction = await prisma.reaction.findUnique({ where });

  if (existingReaction) {
    if (existingReaction.type === reactionType) {
      // If the user reacted with the same type, remove the reaction
     const deleted =  await prisma.reaction.delete({ where });
      return NextResponse.json({ message: "Reaction removed" , id :deleted.id , add: false, updated: false }, { status: 200 });
    } else {
      // If the user reacted with a different type, update the reaction
      const updatedReaction = await prisma.reaction.update({
        where,
        data: { type: reactionType },
      });
      return NextResponse.json({ ...updatedReaction, add: false, updated: true }, { status: 200 });
    }
  } else {
    // If the user hasn't reacted yet, create a new reaction
    const newReaction = await prisma.reaction.create({
      data: {
        post_id: +postId,
        user_id: +userId,
        type: reactionType,
      },
    });
    return NextResponse.json({ ...newReaction, add: true, updated: false }, { status: 200 });
  }
};
