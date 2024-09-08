import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export interface ShapeOfreactionsComments {
  id: number;
  comment_id: number;
  emoji: string;
  imageUrl: string;
  names: Prisma.JsonValue;
  author_id: number;
  post_id: number;
  innteractId: number;
  interactionShareId: number | null;
}
export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const query = url.searchParams;
  const comment_id = query.get("comment_id");
  if (!comment_id) {
    return NextResponse.json(
      {
        message: "invalid Request",
      },
      {
        status: 400,
      }
    );
  }
  try {
    const reactions = await prisma.reactionsComment.findMany({
      where: {
        comment_id: +comment_id,
      },
      include: {
        Interaction: {
          select: {
            author_id: true,
            postId: true,
          },
        },
      },
    });

    const Fixed = reactions?.map((react) => {
      return {
        id: react.id,
        comment_id: react.comment_id,
        emoji: react.emoji,
        imageUrl: react.imageUrl,
        names: react.names,
        author_id: react.Interaction.author_id,
        post_id: react.Interaction.postId,
        innteractId: react.innteractId,
      };
    }) as ShapeOfreactionsComments[]

    return NextResponse.json(Fixed, {
      status: 200,
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: "comment not found",
      },
      {
        status: 404,
      }
    );
  }
};
