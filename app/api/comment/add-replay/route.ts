import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.json();
  const res = body as {
    content: string;
    comment_id: number;
    author_id: number;
  };
  if (!res.author_id || !res.content || !res.comment_id) {
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
  const findPost = await prisma.comment.findUnique({
    where: {
      id: +res.comment_id,
    },
  });
  if (!findPost)
    return NextResponse.json(
      { message: "comment not found " },
      {
        status: 404,
      }
    );
  else {
    try {
      const createReplay = await prisma.replay.create({
        data: {
          content: res.content,
          comment_id: +res.comment_id,
          author_id: +res.author_id,
        },
      });
      return NextResponse.json(createReplay, {
        status: 200,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          message: "Error creating replay",
        },
        {
          status: 500,
        }
      );
    }
  }
};
