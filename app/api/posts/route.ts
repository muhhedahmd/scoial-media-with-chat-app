import prisma from "@/lib/prisma";
import { post } from "@prisma/client";
import { NextResponse } from "next/server";

export type shapeOfPostsRes = {
  id: number;
  title: string | null;
  author_id: number;
  created_at: Date;
  updated_at: Date
  parentId: number | null;
  published: number | null;
  shared: {
    id: number;
    content: string;
    post_id: number | null;
    createdAt: Date;
    updatedAt: Date;
    sharedBy: number | undefined;
  } | null;
  parent: {
    parent_author_id: number;
    mainParentId: Date;
    created_at: Date;
    updated_at: Date;
    parentTitle: string
  } | null;
};

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const pgNum = +(searchParams.get("pgnum") ?? 0);
  const pgSize = +(searchParams.get("pgsize") ?? 500);

  const allPostsSortedByInteractions = await prisma.post.findMany({
    include: {
      Share: {
        include: {
          post: {
            select: {
              author: {
                select: { id: true },
              },

            },
          },
        },
      },
      // Include the parent post and its author
      parent: {
        // Assuming you have a self-referencing relationship called `parentPost`
        select: {
          id: true,
          title:true,
          author_id: true,
          created_at: true,
          updated_at: true,
        },
      },
      _count: {
        select: {
          Interactions: true,
        },
      },
    },
    orderBy: {
      Interactions: {
        _count: "desc",
      },
    },
    skip: pgNum * pgSize,
    take: pgSize,
  });

  const fromat = allPostsSortedByInteractions.map((x) => {
    return {
      id: x.id,
      title: x.title,
      author_id: x.author_id,
      created_at: x.created_at,
      updated_at: x.updated_at,
      parentId: x.parentId,
      published: x.parentId,
      shared: x.Share
        ? {
            id: x.Share?.id,
            content: x.Share.content,
            post_id: x.Share?.post_id,
            createdAt: x.Share?.createdAt,
            updatedAt: x.Share?.updatedAt,
            sharedBy_author_id: x.author_id,
          }
        : null,
      parent: x.parent && {
        mainParentId: x.parent.id,
        parent_author_id: x.parent.author_id,
        created_at: x.parent.created_at,
        updated_at: x.parent.updated_at,
        parentTitle :x.parent.title
      },
    };
  }) as shapeOfPostsRes[];

  return NextResponse.json(fromat, {
    status: 200,
  });
};
