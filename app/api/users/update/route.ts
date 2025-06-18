import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { CustomSession } from "@/Types";
import { Gender, Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export const PUT = async (
    req: Request
) => {
    try {
        const formData = await req.formData();
        const session = (await getServerSession(authOptions
        )) as CustomSession;
        const userId = session?.user?.id;

        if (!session || !userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const first_name = formData.get("first_name") as string
        const last_name = formData.get("last_name") as string
        const user_name = formData.get("user_name") as string
        const Email = formData.get("Email") as string
        const gender = formData.get("gender") as Gender
        const role = formData.get("role") as Role

        const findUser = await prisma.user.findUnique({ where: { id: userId } });

        if (!findUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const Update =  {
                first_name: first_name ?  first_name  : findUser.first_name ,
                last_name: last_name ?  last_name :  findUser.last_name ,
                user_name: user_name ? user_name :  findUser.user_name ,
                email: Email ?  Email  : findUser.email ,
                gender: gender ?  gender :  findUser.gender ,
                role: role ?  role  : findUser.role ,
            }
            console.log(Update , findUser)
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: Update,
            select:{
                first_name: true,
                last_name: true,
                user_name: true,
                email: true,
                gender: true,
                role: true
            }
        });
    return NextResponse.json(updatedUser, { status: 200 });

    } catch (err) {
        console.log(err)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

    }


}