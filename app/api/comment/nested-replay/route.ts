import { parseDataType } from "@/app/maintimeline/_conponents/PostContainerComponsnts/CommentComp/CommentAddation";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { create } from "domain";
import { NextResponse } from "next/server";

export type shapeOfNestedReplayArg = {
  content: string;
  comment_id: number;
  author_id: number;
  post_id: number;
  replayid: number;
  parsedData: string
}

export type shapeOfNestedReplayRes = {
  id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
  parentId: number | null;
  innteractId: number | null;
  interactionShareId: number | null;
  author_id: number | undefined;
  post_id: number
}


export const POST = async (req: Request) => {
  const body = await req.json();
  const res = body as shapeOfNestedReplayArg
  const parsed = JSON.parse(res.parsedData) as parseDataType;
  const mentions = parsed.mentions;
  if (!res.author_id || !res.content || !res.comment_id) {
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
  const where: Prisma.InteractionWhereUniqueInput = {
    author_id_postId_type: {
      type: "REPLAY",
      author_id: res.author_id,
      postId: res.post_id,
    },
  };
  const findReplay = await prisma.replay.findUnique({
    where: {
      id: +res.replayid,
    },
    include:{
      Interaction:{
        select:{
          author_id :true
        }
      }
    }
  });
  if (!findReplay) {
    return NextResponse.json(
      { message: "Replay not found" },
      {
        status: 404,
      })
  }
  const findComment = await prisma.comment.findUnique({
    where: {
      id: +res.comment_id,
    },
  });
  if (!findComment)
    return NextResponse.json(
      { message: "comment not found" },
      {
        status: 404,
      }
    );
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
      let findInteraction = await prisma.interaction.findUnique({
        where,
      });
      if (!findInteraction) {
        findInteraction = await prisma.interaction.create({
          data: {
            type: "REPLAY",
            author_id: res.author_id,
            postId: res.post_id,
            
          },
        });
      }

      const c = await prisma.replay.create({
        data: {
          content: res.content,
          innteractId: findInteraction?.id,
          comment_id: res.comment_id,
          parentId: res.replayid,
          Notification: {
            create: {
              notifyingId: findPost.author_id, // The user receiving the notification
              notifierId: res.author_id, // The user who performed the action (e.g., commented)
              type: "REPLAY",
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
      if (+res.author_id !== +findInteraction?.author_id!) {
        await prisma.notification.create({
          data: {
            notifierId: +res.author_id,
            notifyingId: +findInteraction?.author_id!,
            type: "REPLAY_IN_REPLAY",
            commentId: findComment.id,
            replayId :c.id,
            postId: findPost.id,
          },
        });
      }


      if (mentions) {
        
        mentions.forEach(async (m) => {
          if(m.id !== findInteraction?.author_id)
            {

              const mention = await prisma.mention.create({
                data: {
                  
                  mentionType: "REPLAY",
                  replayId: c.id,
                  endPos: m.endIndex,
                  startPos: m.startIndex,
                  userId: +m.id,
                  interactioneId: findInteraction.id,
                  postId: findPost.id,
                  commentId: findComment.id,
                  notifcation: {
                    
                    create: {
                  notifierId: +res.author_id,
                  notifyingId: +m.id,
                  commentId : findComment.id ,
                  postId : findPost.id ,
                  replayId: c.id,
                  type: "MENTION_REPLAY",
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
        parentId : c.parentId ,
        innteractId: c.innteractId,
        author_id: c.Interaction?.author_id,
        post_id: c.Interaction?.postId,
      } as shapeOfNestedReplayRes
      return NextResponse.json(fixed, {
        status: 200,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          message: "Error creating replay",
        },
        {
          status: 500,
        }
      );
    }
  }
};
