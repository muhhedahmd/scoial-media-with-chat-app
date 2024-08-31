


import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
    
    const { searchParams } = new URL(req.url);
    console.log(searchParams);
    const user_id = +searchParams.get("userId")!;
    if (!user_id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  } else {
    const user = await prisma.user.findUnique({ where: { id: user_id }  , 
    select :{
        id: true,
        first_name: true,
        email: true,
        last_name :true ,
        user_name:true
    }
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    } else {
      return NextResponse.json(user, { status: 200 });
    }
  }
};
