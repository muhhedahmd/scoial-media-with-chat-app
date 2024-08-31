import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const PostId = +searchParams.get("PostId")!;
  const author_id = +searchParams.get("author_id")!;
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
        id : +PostId,
        
    },
  });

  if (!!FindPost) {
    try {
        const Profile =await prisma.profile.findUnique({
            where: {
                user_id : +author_id,
                
                
            },
            select :{
                profile_picture :true ,
                user :{
                    select :{
                        id:true,
                        first_name :true ,
                        last_name:true ,
                        user_name :true ,

                    }
                }
            }
          });


        return NextResponse.json(
            Profile ,
   
            {
                status :200
            }
        )
    } catch (err: any) {
      return NextResponse.json({
        error: "comment prisma canont find ",
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
