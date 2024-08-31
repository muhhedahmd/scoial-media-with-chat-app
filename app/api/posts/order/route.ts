
// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";


// export const GET = async ()=>{
//     const group_post= await prisma.post.findMany({
//         select:{
//             title:true,
//             reaction:{
//                 select :{
//                     // count: true ,
//                     type :true ,
//                 }
//             }
//         },
//         orderBy: {
//             reaction:{
// _count :
//             }
//         }
//     })
//     return NextResponse.json(group_post)
// } 