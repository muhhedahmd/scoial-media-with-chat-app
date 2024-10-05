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

  const post_id = +searchParams.get("post_id")!;
  const author_id = +searchParams.get("author_id")!;
  if (!post_id)
    return NextResponse.json(
      {
        error: "inValid request",
      },
      {
        status: 404,
      }
    );

    

  const FindPost = await prisma.post.findUnique({
    where: {
      id: +post_id,
    },
  });

  if (!!FindPost) {
    try {
   
      const FindInteraction = await prisma.interaction.findMany({
        where: {
          type :"PIN",
          postId : post_id,
          author_id : author_id
        },
        select:{
          pin : true,
        }
      });
      const Fixed = FindInteraction.flatMap((d)=>{
        return    d.pin.map((x)=>{
              return {
                ...x ,
                author_id: author_id  ,
                post_id : post_id,


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
      console.log(err)
      return NextResponse.json({
        error: "pins canont find ",
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
