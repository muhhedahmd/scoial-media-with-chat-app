import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export interface togglefollowInfer {
  main_user_id: number;
  author_user_id: number;
  state: "follow" | "follow back" | "following";
}

export const POST = async (req: Request) => {
  // const Url = new URL(req.url);
  const body = (await req.json()) as togglefollowInfer;
  const main_user_id = body.author_user_id;
  const author_user_id = body.main_user_id;
  const state = body.state;

  if (!main_user_id || !author_user_id)
    return NextResponse.json({ state: "the ids not entered" }, { status: 400 });
  const main_user_find = await prisma.profile.findUnique({
    where: { id: main_user_id },
  });
  const author_user_find = await prisma.profile.findUnique({
    where: { id: author_user_id },
  });
  if (!main_user_find || !author_user_find)
    return NextResponse.json({ state: "the ids not found" }, { status: 404 });

  const where: Prisma.FollowsWhereUniqueInput = {
    followerId_followingId: {
      followerId: main_user_id,
      followingId: author_user_id,
    },
  };
  const isAlreadyFollowing = await prisma.follows.findUnique({
    where: where,
  });
  const isAlreadyFollower = await prisma.follows.findUnique({
    where: {
      followerId_followingId: {
        followerId: author_user_id,
        followingId: main_user_id,
      },
    },
  });

  if (!isAlreadyFollowing && state === "follow") {
    const follow = await prisma.follows.create({
      data: {
        followerId: main_user_id,
        followingId: author_user_id,
      },

      
    });
    return NextResponse.json(
      { state: "followed", id: follow.id },
      { status: 200 }
    );
  } else if (isAlreadyFollower && state === "follow back") {
    console.log({
      data: {
        followingId: main_user_id,
        followerId: author_user_id,
      },
      state,
      isAlreadyFollowing,
    });

    const follow = await prisma.follows.create({
      data: {
        followingId: author_user_id,
        followerId: main_user_id,
      },
    });
    return NextResponse.json(
      {
        state: "following",
        id: {
          data: {
            followingId: main_user_id,
            followerId: author_user_id,
          },
          follow,
          state,
          isAlreadyFollowing,
        },
      },
      { status: 200 }
    );
  } else if (isAlreadyFollowing && state === "following") {
    const follow = await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: main_user_id,
          followingId: author_user_id,
        },
      },
    });
    return NextResponse.json(
      { state: "unfollow", id: follow.id },
      { status: 200 }
    );
  } else {
    return NextResponse.json({ state: "unfollow", test: "t" }, { status: 200 });
  }
};
