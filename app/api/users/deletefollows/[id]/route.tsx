import prisma from "@/lib/prisma";
import axios from "axios";
import { Pragati_Narrow } from "next/font/google";
import { NextResponse } from "next/server";

export const DELETE = (
    _: Request,
  {params}: {params: { id: number } }
)=>{

    if(!params.id) return NextResponse.json({message  : "user Not Found "  } , {status :404})
    else {
        try {
            const deleteFollows = prisma.follows.findFirst({
                where :{id:  +params.id}
            })
            
            return NextResponse.json({message : deleteFollows}, {status : 200})
        } catch (error) {
            return NextResponse.json({message : "Error deleting follows "}, {status : 500})
            
            
        }

    }
    
} 
