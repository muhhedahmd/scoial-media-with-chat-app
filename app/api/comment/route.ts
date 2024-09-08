import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export interface FixedComment {
  id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
  innteractId: number | null;
  interactionShareId: number | null;
  author_id: number 
  post_id: number 
}

export const GET = async (req: Request) => {




  const Url = new URL(req.url);
  const { searchParams } = Url;
  const post_id = parseInt(searchParams.get("post_id")!);
  const comment_skip = +(searchParams.get("comment_skip") ?? 0);
  const comment_take = +(searchParams.get("comment_take") ?? 5);

  if (!post_id)
    return NextResponse.json(
      {
        message: "unExpected id",
      },
      { status: 404 }
    );

  const Post = await prisma.post.findUnique({
    where: {
      id: post_id,
    },
  });
  if (!Post)
    return NextResponse.json({ message: "post not found" }, { status: 400 });
  else {
    try {


      const Comment = await prisma.comment.findMany({
        where: {
          Interaction: {
            postId: post_id,
          },
        },
        include: {
          Interaction: {
            select: {
              postId: true,
              author_id: true,
            },
          },
        },
        skip : (comment_skip * comment_take ),
       take : (comment_take) ,
      });
      const fixed = Comment.map((c) => {
        return {
          id: c.id,
          content: c.content,
          created_at: c.created_at,
          updated_at: c.updated_at,
          innteractId: c.innteractId,
          author_id: c.Interaction?.author_id,
          post_id: c.Interaction?.postId,
        };
      })  as FixedComment[]


      return NextResponse.json(fixed, {
        status: 200,
      });
    } catch (error) {
      return NextResponse.json(
        {
          message: error,
        },
        { status: 400 }
      );
    }
  }
};
