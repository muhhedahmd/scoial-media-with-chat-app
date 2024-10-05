import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { shapeOfPostsRes } from "../../posts/route";

export const POST = async (req: Request) => {
  const body = await req.json();
  const res = body as { content: string; post_id: number; author_id: number };

  const where: Prisma.InteractionWhereUniqueInput = {
    author_id_postId_type: {
      type: "SHARE",
      author_id: res.author_id,
      postId: res.post_id,
    },
  };
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
    select: {
      first_name: true,
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

  let interaction = await prisma.interaction.findUnique({
    where: {
      author_id_postId_type: {
        author_id: res.author_id,
        postId: res.post_id,
        type: "SHARE",
      },
    },
  });
  if (!interaction) {
    interaction = await prisma.interaction.create({
      data: {
        author_id: res.author_id,
        postId: res.post_id,
        type: "SHARE",
      },
    });
  }
  if (!findPost)
    return NextResponse.json(
      { message: "Post not found " },
      {
        status: 404,
      }
    );
  else {
    try {



      const x = await prisma.share.create({
        data: {
          content: res.content,

          post: {
            // connectOrCreate: {
            //   where: {
            //     id: findPost.id,
            //   },
              create: {
                author_id: res.author_id,
                parentId: findPost.id,
                title: "",
                Interactions: {
                  connect: {
                    id: interaction.id,
                  },
                // },
              },
            },
          },
        },

        include: {
          post: {
            include: {
              parent: true,
            },
          },
        },
      });

      const fixed =
        x && x?.post
          ? {
              id: x.post?.id,
              title: x.post?.title,
              author_id: x.post?.author_id,
              created_at: x.post?.created_at,
              updated_at: x.post?.updated_at,
              parentId: x.post?.parent?.id,
              published: x.post?.published,
              shared: x
                ? {
                    id: x?.id,
                    content: x.content,
                    post_id: x.post_id,
                    createdAt: x.createdAt,
                    updatedAt: x.updatedAt,
                    sharedBy_author_id: x.post.author_id,
                  }
                : null,
              parent: x.post &&
                x?.post.parent && {
                  mainParentId: x.post.parent.id,
                  parent_author_id: x.post.parent.author_id,
                  created_at: x.post.parent.created_at,
                  updated_at: x.post.parent.updated_at,
                  parentTitle: x.post.parent.title,
                },
            }
          : ({} as shapeOfPostsRes);


          
      // if (findPost.author_id !== res.author_id) {
      //   await prisma.notification.create({
      //     data: {
      //       notifyingId: findPost.author_id, // The user receiving the notification
      //       notifierId: res.author_id, // The user who performed the action (e.g., commented)
      //       type: "SHARE",
      //       postId: x?.post?.id! ,
      //       shareId :x.id ,


      //     },
      //   });
      // }
      return NextResponse.json(fixed, {
        status: 201,
      });
      // Return the created comment and notification
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
