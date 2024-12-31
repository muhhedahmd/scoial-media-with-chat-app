import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CustomSession } from "../get-message/route";
import { Chat, GroupMember, Message } from "@prisma/client";
import { UserWithPic } from "../contacts-users/route";

export type  startChatGroupReq = {
    name: string | null  , 
    description: string | null ,
    memberIds: number[]
}

export type FixedContractGroup = {
    chat: Chat;
    members?: UserWithPic[] ;
    message: Message;
    // reciver: Reciver;
  };

export const POST = async (req: Request) => {
  const session = (await getServerSession(authOptions)) as CustomSession;
  const userId = session?.user?.id;

  if (!session || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description, memberIds } = body as startChatGroupReq
    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const uniqueMemberIds = [...new Set([+userId, ...memberIds.map(id => +id)])];

    const transaction = await prisma.$transaction(async (tx) => {
      const newChat = await tx.chat.create({
        data: {
          creatorId: +userId,
          type: "GROUP",
          name,
          description,
          members: {
            create: uniqueMemberIds.map(memberId => ({
              userId: memberId,
              role: memberId === +userId ? "ADMIN" : "MEMBER"
            }))
          }
        },
        include: {
          members: {
            select: {
              user: {
                select: {
                  id: true,
                  email :true ,
                  first_name: true,
                  last_name: true,
                  user_name: true,
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
            // select: {
            //   id: true,
            //   likes: true,
            //   createdAt: true,
            //   status: true,
            //   encryptedContent: true,
            //   iv: true,
            // },
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
        },
      });

      return newChat;
    });

    const fixed : FixedContractGroup = {
        chat: {
          id: transaction.id,
          creatorId: transaction.creatorId,
          type: transaction.type,
          name : transaction.name ,
          createdAt : transaction.createdAt,
          description : transaction.description,
          roomId : transaction.roomId,
          updatedAt : transaction.updatedAt,
          reciverId : null

        },
   
        message: {
            ...transaction.messages[0],
        },
        members :transaction.members.map((member)=>{
            return {
              first_name : member.user.first_name,
              last_name : member.user.last_name,
              email : member.user.email,
              id: member.user.id,
              profile :{
                profilePictures : member.user.profile?.profilePictures
              },
              user_name:member.user.user_name

            }
        })
      };
    return NextResponse.json(fixed, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creating group chat" }, { status: 500 });
  }
};

