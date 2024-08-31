import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (
  _: Request,
  { params }: { params: { id: number } }
) => {
  const profileFollwer = await prisma.profile.findUnique({
    where: {
      user_id: +params.id,
    },
    select: {
      followers: true,
    },
  });
  if (!!profileFollwer) {
    return NextResponse.json({ profileFollwer }, { status: 200 });
  } else {
    return NextResponse.json({ message: "this user not found" }, { status: 400 });
  }
};
