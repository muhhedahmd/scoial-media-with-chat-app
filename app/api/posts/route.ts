import prisma from "@/lib/prisma";
import { Address, post, post_image } from "@prisma/client";
import { NextResponse } from "next/server";

export type shapeOfPostsRes = {
  post_imgs ?: post_image[] 
  id: number;
  address : Address | null,
  title: string | null;
  author_id: number;
  created_at: Date;
  updated_at: Date
  parentId: number | null;
  published: number | null;
  shared: {
    
    id: number;
    address : Address | null,
    content: string;
    post_id: number | null;
    createdAt: Date;
    updatedAt: Date;
    sharedBy: number | undefined;
  } | null;
  parent: {
    parentAddress : Address | null
    parent_author_id: number;
    mainParentId: Date;
    created_at: Date;
    updated_at: Date;
    parentTitle: string
  } | null;
};

// async function main() {
//   //   const stream = await prisma.notification.stream({ name: 'notification-stream'})
//     const stream = await prisma.user.stream({
//       name: "all-user-events"
//     })
//     for await (const event of stream) {
//       console.log('New event:', event)
//     }
//   }

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const pgNum = +(searchParams.get("pgnum") ?? 0);
  const pgSize = +(searchParams.get("pgsize") ?? 10);

  const allPostsSortedByInteractions = await prisma.post.findMany({
    include: {
      addrees : true ,
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

// import prisma from "./prisma"




  const fromat = allPostsSortedByInteractions.map((x) => {
    return {
      address : x.addrees ,
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
