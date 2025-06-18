import prisma from "@/lib/prisma";
import { userWithProfile } from "@/Types";
import { Gender, Role } from "@prisma/client";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";



export async function POST(req: Request) {

  const response  = await req.json();
 
  const {email,
    password,
    first_name  :firstName,
    last_name :  lastName,
    gender,
    user_name :userName,
    role } =  response  as {
      email: string;
      password: string;
      first_name: string;
      last_name : string;
      gender: Gender;
      user_name: string;
      role: Role;

    }


  if (
    !email ||
    !password ||
    !firstName ||
    !gender ||
    !role ||
    !userName ||
    !lastName ||
    false
  ) {
    return NextResponse.json(
      {
        message: "Missing required fields",
        email,
        password,
        firstName,
        lastName,
        gender,
        userName,
        role,
      },
      { status: 400 }
    );
  }
  try {


    


    const existingUser = await prisma.user.findMany({
      where: {
        OR: [{ email }, { user_name: userName }],
      },
    });

    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: "Email or username already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        email: email.trim(),
        first_name: firstName.trim(),
        password: hashedPassword.trim(),
        last_name: lastName.trim(),
        user_name: userName.trim(),
        gender,
        role,
        profile: {
          create: {},
        },
 
      },
      select: {
      created_at :true, 
          updated_at :true,
          country :true ,
          expiresAt :true ,
          gender :true ,
          isPrivate :true ,
          is_2FA :true ,
          timezone :true,
          first_name :true,
          id :true,
          last_name :true,
          role :true,
          user_name :true,
      },
    }) 

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "Error processing request", error },
      { status: 500 }
    );
  }
}

