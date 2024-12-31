import { authOptions } from "@/lib/authOptions"
import { CustomSession } from "../get-message/route"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

 



 export const GET = async (req: Request)=>{
    const session = await getServerSession(authOptions) as CustomSession
    const userId = session?.user?.id
  
    if (!session || !userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  
    const url = new URL(req.url)
    const chatId = url.searchParams.get('chatId')
    const skip = +(url.searchParams.get("skip") ?? 0)
    const take = +(url.searchParams.get("take") ?? 10)
  

 }