import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const userId = url.searchParams.get("user_id")!;
  const skip = +(url.searchParams.get("skip") ?? 0);
  const take = +(url.searchParams.get("take") ?? 4);

  if (!userId) {
    return NextResponse.json(
      {
        message: "invalid request",
      },
      {
        status: 400,
      }
    );
  }
  const FindUSer = await prisma.user.findUnique({
    where: {
      id: +userId,
    },
  });
  if (!FindUSer)
    return NextResponse.json(
      {
        message: "user Not found",
      },
      {
        status: 404,
      }
    );

  try {
    const findNotifcation = await prisma.notification.findMany({
      where: {
        notifyingId: +userId,
    
      },
      orderBy: {
        
        createdAt: "desc",
      },

      skip: skip * take,
      take: take,
    });
    return NextResponse.json(findNotifcation, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "error",
        error: error,
      },
      {
        status: 500,
      }
    );
  }
};
