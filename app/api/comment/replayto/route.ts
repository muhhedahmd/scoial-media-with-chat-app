import prisma from "@/lib/prisma"



export const GET = async (req : Request)=>{

    const url = new URL(req.url)
    const replayid = +url.searchParams.get("replayid")!
    const parentid = +url.searchParams.get("parentid")!
    const comment_id = +url.searchParams.get("comment_id")!

    const findReplayUserId = await prisma.replay.findFirst({
        where: { 
            parentId : + parentid
        },
        select :{
            
        }
    })

    

}