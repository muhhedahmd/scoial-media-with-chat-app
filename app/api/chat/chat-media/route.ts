import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CustomSession } from "../get-message/route";

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const Msg_id = searchParams.get("Msg_id");
  const session = (await getServerSession(authOptions)) as CustomSession;
  const userId = session?.user?.id;
  if (!session || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!Msg_id) {
    return NextResponse.json(
      {
        error: "Msg_id is required",
      },
      {
        status: 400,
      }
    );
  }
  try {
    const msg = await prisma.message.findUnique({
      where: {
        id: +Msg_id,
        OR :[
            {
                senderId  : +userId
            }, 
            {
                receiverId : +userId
            }
        ]
      },
      select:{
        messageMedia: true
      }
    });
    return NextResponse.json(msg?.messageMedia || [], {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error fetching message media",
      },
      {
        status: 500,
      }
    );
  }
};
