import prisma from "@/lib/prisma";
import { Prisma, replayLikes } from "@prisma/client";
import { NextResponse } from "next/server";

export interface ShapOfResToggleReplayLikes {
  replay: {
    id: number;
    replay_id: number;
    created_at: Date;
    updated_at: Date;
    innteractId: number;
    interactionShareId: number | null;
    author_id?: number;
    post_id?: number | null
    
  };
  tag?: "delete" | "add";
}

export interface ShapOfArgsToggleReplayLikes {
  author_id: number;
  post_Id: number;
  replay_id: number;

}
export const POST = async (req: Request) => {
  const body = await req.json();

  const { author_id, replay_id, post_Id } = body as ShapOfArgsToggleReplayLikes;

  if (!author_id || !replay_id || !post_Id) {
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
    select: {
      first_name: true,
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

  let findInterAction = await prisma.interaction.findUnique({
    where: {
      author_id_postId_type: {
        author_id: +author_id,
        postId: +post_Id,
        type: "REPLAY_LIKE",
      },
    },
  });

  if (!findInterAction) {
    findInterAction = await prisma.interaction.create({
      data: {
        author_id: +author_id,
        postId: +post_Id,
        type: "REPLAY_LIKE",
      },
    });
  }

  try {
    const where: Prisma.replayLikesWhereUniqueInput = {
      replay_id_innteractId: {
        innteractId: +findInterAction.id,
        replay_id: +replay_id,
      },
    };

    const FindreplayLike = await prisma.replayLikes.findUnique({
      where,
    });

    if (!!FindreplayLike) {
      const replay = await prisma.replayLikes.delete({
        where: where,
      });

      return NextResponse.json(
        { replay, tag: "delete" },
        {
          status: 200,
        }
      );
    }

    const CreateReaction = await prisma.replayLikes.create({
      data: {
        replay_id: +replay_id,
        innteractId: findInterAction?.id,
      },
    });

    const fixed = {
      replay: {
        id: CreateReaction.id,
        replay_id: CreateReaction.replay_id,
        author_id: findInterAction.author_id,
        post_id: findInterAction.postId,
        created_at: CreateReaction.created_at,
        updated_at: CreateReaction.updated_at,
      },
      tag: "add",
    } as  ShapOfResToggleReplayLikes

    return NextResponse.json(fixed, {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: error,
      },
      {
        status: 500,
      }
    );
  }
};
