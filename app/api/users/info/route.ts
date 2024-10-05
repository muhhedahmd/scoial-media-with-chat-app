import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const userId = +url.searchParams.get("userId")!;

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

    const followingCount = await prisma.profile.findMany({
      where: {
        user_id :userId 

      },
      select :{
        followers : true
      }
    });

    const interactionComment = await prisma.interaction.findMany({
      where: {
        author_id: userId,
        type: {
          in: ["COMMENT"],
        },
      },
    });
    const interactionReplay = await prisma.interaction.findMany({
      where: {
        author_id: userId,
        type: {
          in: ["REPLAY"],
        },
      },
    });
    const interactionShares = await prisma.interaction.findMany({
      where: {
        author_id: userId,
        type: {
          in: ["SHARE"],
        },
      },
    });
    const interactionReplayLikes = await prisma.interaction.findMany({
      where: {
        author_id: userId,
        type: {
          in: ["REPLAY_LIKE"],
        },
      },
    });
    const interactionCommentLikes = await prisma.interaction.findMany({
      where: {
        author_id: userId,
        type: {
          in: ["COMMENTREACT"],
        },
      },
    });
    const interactionPostsLikes = await prisma.interaction.findMany({
      where: {
        author_id: userId,
        type: {
          in: ["REACTION"],
        },
      },
    });

      const followerCount = await prisma.profile.findMany({
        where: {
          user_id :userId 
  
        },
        select :{
          following : true
        }
      });
  
    return NextResponse.json(
      {
        followerCount,
        followingCount,
        interactionPostsLikes,
        interactionComment,
        interactionReplay,
        interactionShares,
        interactionReplayLikes,
        interactionCommentLikes,
      },
      {
        status: 200,
      }
    );
    return NextResponse.json(followerCount, {
      status: 200,
    });
  } catch (error) {}
};
