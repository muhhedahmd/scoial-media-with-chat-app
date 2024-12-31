import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { CustomSession } from '../get-message/route';
import prisma from '@/lib/prisma';
import { Room } from '@prisma/client';


export async function POST(req: Request) {
      const session = (await getServerSession(authOptions)) as CustomSession;
      const userId = session?.user?.id;
    

      if (!session || !userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    

  try {
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { chatId } = await req.json() as{ 
      chatId: string
    };



    
    const chat = await prisma.chat.findUnique({
      where: { id: +chatId },
      include: { members: true , room: {
        include :{
          participants : true
        }
      }},
    });


    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    let room : Room = chat.room!
    // if(!chat.room){
    //   room =  await prisma.room.create({
    //     data: {
    //       chats: {
    //         connect: {
    //           id : chat.id
    //         }
    //       },
    //       name :"",
    //       type:"VIDEO_GROUP",
    //       participants: {
    //         createMany:{
    //            data: chat.members.map((mem)=>{ return {userId : mem.userId , 
    //           }}),
    //             skipDuplicates :true 
    //         }
    //       } ,
    //     } ,
    //     include:{
    //       participants : true
    //     }
    //   })
    // }
    const runingCall = await prisma.videoChat.findFirst({
      where :{
        chat: {
          roomId : chat?.roomId ,
          id : chat.id, 
          VideoChat : {
          some:{
            status : {
              in :["PENDING" , "ONGOING"]
            }
          }
          }
        }
      }
    })
    if(runingCall) {
      return  NextResponse.json({ error: 'there is already call in this room' }, { status: 404 });
    }  

    const videoChat = await prisma.videoChat.create({

      data: {
        chatId: chat.id,
        status : "PENDING",
        senderId: +userId,
        VideoChatParticipant :{
          create:{
            joinedAt : new Date(),
            userId : +userId ,
          }
        }
      },
      include:{
        VideoChatParticipant :true
      }
    });
    const updateUser = await prisma.user.update({
      where:{
        id : +userId
      },
      data:{
        videoCallStatus:"IN_CALL"
      }
    })

 


    return NextResponse.json(videoChat);
  } catch (error) {
    console.error('Error starting video call:', error);
    return NextResponse.json({ error: 'Internal server error'  , error1:error} , { status: 500 });
  }
}

