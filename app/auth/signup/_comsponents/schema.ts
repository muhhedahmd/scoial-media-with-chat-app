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
 export  const ProfileSchema = z.object({
    bio: z.string().min(3, {
      message: "Bio must be at least 3 characters long",
    }),
    profile_picture: z.instanceof(File, {
      message: "Profile picture must be a valid file",
    }).refine(file => file.type.startsWith('image/'), {
      message: "Profile picture must be an image file",
    }).nullable().optional(),
    cover_picture: z.instanceof(File, {
      message: "Cover picture must be a valid file",
    }).refine(file => file.type.startsWith('image/'), {
      message: "Cover picture must be an image file",
    }).nullable().optional(),
    location: z.string().min(2, {
      message: "Location is required and must be at least 2 characters",
    }),
  
    birthdate: z.preprocess((val) => {
      if (typeof val === "string" || val instanceof Date) {
        return new Date(val);
      }
    }, z.date({ message: "Invalid birthdate" })),
    PhoneNumber  :z.string().min(11 , {message : "the phone number must be 11"}).optional().refine((data)=>
      
    
      {
        console.log(data)
        return data || 0}
    ) ,
    title :z.string().min(5 , {message : "Enter proper title"}).optional() ,
    website: z
    .record(z.string(), z.string().url("Website must be a valid URL"))
    .optional(),
  })