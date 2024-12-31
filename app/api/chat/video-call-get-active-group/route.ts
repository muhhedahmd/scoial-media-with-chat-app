import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { CustomSession } from "../get-message/route";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as CustomSession;
  const userId = session?.user?.id;
  try {
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { roomId, chatId } = await req.json();
    const isMemberInthisRoom = await prisma.chat.findFirst({
      where: {
        id: +chatId,
        room: {
          id: +roomId,
          participants: {
            some: {
              userId: +userId,
            },
          },
        },
      },
    });

    if (!isMemberInthisRoom) {
      return NextResponse.json(
        { error: "You are not a member of this room" },
        {
          status: 403,
        }
      );
    }

    const findVideoChatActive = await prisma.videoChat.findFirst({
      where: {
        chatId: +chatId,
        status: {
          in: ["ONGOING", "PENDING"],
        },
        chat: {
          roomId,
        },
      },
      include: {
        VideoChatParticipant: true,
      },
    });

    return NextResponse.json(
      findVideoChatActive ,
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error joining video call:", error);
    return NextResponse.json(
      { error: "Internal server error"  ,error1 :error},
      { status: 500 }
    );
  }
}
