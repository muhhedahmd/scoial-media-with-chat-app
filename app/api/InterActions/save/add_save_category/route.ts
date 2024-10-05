import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"



export const POST = async (req : Request)=>{

    const body = await req.json()
    const {
        name ,
        author_id ,
    } = body as {
        name : string ,
        author_id : number ,
    }
    if(!name ||!author_id)
        return NextResponse.json({ error : 'Missing required fields' }, { status : 400 })
    const findUser = await prisma.user.findUnique({
        where :{
            id : author_id ,
        }
    })
    if(!findUser)
        return NextResponse.json({ error : 'User not found' }, { status : 404 })

    try {
        const isExting = await prisma.save_catagory.findUnique({
            where :{
                author_id_name :{
                    author_id , 
                    name 
                }
            }
        })
        if(isExting)
            return NextResponse.json({ error : 'Save already exists' }, { status : 409 })
        const new_category = await prisma.save_catagory.create({
            data :{
                    author_id,
                    name
                }
            
        })
        return NextResponse.json(new_category, { status : 201 })
        // const new_category = await prisma.
        
    } catch (error) {
        return NextResponse.json({ error : error }, { status : 500 })
        
    }


}