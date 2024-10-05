import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req :Request)=>{
    const url = new URL(req.url);
    
        const author_id = +url.searchParams.get("author_id")! ;
        const skip = +(url.searchParams.get("skip") ?? 0);
        const take = +(url.searchParams.get("take") ?? 10);
    if(!author_id ){
        return NextResponse.json({
            message : "invalid request"
        } , {
            status : 400
        })
    }

        try {
            
            const get_cate = await prisma.save_catagory.findMany({
                where:{
                    author_id  :  author_id
                },
                take : take ,
                skip : skip
                
            })

            return NextResponse.json(
                get_cate ,
                {
                    status :200
                }
            )
        } catch (error) {
            console.log(error);
            return NextResponse.json({
                message: 
                "An error occurred while fetching data",
            } , {
                status :500
            })
        }
            
}