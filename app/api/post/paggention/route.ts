
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// offset pagantion 
// export const GET = async (req: Request)=>{
    
//     const  {searchParams}  = new URL(req.url) 
//     console.log(searchParams)
//     const pgNum =  +(searchParams.get("pgnum") ?? 0) 
//     const pgSize =  +(searchParams.get("pgsize")?? 10) 

//     const paggantion_post= await prisma.post.findMany({
    //        skip:pgNum  * pgSize,
    //         take:pgSize
    //     })
    //     if(paggantion_post.length) return NextResponse.json(paggantion_post)
    //         else { 
    //             return NextResponse.json({message : "You have reach the end"} , {status:400} )
    //         }
    // } 
    
    
// offset cusor 
export const GET = async (req: Request)=>{
    
    const  {searchParams}  = new URL(req.url) 
    console.log(searchParams)
    const cursor =  +(searchParams.get("cursor") ?? 0) 
    const pgSize =  +(searchParams.get("pgsize")?? 10) 

    const paggantion_post= await prisma.post.findMany({
           cursor :{
            id : cursor

           },
            take:pgSize
        })
        if(paggantion_post.length) return NextResponse.json(paggantion_post)
            else { 
                return NextResponse.json({message : "You have reach the end"} , {status:400} )
            }
    } 
