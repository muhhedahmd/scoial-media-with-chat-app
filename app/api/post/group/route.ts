
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export const GET = async ()=>{
    const group_post= await prisma.post.groupBy({
        by:["author_id"],

        _sum:{
            
            like_num:true
        }
        ,_avg:{
            like_num:true
        }
        
    })
    return NextResponse.json(group_post)
} 