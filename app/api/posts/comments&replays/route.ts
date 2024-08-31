import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  console.log(searchParams);

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
        const Comments_and_Replay = await prisma.comment.findMany({
            where: {
                post_id: +PostId
            }           
        })


        return NextResponse.json(
            Comments_and_Replay ,
   
            {
                status :200
            }
        )
    } catch (err: any) {
      return NextResponse.json({
        error: "comment prisma canont find ",
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
