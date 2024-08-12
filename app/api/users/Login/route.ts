import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body: { email: string; password: string; user_name: string } =
    await request.json();
  console.log({
    ...body,
  });
  const isExisiting = await prisma.user.findMany({
    where: {
      OR: [
        {
          email: body.email,
        },
        {
          user_name: body.user_name,
        },
      ],
    },
  });
  try {
    if (isExisiting.length > 0) {
      const comparePass = await compare( body.password , isExisiting[0].password);
     console.log(comparePass)
      if (comparePass) {
        const {
          email,
          first_name,
          id,
          isCompleteProfile,
          last_name,
          role,
          user_name,
        } = isExisiting[0];
        console.log( {
            email,
            first_name,
            id,
            isCompleteProfile,
            last_name,
            role,
            user_name,
          },)
        return NextResponse.json(
          {
            email,
            first_name,
            id,
            isCompleteProfile,
            last_name,
            role,
            user_name,
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "password incorrect" },
          { status: 400 }
        );
      }
    }
    return NextResponse.json(
      { message: "some thing went wrong" },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json({ message: "try again later" }, { status: 400 });
  }
}
