import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.json();
  const res = body as { content: string; post_id: number; author_id: number };
  if (!res.author_id || !res.content || !res.post_id) {
    return NextResponse.json(
      {
        res,
        message: "Invalid Request",
      },
      {
        status: 400,
      }
    );
  }
  const findUser = await prisma.user.findUnique({
    where: {
      id: +res.author_id,
    },
  });
  if (!findUser) {
    return NextResponse.json(
      {
        message: "User not found",
      },
      {
        status: 404,
      }
    );
  }
  const findPost = await prisma.post.findUnique({
    where: {
      id: +res.post_id,
    },
  });
  if (!findPost)
    return NextResponse.json(
      { message: "Post not found " },
      {
        status: 404,
      }
    );
    else {

        try {
            
            const createComment = await prisma.comment.create({
                data: {
                    content: res.content,
                    post_id: +res.post_id,
                    author_id: +res.author_id,
                },
            });
            return NextResponse.json(createComment, {
                status: 200,
            });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                {
                    message: "Error creating comment",
                    },
                    {
                        status: 500,
                        }
                        );
                        
            
        }
    }

};
