
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export const GET = async ()=>{
    const group_post= await prisma.post.findMany({
        select:{
            title:true,
            like_num:true
        },
        orderBy: {
            like_num: 'asc',
        }
    })
    return NextResponse.json(group_post)
} 