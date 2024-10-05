import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (
  _: Request,
  { params }: { params: { id: number } }
) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: {
        user_id: +params.id,
      },
    });
    if (!profile) return;
    const profileFollwer = await prisma.follows.count({
      where: {
        followerId: profile.id,
      },
    });

      return NextResponse.json(
        { followerCount: profileFollwer },
        { status: 200 }
      );

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "error", error }, { status: 500 });
  }
};
