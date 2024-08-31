import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export const GET = async ()=>{
    const aggPost= await prisma.post.aggregate({
        
        _sum :{
            id : true

        }
        ,
        _avg :{
            id : true
        },
        _max :{
            id : true
        },
        
        cursor:{
            id:3, 
      
        }
    })

    return NextResponse.json(aggPost , {status : 200})

} 