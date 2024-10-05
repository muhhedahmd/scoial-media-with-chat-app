import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"






export const GET = async (_ :any, { params }: { params: { id: string } }) => {
console.log(params)

    const selectUser = await prisma.user.findFirst({
        where :{
            id : +params.id
        }
    })
    if(!!selectUser)
    {

        const findUserProfile  = await prisma.profile.findUnique({
            where  :{
                user_id : +params.id
            },
            include :{
                user :{
                    select : {
                        first_name :true ,
                        last_name: true ,
                        user_name: true,
                        email  :true ,
                        isPrivate :true , 
                        
                    }
                },
                profilePictures : true
            }
        })
        
        if(!!findUserProfile ) {
            return NextResponse.json(findUserProfile , {status : 200})
        }
        else {
            console.log("error")
            return NextResponse.json({message : "Profile Not completed" }  , {status :400})
        }
        
    }
    else {
        
        return NextResponse.json({message : "This user is not exisit" }  , {status :400})
    }
        
}