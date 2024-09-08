import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export type shapeOfReplies = {
  id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
  innteractId: number | null;
  interactionShareId: number | null;
  author_id: number | undefined;
  post_id: number;
  likesCount?: number;
  parentId: number;
  

}

export const GET = async (req: Request) => {
  const url = new URL(req.url);

  const replayNestedSkip = +(url.searchParams.get("replayNestedSkip") ?? 0);
  const replayNestedTake = +(url.searchParams.get("replayNestedTake") ?? 4);

  const replayTake = +(url.searchParams.get("replayTake") ?? 100);
  const replaySkip = +(url.searchParams.get("replaySkip") ?? 0);
  const comment_id = +url.searchParams.get("comment_id")!;

  if (!comment_id)
    return NextResponse.json(
      {
        message: "Invalid Request",
      },
      {
        status: 400,
      }
    );

  // Fetch all replies including nested ones
  const findReplies = await prisma.replay.findMany({
    where: {
      comment_id: comment_id,
    },
    skip: replaySkip * replayTake,
    take: replayTake,
    orderBy: {
      created_at: "desc",
    },
    include: {
      replies: {
        skip: replayNestedSkip * replayNestedTake,
        take: replayNestedTake,
        orderBy: {
          created_at: "desc",
        },
        include: {
          Interaction: {
            select: {
              postId: true,
              author_id: true,
            },
          },
        },
      },
      _count: {
        select: {
          replayLikes: true,
        },
      },
      Interaction: {
        select: {
          postId: true,
          author_id: true,
        },
      },
    },
  });

  // Collect all nested reply IDs to filter out from the top level
  const nestedReplyIds = new Set<number>();
  findReplies.forEach((c) => {
    c.replies.forEach((nested) => {
      nestedReplyIds.add(nested.id);
    });
  });

  // Filter out any reply that appears as a nested reply
  const fixed = findReplies
    .filter((c) => !nestedReplyIds.has(c.id)) // Only keep replies not present in nested
    .map((c) => {
      return {
        id: c.id,
        content: c.content,
        innteractId: c.innteractId,
        author_id: c.Interaction?.author_id,
        post_id: c.Interaction?.postId,
        likesCount: c._count.replayLikes,
        parentId: c.parentId,
        created_at: c.created_at,
        updated_at: c.updated_at,
        

      };
    }) as shapeOfReplies[];

  return NextResponse.json(fixed, { status: 200 });
};
