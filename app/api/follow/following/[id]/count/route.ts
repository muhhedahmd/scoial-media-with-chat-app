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
    const profileFollwing = await prisma.follows.count({
      where: {
          followingId: profile.id,
      },
    });


    if (!!profileFollwing) {
      return NextResponse.json({followingCount: profileFollwing}, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "this user not found" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "error", error }, { status: 500 });
  }
};
