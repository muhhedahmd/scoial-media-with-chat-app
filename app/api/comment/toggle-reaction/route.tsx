import prisma from "@/lib/prisma";
import { Prisma, reactionsComment } from "@prisma/client";
import { NextResponse } from "next/server";

export interface ShapOfResToggleReactionComments {
  emoji: {
    id: number;
    comment_id: number;
    emoji: string;
    imageUrl: string;
    names: Prisma.JsonValue;
    author_id: number;
    post_id: number ;
  };
  tag: "delete" | "updated" | "add";
}

export interface ShapOfArgsToggleReactionComments {
  author_id: number;
  emoji: string;
  post_Id: number;
  comment_id: number;
  names: string[];
  imageUrl: string;
}
export const POST = async (req: Request) => {
  const body = await req.json();

  const { author_id, comment_id, emoji, imageUrl, post_Id, names } =
    body as ShapOfArgsToggleReactionComments;

  if (!author_id || !comment_id  || !post_Id) {
    return NextResponse.json(
      {
        post_Id : post_Id ,
        author_id,

        comment_id ,
        message: "Invalid request",
      },
      {
        status: 404,
      }
    );
  }
  const findUSer = await prisma.user.findUnique({
    where: {
      id: +author_id,
    },
  });
  if (!findUSer) {
    return NextResponse.json(
      {
        message: "user Not found",
      },
      {
        status: 400,
      }
    );
  }
  const findComment = await prisma.comment.findUnique({
    where: {
      id: +comment_id,
    },
  });
  let findInterAction = await prisma.interaction.findUnique({
    where: {
      author_id_postId_type: {
        author_id: +author_id,
        postId: +post_Id,
        type: "COMMENTREACT",
      },
    },
  });

  if (!findInterAction) {
    findInterAction = await prisma.interaction.create({
      data: {
        author_id: +author_id,
        postId: +post_Id,
        type: "COMMENTREACT",
      },
    });
  }

  try {
    const where: Prisma.reactionsCommentWhereUniqueInput = {
      comment_id_innteractId: {
        innteractId: +findInterAction.id,
        comment_id: +comment_id,
      },
    };


    if (!!findComment) {
      const FindCommentEoji = await prisma.reactionsComment.findUnique({
        where,
      });

      if (FindCommentEoji) {
        if (emoji === FindCommentEoji.emoji) {
          const emoji = await prisma.reactionsComment.delete({
            where: where,
          });

          return NextResponse.json(
            { emoji, tag: "delete" },
            {
              status: 200,
            }
          );
        } else {
          const UpdateReaction = await prisma.reactionsComment.update({
            where: where,
            data: {
              emoji,
              names,
              imageUrl,
            },
          });

          const fixed = {
            emoji: {
              id: UpdateReaction.id,
              comment_id: UpdateReaction.comment_id,
              emoji: UpdateReaction.emoji,
              imageUrl: UpdateReaction.imageUrl,
              names: UpdateReaction.names,
              author_id: findInterAction.author_id,
              post_id: findInterAction.postId,
            },
            tag: "updated",
          } as ShapOfResToggleReactionComments;

          return NextResponse.json(
            fixed,
            {
              status: 200,
            }
          );
        }
      }
    }

    const CreateReaction = await prisma.reactionsComment.create({
      data: {
        emoji,
        imageUrl,
        comment_id: +comment_id,
        names,
        innteractId: findInterAction?.id,
      },
    });

    const fixed = {
      emoji: {
        id: CreateReaction.id,
        comment_id: CreateReaction.comment_id,
        emoji: CreateReaction.emoji,
        imageUrl: CreateReaction.imageUrl,
        names: CreateReaction.names,
        author_id: findInterAction.author_id,
        post_id: findInterAction.postId,
      },
      tag: "add",
    } as ShapOfResToggleReactionComments;

    return NextResponse.json(fixed, {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Error",
      },
      {
        status: 500,
      }
    );
  }
};
