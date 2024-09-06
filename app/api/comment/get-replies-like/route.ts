import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export interface shapeGetRpelayLikeRes {
  id: number;
  replay_id: number;
  created_at: Date;
  updated_at: Date;
  innteractId: number;
  interactionShareId: number | null;
  author_id?: number;
  post_id?: number | null;
}

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const replay_id = parseInt(url.searchParams.get("replay_id")!);

  const replay = await prisma.replay.findUnique({
    where: {
      id: replay_id,
    },
  });
  if (!replay)
    return NextResponse.json(
      {
        message: "this replay not found",
      },
      { status: 404 }
    );
  if (!!replay) {
    try {
      const findLikes = await prisma.replayLikes.findMany({
        where: {
          replay_id: replay_id,
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
      const fixed = findLikes.map((d) => {
        return {
          id: d.id,
          replay_id: d.replay_id,
          created_at: d.created_at,
          updated_at: d.updated_at,
          innteractId: d.innteractId,
          interactionShareId: d.interactionShareId,
          author_id: d?.Interaction?.author_id,
          post_id: d?.Interaction?.postId,
        };
      })as shapeGetRpelayLikeRes[]
      return NextResponse.json(fixed, {
        status: 200,
      });
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        {
          message: error,
        },
        {
          status: 400,
        }
      );
    }
  }
};
