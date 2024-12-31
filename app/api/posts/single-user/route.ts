import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { shapeOfPostsRes } from "../route";

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const userId = +url.searchParams.get("userId")!;
  const skip = +(url.searchParams.get("skip") ?? 0);
  const take = +(url.searchParams.get("take ") ?? 10);

  if (!userId) {
    return NextResponse.json(
      {
        message: "inValid Request",
      },
      {
        status: 400,
      }
    );
  }
  try {
    const findPosts = await prisma.post.findMany({
      where: {
        author_id: userId,
      },
      include: {
        Share: {
          include: {
            post: {

              select: {
                addrees : true ,
                author: {
                  select: { id: true },
                },
  
              },
            },
          },
        },
        addrees : true ,

        parent :{
          include:{
            addrees:true
          }
        }
    },
    skip: skip * take,
    take: take,

    });
    if(!findPosts ) return 
    const fromat = findPosts.map((x) => {
        return {
          address : x.addrees,
          id: x.id,
          title: x.title,
          author_id: x.author_id,
          created_at: x.created_at,
          updated_at: x.updated_at,
          parentId: x.parentId,
          published: x.parentId,
          shared: x.Share
            ? {
                address : x.Share?.post?.addrees,
                id: x.Share?.id,
                content: x.Share.content,
                post_id: x.Share?.post_id,
                createdAt: x.Share?.createdAt,
                updatedAt: x.Share?.updatedAt,
                sharedBy_author_id: x.author_id,
              }
            : null,
          parent: x.parent && {
            parentAddress : x.parent.addrees,
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
  } catch (error) {
    return NextResponse.json(
      {
        message: "inValid Request",
      },
      {
        status: 404,
      }
    );
  }
};
