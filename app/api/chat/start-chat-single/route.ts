import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { FixedContract } from "../contacts-users/route";
import { CustomSession } from "../get-message/route";

export const POST = async (req: Request) => {
  const session = (await getServerSession(authOptions)) as CustomSession;
  const userId = session?.user?.id;

  const body = await req.json()
  console.log(
    body
  )
  const receiverId = body.receiverId as number;
  if (!session || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const findChat = await prisma.chat.findUnique({
      where: {
        creatorId_reciverId: {
          creatorId: +userId,
          reciverId: +receiverId,
        },
      },
    });
    if (findChat) {
      return NextResponse.json(
        {
          message: "Chat is already exisit",
        },
        {
          status: 400,
        }
      );
    }

    const transiction = await prisma.$transaction(async (tx) => {
      return await tx.chat.create({
        data: {
          creatorId: +userId,
          reciverId: +receiverId,
          type: "PRIVATE",
        },
        select: {
          id: true,
          creatorId: true,
          type: true,
          name : true,
createdAt: true,
description :true,
roomId :true,
updatedAt :true,
          members: {
            include: {
              user: {
                select: {
                  id: true,
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
      });
    });

    const oppsiteSide = transiction?.reciver?.id !== +userId ? transiction.reciver : transiction.creator;
    const fixsd : FixedContract = {
        chat: {
          id: transiction.id,
          creatorId: transiction.creatorId,
          reciverId: oppsiteSide?.id!,
          type: transiction.type,

          name : transiction.name ,
          createdAt : transiction.createdAt,
          description : transiction.description,
          roomId : transiction.roomId,
          updatedAt : transiction.updatedAt,
        },
   
        message: {
          ...transiction.messages[0],
        },
        reciver: oppsiteSide,
      };


    return NextResponse.json(fixsd, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creating chat" }, { status: 500 });
  }
};
