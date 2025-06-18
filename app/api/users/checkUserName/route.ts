import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { CustomSession } from "@/Types";
import { compare } from "bcrypt";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export const POST = async (req: Request) => {


    try {


        const session = (await getServerSession(authOptions
        )) as CustomSession;
        const userId = session?.user?.id;

        if (!session || !userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { userName } = await req.json();



        const findUser = await prisma.user.findUnique({
            where: {
                user_name  : userName,

            },
            select:{
                user_name :true 
            }
        })

        if (!findUser) {
            return NextResponse.json({ message: "user name is ready to use" }, { status: 200 });
        }else{
            return NextResponse.json({ message: "user name is already taken" }, { status: 400 });

        }






    } catch (error) {

        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}