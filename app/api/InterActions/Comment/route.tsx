import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.json();
  const { postId } = body as { postId: number };

  // const where: Prisma.InteractionShareWhereUniqueInput = {
  //   author_id_shareId: {
  //     shareId: 1,
  //     author_id: 2,
  //   },
  // };

  const where: Prisma.InteractionWhereUniqueInput = {
    author_id_postId: {
      postId: 1,
      author_id: 2,
    },
  };

  try {
    // const result = await prisma.$transaction(async (tx) => {
    //   // const c = await tx.comment.create({

    //   //   data: {
    //   //     content: "a",
    //   //    Notification:{
    //   //      create: {
    //   //       notifyingId: 1,
    //   //       notifierId: 2,
    //   //       type: "COMMENT",
    //   //     }},
    //   //     Interaction: {
    //   //       connectOrCreate: {
    //   //         where: where,
    //   //         create: {
    //   //           author_id: 1,
    //   //           postId: 1,
    //   //           type: "COMMENT",
    //   //         },
    //   //       },
    //   //     },
    //   //   },

    //   // });

    //   const c = await tx.share({
    //     data: {
    //       content :"hello share",
    //      post_id :4 ,
    //      InteractionShare:{
    //       connectOrCreate :{
    //         where:where ,
    //         create:{

    //           author_id :1 ,
    //           type :"SHARE"

    //         }
    //       },

    //      },
    //      Notification :{
    //       create: {
    //         notifyingId: 2, // The user receiving the notification
    //         notifierId: 1, // The user who performed the action (e.g., commented)
    //         type: "SHARE",
    //       },
    //      },
    //      Mention:{
    //       create:{
    //         // where:{
    //         //   id: "1"
    //         // } ,
    //         userId : 1,
    //         startPos:0,
    //         endPos:0 ,
    //         mentionType:"SHARE" ,

    //         }
    //      }

    //     },
    //     include :{

    //       Notification :true ,
    //       InteractionShare :true ,
    //       Mention :true ,
    //     }
    //   })

    //   return c ;

    // });

    // Return the created comment and notification
    const result = await prisma.interaction.findUnique({
      where: where,
    });
    if (!result) return;
    const CreateReation = await prisma.reaction.create({
      data: {
        innteractId: +result?.id,
        type: "like",
      },
    });

    return NextResponse.json(result, {
      status: 201,
    });
  } catch (error) {
    // Handle any errors during the transaction
    console.error("Transaction failed:", error);
    return NextResponse.json(
      { error: "Failed to create comment and notification" },
      {
        status: 500,
      }
    );
  }
};
