import prisma from "@/lib/prisma";
import { userWithProfile } from "@/Types";
import { Session } from "@prisma/client";
import { compare } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body: { email: string; password: string; user_name: string } =
    await request.json();



  try {
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
      include: {
        profile: {
          select: {
            id: true,
            isCompleteProfile: true,

            user_id: true,
            created_at: true,
            updated_at: true,

          }
        }
      }
    })


    // find the current session  if not create a new one and verfication is none  but the idea how to get the next auth token   

    if (isExisiting.length > 0) {
      const comparePass = await compare(body.password, isExisiting[0].password);
      if (comparePass) {
        const {
          created_at,
          updated_at,
          country,
          expiresAt,
          gender,
          isPrivate,
          is_2FA,
          timezone,
          first_name,
          id,
          last_name,
          role,
          user_name,
          profile,
        } = isExisiting[0]

        return NextResponse.json(
          {
            created_at,
            updated_at,
            country,
            expiresAt,
            gender,
            isPrivate,
            is_2FA,
            timezone,
            first_name,
            id,
            last_name,
            role,
            user_name,
            profile: profile
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
