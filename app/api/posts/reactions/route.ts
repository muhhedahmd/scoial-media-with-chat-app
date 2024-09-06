import prisma from "@/lib/prisma";
import { ReactionType } from "@prisma/client";
import { NextResponse } from "next/server";




export type reactionType = {
  author_id: number;
  post_id: number;
  id: number;
  type: ReactionType;
  created_at: Date;
  updated_at: Date;
  innteractId: number;
  interactionShareId: number | null;
}
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const PostId = +searchParams.get("PostId")!;
  if (!PostId)
    return NextResponse.json(
      {
        error: "PostId is required",
      },
      {
        status: 404,
      }
    );

  const FindPost = await prisma.post.findUnique({
    where: {
      id: +PostId,
    },
  });

  if (!!FindPost) {
    try {
   
      const FindInteraction = await prisma.interaction.findMany({
        where: {
          type :"REACTION",
          postId : PostId
        },
        select:{
          reaction : true,
          author_id: true
        }
      });
      const Fixed = FindInteraction.flatMap((d)=>{
        return    d.reaction.map((x)=>{
              return {
                ...x ,
                author_id: d.author_id,
                post_id : PostId,


              }
            }) 
          
        
      })
  

      return NextResponse.json(
        Fixed,

        {
          status: 200,
        }
      );
    } catch (err: any) {
      return NextResponse.json({
        error: "reactions prisma canont find ",
      });
    }
  } else {
    return NextResponse.json(
      {
        error: "post not found",
      },
      {
        status: 404,
      }
    );
  }
};
