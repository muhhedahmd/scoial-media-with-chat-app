import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const main_user_id = parseInt(url.searchParams.get("main_user_id")!);
  const author_user_id = parseInt(url.searchParams.get("author_user_id")!);

  if (!main_user_id || !author_user_id) {
    return NextResponse.json(
      { message: "The IDs were not entered" },
      { status: 400 }
    );
  }

  const mainUserFind = await prisma.profile.findUnique({
    where: { id: main_user_id },
  });

  const authorUserFind = await prisma.profile.findUnique({
    where: { id: author_user_id },
  });

  if (!mainUserFind || !authorUserFind) {
    return NextResponse.json(
      { message: "The user was not found" },
      { status: 400 }
    );
  }

  // Check if main_user_id follows author_user_id
  const isAlreadyFollowing = await prisma.follows.findUnique({
    where: {
      followerId_followingId: {
        followerId: author_user_id,
        followingId: main_user_id,
      },
    },
  });

  if (isAlreadyFollowing) {
    return NextResponse.json(
      { state: "following", id: isAlreadyFollowing.id },
      { status: 200 }
    );
  }

  // Check if author_user_id follows main_user_id (mutual follow)
  const isAlreadyFollower = await prisma.follows.findUnique({
    where: {
      followerId_followingId: {
        followerId: main_user_id,
        followingId: author_user_id,
      },
    },
  });

  if (isAlreadyFollower) {
    return NextResponse.json(
      { state: "follow back", id: isAlreadyFollower.id },
      { status: 200 }
    );
  }

  // Default state
  return NextResponse.json({ state: "follow" }, { status: 200 });
};
