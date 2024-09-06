import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { shapeOfReplies } from "../replay/route";

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const skip = +(url.searchParams.get("skip") ?? 0);
  const take = +(url.searchParams.get("take") ?? 4);
  const parent_Id = +url.searchParams.get("parent_Id")!;
  if (!parent_Id)
    return NextResponse.json({ message: "invalid Request" }, { status: 404 });
  const findNested = await prisma.replay.findMany({
    where: {
      parentId: +parent_Id,
    },
    include: {
      Interaction: {
        select: {
          author_id: true,
          postId: true,
        },
      },
    },
    skip: skip, // Correct pagination
    take: take,
  });
  if (!!findNested) {
    const fixed = findNested.map((c) => {
      return {
        id: c.id,
        content: c.content,
        innteractId: c.innteractId,
        interactionShareId: c.interactionShareId,
        author_id: c.Interaction?.author_id,
        post_id: c.Interaction?.postId,
        parentId: c.parentId,
        created_at: c.created_at,
        updated_at: c.updated_at,
      };
    }) as shapeOfReplies[];

    return NextResponse.json(fixed, {
      status: 200,
    });
  } else {
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 400,
      }
    );
  }
};
