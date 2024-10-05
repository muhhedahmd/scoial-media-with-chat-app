import { parserData } from "@/app/_componsents/mentionComp/MentionDropDown";
import { parseDataType } from "@/app/maintimeline/_conponents/PostContainerComponsnts/CommentComp/CommentAddation";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.json();
  const res = body as {
    content: string;
    post_id: number;
    author_id: number;
    parsedData: string;
  };
  const parsed = JSON.parse(res.parsedData) as parseDataType;
  const mentions = parsed.mentions;

  console.log(mentions, parsed, res.content, res.post_id);

  const where: Prisma.InteractionWhereUniqueInput = {
    author_id_postId_type: {
      type: "COMMENT",
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
      const c = await prisma.comment.create({
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
              id :true ,
              postId: true,
              author_id: true,
            },
          },
        },
      });
      if (+res.author_id !== +findPost?.author_id!) {

        await prisma.notification.create({
          data: {
            
            notifierId: +res.author_id,
            notifyingId: +findPost?.author_id!,
            postId: findPost.id,
            commentId: c.id,
            type: "COMMENT",
          },
        });
      }
      if (mentions) {
        
        mentions.forEach(async (m) => {
          if(m.id !== findPost.author_id)
            {

              const mention = await prisma.mention.create({
                data: {
                  
                  mentionType: "COMMENT",
                  endPos: m.endIndex,
                  startPos: m.startIndex,
                  userId: +m.id,
                  interactioneId: c.Interaction?.id,
                  postId: findPost.id,
                  commentId: c.id,
                  notifcation: {
                    
                    create: {
                  notifierId: +res.author_id,
                  notifyingId: +m.id,
                  commentId : c.id ,
                  postId : findPost.id ,
                  type: "MENTION_COMMENT",
                },
              },
            },
          });
        } 
        });
        
      }


      const fixed = {
        id: c.id,
        content: c.content,
        created_at: c.created_at,
        updated_at: c.updated_at,
        innteractId: c.innteractId,
        author_id: c.Interaction?.author_id,
        post_id: c.Interaction?.postId,
      };

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
