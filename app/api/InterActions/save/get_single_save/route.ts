import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { shapeOfPostsRes } from "../../../posts/route";

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const save_id = +url.searchParams.get("save_id")!;

  if (!save_id)
    return NextResponse.json(
      {
        message: "inValid Request",
      },
      {
        status: 400,
      }
    );
  try {
    const getSavePost = await prisma.save.findUnique({
      where: {
        id: +save_id,
      },
      select: {
        Interaction: {
          select: {
            post: {
              include: {
                Share: true,
                parent: true,
              },
            },
          },
        },
      },
    });

    if (!getSavePost?.Interaction.post)
      return NextResponse.json(
        {
          message: "Save post not found",
        },
        {
          status: 404,
        }
      );

    const fixed = {
      id: getSavePost?.Interaction.post.id,
      title: getSavePost?.Interaction.post.title,
      author_id: getSavePost?.Interaction.post.author_id,
      created_at: getSavePost?.Interaction.post.created_at,
      updated_at: getSavePost?.Interaction.post.updated_at,
      parentId: getSavePost?.Interaction.post.parentId,
      published: getSavePost?.Interaction.post.parentId,
      shared: getSavePost?.Interaction.post.Share
        ? {
            id: getSavePost?.Interaction.post.Share?.id,
            content: getSavePost?.Interaction.post.Share.content,
            post_id: getSavePost?.Interaction.post.Share?.post_id,
            createdAt: getSavePost?.Interaction.post.Share?.createdAt,
            updatedAt: getSavePost?.Interaction.post.Share?.updatedAt,
            sharedBy_author_id: getSavePost?.Interaction.post.author_id,
          }
        : null,
      parent: getSavePost?.Interaction.post.parent && {
        mainParentId: getSavePost?.Interaction.post.parent.id,
        parent_author_id: getSavePost?.Interaction.post.parent.author_id,
        created_at: getSavePost?.Interaction.post.parent.created_at,
        updated_at: getSavePost?.Interaction.post.parent.updated_at,
        parentTitle: getSavePost?.Interaction.post.parent.title,
      },
    } as shapeOfPostsRes;
    return NextResponse.json(fixed, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching post" },
      { status: 500 }
    );
  }
};
