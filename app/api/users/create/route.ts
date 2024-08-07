import prisma from "@/lib/prisma"
import { User } from "@prisma/client"
import { hash } from "bcrypt"
import { NextResponse } from "next/server"

  export async function POST( ReqUser :Request) {
    const body : {email : string, password : string,   name :string ,   } =await  ReqUser.json()
    if(!ReqUser) return 

    console.log(body)
   
 
    if(!body || !body.email || !body.password) return NextResponse.json({message : "the password or email doesn't entered "} , {status:400})

    const EmailCheck  =  await prisma.user.findUnique({
        where :{
            email : body.email
        }
    })
    if(!!EmailCheck) return NextResponse.json({message : "this email is already exisit"} , {status : 400})

        else {
            const password = await hash(body.password , 10)
            const user = await prisma.user.create({
                data: {
                    email : body.email ,
                    first_name:body.name,
                    password:password
                }
            })

            const {email , first_name , role}  = user
            return NextResponse.json({email ,first_name , role} , {
                status : 201
            })
        
        }
        


    
}


  // const user = await prisma.user.create({
  //     data: {
  //         email: "clientTest100@prisma.com",
  //         first_name: "test",
  //         role: "user",
  //         post: {
          
          
          
  //             create: {
  //                 title: "test post with connect",
  //                 published: true,
  //                 like_num: 2,
  //                 categories: {
  //                         create : { 
  //                             category  : {
  //                                   connectOrCreate:{
  //                                     where : { 
  //                                         id :5
  //                                     }    , 
  //                                    create :  {
  //                                         name:"abc"
  //                                     }
  //                                   }
  //                             }
  //                         }
  //                 },
  //             },
  //         },
     
  //     },
  // });
