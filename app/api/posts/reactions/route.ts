import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const PostId = +searchParams.get("PostId")!;
  if (!PostId)
    return NextResponse.json(
      {
        error: "PostId is required",
      },
      {
        status: 404,
      }
    );

  const FindPost = await prisma.post.findUnique({
    where: {
      id: +PostId,
    },
  });

  if (!!FindPost) {
    try {
        const Reactions = await prisma.reaction.findMany({
            where: {
                post_id: +PostId
            }           
        })


        return NextResponse.json(
            Reactions ,
   
            {
                status :200
            }
        )
    } catch (err: any) {
      return NextResponse.json({
        error: "reactions prisma canont find ",
      });
    }
  } else {
    return NextResponse.json(
      {
        error: "post not found",
      },
      {
        status: 404,
      }
    );
  }
};
