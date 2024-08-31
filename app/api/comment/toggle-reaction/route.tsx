import prisma from "@/lib/prisma";
import { Prisma, reactionsComment } from "@prisma/client";
import { NextResponse } from "next/server";



export interface ShapOfResToggleReactionComments {
   emoji :reactionsComment
    tag : |"delete" |"updated" |"add"
  
}
export interface ShapOfArgsToggleReactionComments {
  author_id: number;
  emoji: string;
  comment_id: number;
  names :string[]
  imageUrl: string
  
}
export const POST = async (req: Request) => {
  const body = await req.json();
  
  const { author_id, comment_id, emoji  ,imageUrl ,names} = body as ShapOfArgsToggleReactionComments

  if (!author_id || !comment_id) {
    return NextResponse.json(
      {
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
  try {
    const where: Prisma.reactionsCommentWhereUniqueInput = {
      comment_id_author_id: {
        author_id: +author_id,
        comment_id: +comment_id,
      },
    };
    if (!!findComment) {
      const FindCommentEoji = await prisma.reactionsComment.findUnique({
        where: {
          comment_id_author_id: {
            comment_id: +comment_id,
            author_id: +author_id,
          },
        },
      });

      if (FindCommentEoji) {
        if (emoji === FindCommentEoji.emoji) {
          const emoji = await prisma.reactionsComment.delete({
            where: {
              comment_id_author_id: {
                comment_id: +comment_id,
                author_id: +author_id,
              },
            },
          });

          return NextResponse.json(
            { emoji, tag :"delete"},
            {
              status: 200,
            }
          );
        } else {
          const UpdateReaction = await prisma.reactionsComment.update({
            where: where,
            data: {
              emoji,
              names ,
              imageUrl
            },
          });
          return NextResponse.json(
            { emoji: UpdateReaction, tag :"updated"},
            {
              status: 200,
            }
          );
        }
      }
    } 
      const CreateReaction = await prisma.reactionsComment.create({
        data: {
          comment_id: +comment_id,
          author_id: +author_id,
          emoji,
          names ,
          imageUrl
        },
      });

      return NextResponse.json(
        { emoji: CreateReaction, tag : "add" },
        {
          status: 200,
        }
      );
    
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
