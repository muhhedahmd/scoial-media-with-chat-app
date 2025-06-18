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

        const { password } = await req.json();



        const findUser = await prisma.user.findUnique({
            where: {
                id: +userId,
            }
        })

        if (!findUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const checkPassword = await compare(password, findUser?.password)


        if (checkPassword) {
            return NextResponse.json({ message: "Password is correct" }, { status: 200 });
        } else {
            return NextResponse.json({ error: "Password is incorrect" }, { status: 400 });

        }



    } catch (error) {

        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}