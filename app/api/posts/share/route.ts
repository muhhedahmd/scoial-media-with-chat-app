import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.json();
  const { auther_id, content, postId } = body as {
    postId: Number;
    auther_id: number;
    content: string;
  };
  if (!postId || !auther_id || !content)
    return NextResponse.json(
      {
        message: "Invalid request",
      },
      {
        status: 400,
      }
    );
  const findUser = await prisma.user.findUnique({
    where: {
      id: +auther_id,
    },
    select: {
      first_name: true,
      last_name: true,
    },
  });
  if (!findUser) {
    return NextResponse.json(
      {
        message: "user Not found",
      },
      {
        status: 404,
      }
    );
  }
  const findPost = await prisma.post.findUnique({
    where: {
      id: +postId,
    },
  });
  if (!findPost) {
    return NextResponse.json(
      {
        message: "post Not Found",
      },
      {
        status: 404,
      }
    );
  }

  if (!!findUser || !!findUser) {
    try {
      const Share = await prisma.share.create({
        data: {
          author_id: +auther_id,
          post_id: +postId,
          content: content,
        },
      });
      return NextResponse.json(Share, {
        status: 200,
      });
    } catch (error) {
      return NextResponse.json(
        {
          message: "can't share this post ",
        },
        {
          status: 400,
        }
      );
    }
  }
};
