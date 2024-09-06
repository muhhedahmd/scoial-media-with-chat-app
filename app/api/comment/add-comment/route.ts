import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.json();
  const res = body as { content: string; post_id: number; author_id: number };

  const where: Prisma.InteractionWhereUniqueInput = {
    author_id_postId_type: {
      type :"COMMENT",
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
  if (!findPost)
    return NextResponse.json(
      { message: "Post not found " },
      {
        status: 404,
      }
    );
  else {
    try {
      const result = await prisma.$transaction(async (tx) => {
        if(findPost.author_id !== res.author_id )
        {

          const c = await tx.comment.create({
            data: {
              content: res.content,
              Notification: {
                create: {
                  notifyingId: findPost.author_id, // The user receiving the notification
                  notifierId: res.author_id, // The user who performed the action (e.g., commented)
                  type: "COMMENT",
                },
              },
              Interaction: {
                connectOrCreate: {
                  where: where,
                  create: {
                    author_id: res.author_id,
                    postId: res.post_id,
                    type: "COMMENT",
                  },
                },
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
          });
          const fixed = {
            id: c.id,
            content: c.content,
            created_at: c.created_at,
            updated_at: c.updated_at,
            innteractId: c.innteractId,
            interactionShareId: c.interactionShareId,
            author_id: c.Interaction?.author_id,
            post_id: c.Interaction?.postId,
          };
  
          return fixed;
        }
        else {
          const c = await tx.comment.create({
            data: {
              content: res.content,
              Interaction: {
                connectOrCreate: {
                  where: where,
                  create: {
                    author_id: res.author_id,
                    postId: res.post_id,
                    type: "COMMENT",
                  },
                },
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
          });
          const fixed = {
            id: c.id,
            content: c.content,
            created_at: c.created_at,
            updated_at: c.updated_at,
            innteractId: c.innteractId,
            interactionShareId: c.interactionShareId,
            author_id: c.Interaction?.author_id,
            post_id: c.Interaction?.postId,
          };
  
          return fixed;
        }
      });

      // Return the created comment and notification
      return NextResponse.json(result, {
        status: 201,
      });
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
