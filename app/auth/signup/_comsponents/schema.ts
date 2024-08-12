import { Gender, Role } from "@prisma/client";
import * as z from "zod"
export const userSchema = z.object({
    email: z.string().email("Invalid email address"),
    first_name: z.string().min(1, "First name is required"),
    role: z.nativeEnum(Role, { message: "Invalid role" }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    last_name: z.string().min(1, "Last name is required"),
    user_name: z.string().min(1, "Username is required"),
    gender: z.nativeEnum(Gender, { message: "Invalid gender" }),
    confirm_password: z.string().min(8, "Confirm password must be at least 8 characters"),


  }).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"], // Specify the path of the error
  });
export const ProfileSchema = z.object({
 
    bio: z.string(),
    profile_picture: z.instanceof(Object, {
      message: "Invalid file",
    }).refine(file => file.type.startsWith('image/'), {
      message: "File must be an image",
    }),
    cover_picture: z.instanceof(Object, {
      message: "Invalid file",
    }).refine(file => file.type.startsWith('image/'), {
      message: "File must be an image",
    }),
    location: z.string(),
    website: z.string(),
    birthdate: z.date({ message: "Invalid birthdate" }),
  });