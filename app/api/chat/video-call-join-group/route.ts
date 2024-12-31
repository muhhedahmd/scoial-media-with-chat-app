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
    const { videoChatId } = await req.json();

    const videoChat = await prisma.videoChat.findUnique({
      where: { id: videoChatId },
      include: { VideoChatParticipant: true },
    });
    
    if (!videoChat) {
      return NextResponse.json(
        { error: "Video chat not found" },
        { status: 404 }
      );
    }



    const isParticipant = videoChat.VideoChatParticipant.some(
      (participant) => participant.userId === +userId
    );

    if (isParticipant) {
      return NextResponse.json({ error: "is already participant" }, { status: 403 });
    }
    // Update the participant's joinedAt time
  const  ChatParticipant=  await prisma.videoChatParticipant.create({
     data :{
      videoChatId : videoChatId ,
      userId : +userId ,
     }
     
    });

    return NextResponse.json( ChatParticipant);
  } catch (error) {
    console.error("Error joining video call:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
