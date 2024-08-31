import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const query = url.searchParams;
  const comment_id = query.get("comment_id");
  if (!comment_id) {
    return NextResponse.json(
      {
        message: "invalid Request",
      },
      {
        status: 400,
      }
    );
  }
  try {
    const reactions = await prisma.reactionsComment.findMany({
      where: {
        comment_id: +comment_id,
      },
    });
    return NextResponse.json(reactions, {
      status: 200,
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: "comment not found",
      },
      {
        status: 404,
      }
    );
  }
};
