import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"



export const GET = async (req :Request )=>{
    const url = new URL(req.url)

    const replaySkip = +(url.searchParams.get("replaySkip") ?? 0)
    const replayTake = +(url.searchParams.get("replayTake") ?? 4 )
    const comment_id = +(url.searchParams.get("comment_id")!)

if( !comment_id)
    return NextResponse.json({
message : "invalid Request"} ,{
    status:400
})    
const findComment = await prisma.replay.findMany({
    where:{
        comment_id :comment_id
    },
    skip :replaySkip * replayTake, 
    take :replayTake
    ,orderBy :{
        created_at :"desc"
    }
})
return NextResponse.json(findComment  , {status :200})


}