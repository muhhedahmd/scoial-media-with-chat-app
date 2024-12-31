import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import {
  Chat,
  Message,
  MessageMedia,
  ProfilePicture,
  VideoChat,
} from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export interface CustomSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export type MessageOfChatTypePrivate = Chat & {
  VideoChat: VideoChat[];

  messages: (Omit<Message, "content"> & {
    messageMedia: MessageMedia[];
    sender: {
      id: number;
      email: string;
      first_name: string;
      user_name: string;
      last_name: string;
      profile: {
        profilePictures: ProfilePicture[] | undefined;
      } | null;
    };
  
  })[];
  _count: {
    messages: number;
  };
};

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as CustomSession;
  const userId = session?.user?.id;

  if (!session || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const chatId = url.searchParams.get("chatId");
  const skip = +(url.searchParams.get("skip") ?? 0);
  const take = +(url.searchParams.get("take") ?? 10);

  if (!chatId) {
    return NextResponse.json({ error: "ChatId is required" }, { status: 400 });
  }

  try {
    const findMessage = await prisma.chat.findUnique({
      where: {
        id: +chatId,
      },
      include: {
        VideoChat: {
          include: {
            sender: {

              select: {
              first_name :true ,
              last_name :true ,
                profile: {
                  select: {
                    profilePictures: {
                      where: {
                        type: "profile",
                      },
                    },
                  },
                },
              },
            },
            receiver: {
              select: {
                first_name :true ,
                last_name :true ,
                profile: {
                  select: {
                    profilePictures: {
                      where: {
                        type: "profile",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        messages: {
          select: {
            id: true,
            chatId: true,
            senderId: true,
            receiverId: true,
            encryptedContent: true,
            iv: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            likes: true,
            messageMedia: true,
            GroupMember: true,
            sender: {
              select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                user_name: true,
                profile: {
                  select: {
                    id: true,
                    profilePictures: {
                      where: {
                        type: "profile",
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
          take: take,
          skip: skip * take,
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });

    return NextResponse.json(findMessage as MessageOfChatTypePrivate, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
