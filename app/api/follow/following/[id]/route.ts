import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (
  _: Request,
  { params }: { params: { id: number } }
) => {
  const profileFolling = await prisma.profile.findUnique({
    where: {
      user_id: +params.id,
    },
    select: {

      following: true,
    },
  });
  if (!!profileFolling) {
    return NextResponse.json({ profileFolling }, { status: 200 });
  } else {
    return NextResponse.json({ message: "this user not found" }, { status: 400 });
  }
};
