import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { CustomSession } from "../get-message/route";
import prisma from "@/lib/prisma";
import { Room } from "@prisma/client";

export async function PUT(req: Request) {
  const session = (await getServerSession(authOptions)) as CustomSession;
  const userId = session?.user?.id;

  if (!session || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId, videoCallId } = (await req.json()) as {
      chatId: string;
      videoCallId: string;
      // participantId: string
    };

    const chat = await prisma.chat.findUnique({
      where: { id: +chatId },
      include: {
        members: true,
        room: {
          include: {
            participants: true,
          },
        },
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const runingCall = await prisma.videoChat.findFirst({
      where: {
        chat: {
          roomId: chat?.roomId,
          id: chat.id,
          VideoChat: {
            some: {
              status: {
                in: ["PENDING", "ONGOING"],
              },
            },
          },
        },
      },
    });
    if (runingCall?.endTime) {
      return NextResponse.json(
        { error: "this call is ended" },
        { status: 404 }
      );
    }

    const videoChat = await prisma.videoChat.update({
      where: {
        id: +videoCallId,
      },
      data: {
        VideoChatParticipant: {
          update: {
            where: {
              userId_videoChatId: {
                userId: +userId,
                videoChatId: +videoCallId,
              },
              // userId : +participantId
            },
            data: {
              leftAt: new Date(),
            },
          },
        },
      },
      include: {
        VideoChatParticipant: true,
      },
    });

    if (videoChat.VideoChatParticipant.every((user)=>user.leftAt !== null)) {

    const ended =   await prisma.videoChat.update({
        where: {
          id: +videoCallId,
        },
        data: {
          endTime: new Date(),
          status: "ENDED",
        },
        include:{
          VideoChatParticipant : true
        }
      });
      return NextResponse.json(ended , {
        status:200
      });

    }
    await prisma.user.update({

      where: {
        id: +userId,
      },
      data: {
        videoCallStatus: "AVAILABLE",
      },
    });

    return NextResponse.json(videoChat , {
      status: 200,
    });
  } catch (error) {
    console.error("Error starting video call:", error);
    return NextResponse.json(
      { error: "Internal server error", error1: error },
      { status: 500 }
    );
  }
}
