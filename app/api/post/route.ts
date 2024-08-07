
import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"


export const GET = async  ()=>{
    // const user = await prisma.user.findMany({
    //     where:{

            
    //         post:{
            
    //             every:{
    //                 published:true
    //             }
                
    //         }

            
            
           
    //     }
    // })
    const post = await prisma.post.findMany({
        where :{

            
            author:{
                first_name :{
                    
                equals:   "Joun",
                // mode:"insensitive"
                
                }
            
                    
            }
            
        },
        select:{
            
            title:true , 
            published:true,
            author:true , 
            // categories:true
        }   ,   
            
            // include : {
            //     categories:true, 
            //     author:true
            // }   
            

        }
        
    
    )
   

} 


// export const GET = async  ()=>{
//     const posts = await prisma.post.findMany({
//         where:{
            
//             OR :[
//                 {
//                     title:{
//                         contains:"git",
//                         mode:"insensitive"
//                     }
                    
//                 },
//                 {
//                     title:{
//                         mode:"insensitive",
//                         contains: "react"
//                     }
//                 }

//             ],
//             AND:[
//                 {
//                     published : true
//                 }

//             ]

            
            
           
//         }
//     })
//     return NextResponse.json(posts, {status : 200})

// } 

// GT - > > 
// GTE -> >= 
// where:{
//     first_name: "Joun" 
//     ,id :{
//         notIn :[1,2,3]
        // gt : 2,

//     }
// }