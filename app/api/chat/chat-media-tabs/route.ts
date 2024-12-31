import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { CustomSession } from "../get-message/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export type ChatMediaTabsType = "video&image" | "video" | "image" | "link" | "others" | "audio";
export const GET = async (req: Request) => {
  const url = new URL(req.url);
  // const userId = url.searchParams.get("userId");
  const session = (await getServerSession(authOptions)) as CustomSession;
  const userId = +session?.user?.id;

  if (!session || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }



  const chatId = url.searchParams.get("chatId");
  const skip = +(url.searchParams.get("skip") ?? 0);
  const take = +(url.searchParams.get("take") ?? 10);
  const type = url.searchParams.get("type") as ChatMediaTabsType;

  if (!chatId) {
    return NextResponse.json({ error: "ChatId is required" }, { status: 400 });
  }

  try {
    if (type === "link") {

      const links = await prisma.messageLinks.findMany({
        where: {
          Message: {
            chatId: +chatId!,
            OR: [
              {
                senderId: +userId!,
              },
              {
                receiverId: +userId!,
              },
            ],
          },
        },
      
      });
      return NextResponse.json(links, {
        status: 200,
      });
    } else if (type?.toLocaleLowerCase() === "video&image") {
      const chatMedia = await prisma.messageMedia.findMany({
        where: {
          OR :[
            {
              type : {
                startsWith   :"video"
              } ,

            } ,
            {
              type : {
                startsWith : "image"
              }
            }
          ],
     

          message: {
            chatId: +chatId!,
            OR: [
              {
                senderId: +userId!,
              },
              {
                receiverId: +userId!,
              },
            ],
          },
        },

        take: take,
        skip: skip * take,
      });
      return NextResponse.json(chatMedia, { status: 200 });
    } else if (
      type?.toLocaleLowerCase() === "video" ||
      type?.toLocaleLowerCase() === "image" ||
      type?.toLocaleLowerCase() === "audio"  
    ) {
      const chatMedia = await prisma.messageMedia.findMany({
        where: {
          type: {
            mode: "insensitive",
            startsWith: type,
          },
          message: {
            chatId: +chatId!,
            OR: [
              {
                senderId: +userId!,
              },
              {
                receiverId: +userId!,
              },
            ],
          },
        },

        take: take,
        skip: skip * take,
      });
      return NextResponse.json(chatMedia, { status: 200 });
    } else if (
     
      type === "others"
    ) {
      const chatMedia = await prisma.messageMedia.findMany({
        where: {
        
         AND : [
          { 
            type : {
            
              not :{

                startsWith : "image"
              }
            },
          },
          {
            type : {
              not :{

                startsWith : "video"
              }
            },
          },
          {
            type : {
              not : {

                startsWith : "audio"
              }
            },
          },
         ],
          message: {
            chatId: +chatId!,
            OR: [
              {
                senderId: +userId!,
              },
              {
                receiverId: +userId!,
              },
            ],
          },
        },

        take: take,
        skip: skip * take,
      });
      return NextResponse.json(chatMedia, { status: 200 });
    } else {
      const chatMedia = await prisma.messageMedia.findMany({
        where: {
          message: {
            chatId: +chatId!,
            OR: [
              {
                senderId: +userId!,
              },
              {
                receiverId: +userId!,
              },
            ],
          },
        },
        take: take,
        skip: skip * take,
      });

      return NextResponse.json(chatMedia, {
        status: 200,
      });
    }
  } catch {
    return NextResponse.json(
      { error: "Error fetching chat media" },
      { status: 500 }
    );
  }
};
