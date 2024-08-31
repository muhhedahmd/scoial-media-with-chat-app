import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const commentId = +searchParams.get("commentId")!;
  if (!commentId)
    return NextResponse.json(
      {
        error: "commentId is required",
      },
      {
        status: 404,
      }
    );

  const FindPost = await prisma.comment.findUnique({
    where: {
      id: +commentId,
    },
  });

  if (!!FindPost) {
    try {
        const Replaies = await prisma.replay.findMany({
            where: {
                comment_id: +commentId
            }           
        })


        return NextResponse.json(
            Replaies ,
   
            {
                status :200
            }
        )
    } catch (err: any) {
      return NextResponse.json({
        error: "replay prisma canont find ",
      });
    }
  } else {
    return NextResponse.json(
      {
        error: "comment not found",
      },
      {
        status: 404,
      }
    );
  }
};
