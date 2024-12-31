import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/utils";
import {
  Chat,
  ChatType,
  GroupMember,
  GroupRole,
  MessageStatus,
  ProfilePicture,
} from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { CustomSession } from "../get-message/route";

// Define the type for the returned data outside the function
export type UserWithPic = {
  role?: GroupRole;
  id: number;
  email: string;
  first_name: string;
  user_name: string;
  last_name: string;
  profile: {
    profilePictures: ProfilePicture[] | undefined;
  } | null;
};

type Message = {
  id: number;
  status: MessageStatus;
  encryptedContent: string;
  iv: string;
  createdAt: Date;
  likes: number;
};

type Member = {
  id: number;
  joinedAt: Date;
  lastReadMessageId: number | null;
  leftAt: Date | null;
  role: GroupRole;
  user: UserWithPic;
};

export type FixedContract = {
  chat: Chat;
  members?: {
    id: number;
    email: string;
    first_name: string;
    user_name: string;
    last_name: string;
    profile: {
      profilePictures: ProfilePicture[] | undefined;
    } | null;
    memberId: number;
    joinedAt: Date;
    leftAt: Date | null;
    role: GroupRole;
    lastReadMessageId: number | null;
  }[];
  message: Message;
  reciver?: UserWithPic | null;
};

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const params = url.searchParams;
  const skip = parseInt((params.get("skip") as string) ?? "0") || 0;
  const type = params.get("type") as string as ChatType;
  const take = parseInt((params.get("take") as string) ?? "10") || 10;

  const session = (await getServerSession(authOptions)) as CustomSession;
  const userId = session?.user?.id;

  if (!session || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const findChats = await prisma.chat.findMany({
      where: {
        type: {
          in: type ? [type] : ["FAST_GROUP", "GROUP", "PRIVATE"],
        },

        OR: [
          {
            creatorId: +userId,
          },
          {
            reciverId: +userId,
          },
          {
            members: {
              some: {
                userId: +userId,
              },
            },
          },
          {
            groupInvitation: {
              some: {
                userId: +userId,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        creatorId: true,
        type: true,
        name: true,
        description: true,
        roomId: true,
        reciverId: true,
        createdAt: true,
        updatedAt: true,

        members: {
          include: {
            user: {
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
          skip: 0,
          take: 4,
        },
        messages: {
          select: {
            id: true,
            likes: true,
            createdAt: true,
            status: true,
            encryptedContent: true,
            iv: true,
          },
          skip: 0,
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
        creator: {
          select: {
            user_name: true,
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            profile: {
              select: {
                profilePictures: true,
              },
            },
          },
        },
        reciver: {
          select: {
            user_name: true,
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            profile: {
              select: {
                profilePictures: true,
              },
            },
          },
        },
      },
      skip: take * skip,
      take: take,
    });

    const fixed: FixedContract[] = findChats.map((chat) => {
      const oppsiteSide = chat?.reciver
        ? chat?.reciver.id !== +userId
          ? chat.reciver
          : chat.creator
        : null;

      return {
        chat: {
          id: chat.id,
          creatorId: chat.creatorId,
          name: chat.name,
          createdAt: chat.createdAt,
          description: chat.description,
          reciverId: chat.reciverId,
          roomId: chat.roomId,
          updatedAt: chat.updatedAt,
          type: chat.type,
          receiverId: oppsiteSide?.id!,
        },
        members: chat.members.map((member) => {
          return {
            memberId: member.id,
            joinedAt: member.joinedAt,
            leftAt: member.leftAt,
            role: member.role,
            lastReadMessageId: member.lastReadMessageId,
            first_name: member.user.first_name,
            last_name: member.user.last_name,
            email: member.user.email,
            id: member.user.id,
            profile: {
              profilePictures: member.user.profile?.profilePictures,
            },
            user_name: member.user.user_name,
          };
        }),

        message: {
          ...chat.messages[0],
        },
        reciver: oppsiteSide || null,
      };
    });
    return NextResponse.json(fixed, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Error getting contracts",
      },
      {
        status: 400,
      }
    );
  }
};
