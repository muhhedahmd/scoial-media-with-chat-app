import prisma from "@/lib/prisma";
import { Upload_coludnairy } from "@/utils";
import { Gender, Role } from "@prisma/client";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { any } from "zod";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("first_name") as string;
    const lastName = formData.get("last_name") as string;

    const gender = formData.get("gender") as Gender;
    const userName = formData.get("user_name") as string;
    const role = formData.get("role") as Role;

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
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        user_name: true,
        role: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "Error processing request", error },
      { status: 500 }
    );
  }
}

// const [coverPictureRes , profilePictureRes]   = await Promise.all([
//   Upload_coludnairy(coverPicture, userName),
//   Upload_coludnairy(profilePicture, userName),
// ]);

// // console.log(coverPictureRes, profilePictureRes);

// if (coverPictureRes.status !== 200 || profilePictureRes.status !== 200) {
//   return NextResponse.json(
//     {
//       message: 'Failed to upload pictures',
//        formData, // Convert to plain object
//       type: typeof coverPicture,
//       coverPicture: formData.getAll("cover_picture"),
//       profilePicture: Object.assign({}, profilePicture),
//       coverPictured: coverPicture ? {
//         name: coverPicture.name,
//         size: coverPicture.size,
//         type: coverPicture.type,
//       } : {},
//       profilePictured: profilePicture ? {
//         name: profilePicture.name,
//         size: profilePicture.size,
//         type: profilePicture.type,
//       } : {},
//     },
//     { status: 400 }
//   );
// }
