import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"




export const GET = async (req :Request)=>{
const Url = new URL(req.url)
const {searchParams} =Url
const post_id = parseInt(searchParams.get("post_id")!)
const comment_skip =  +(searchParams.get("comment_skip") ?? 0)
const comment_take = +(searchParams.get("comment_take") ?? 5) 

if(!post_id) return NextResponse.json({
    message :"unExpected id"
},{status :404})

const Post =  await prisma.post.findUnique({
    where:{
        id : post_id
    }
})
if(!Post ) return NextResponse.json({message: "post not found"} ,{status :400})

else {
    try {
        const Comment = await prisma.comment.findMany({
            where :{
                post_id : post_id
            },
            skip : (comment_skip * comment_take ),
            take : (comment_take) ,
        }) 
        return NextResponse.json(Comment , {
            status: 200
        })
        
    } catch (error) {
        return NextResponse.json({
            message : error
        } , {status: 400})
    }
}

}