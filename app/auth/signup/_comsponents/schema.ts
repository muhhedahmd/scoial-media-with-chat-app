import { Gender, Role } from "@prisma/client";
import * as z from "zod";
export const userSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    first_name: z
      .string()
      .min(1, "First name is required")
      .regex(/^[/^[\S]+$/, "white space not allwoed"),
    role: z.nativeEnum(Role, { message: "Invalid role" }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/^[/^[\S]+$/, "white space not allwoed"),
    last_name: z
      .string()
      .min(1, "Last name is required")
      .regex(/^[/^[\S]+$/, "white space not allwoed"),
    user_name: z
      .string()
      .min(1, "Username is required")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username must only contain letters, numbers, or underscores and no spaces"
      ), // Alphanumeric and underscores only,
    gender: z.nativeEnum(Gender, { message: "Invalid gender" }),
    confirm_password: z
      .string()
      .min(8, "Confirm password must be at least 8 characters")
      .regex(/^[/^[\S]+$/, "white space not allwoed"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"], // Specify the path of the error
  });

export const ProfileSchema =  z.object({
  first_name: z
  .string()
  .min(1, "First name is required")
  .regex(/^[/^[\S]+$/, "white space not allwoed").optional(),
last_name: z
  .string()
  .min(1, "Last name is required")
  .regex(/^[/^[\S]+$/, "white space not allwoed").optional(),
  user_name: z
      .string()
      .min(1, "Username is required")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username must only contain letters, numbers, or underscores and no spaces"
      ).optional(),
  bio: z.string().min(3, {
    message: "Bio must be at least 3 characters long",
  }).optional(),
  removeProfilePic : z.enum(["keep" , "update"  ,"remove"]).optional(), 
  removeCoverPic : z.enum(["keep" , "update"  ,"remove"]).optional(),
  // location : z.string().optional(),
  profile_picture:  typeof window !== "undefined" ? z
    .instanceof(File, {
      message: "Profile picture must be a valid file",
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "Profile picture must be an image file",
    })
    .nullable()
    .optional() : z.any().nullable().optional(),
  cover_picture:  typeof window !== "undefined" ? z
    .instanceof(File, {
      message: "Cover picture must be a valid file",
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "Cover picture must be an image file",
    })
    .nullable()
    .optional() : z.any().nullable().optional(),
  location: z.any().optional(),

  birthdate: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof Date) {
      return new Date(val);
    }
  }, z.date({ message: "Invalid birthdate" })),
  PhoneNumber: z
    .string()
    .regex(/^[/^[\S]+$/, "white space not allwoed")
    // .min(11, { message: "the phone number must be 11" })
    .optional()
    .refine((data) => {
      try {
        return data || 0;
      } catch (error) {
        throw error;
      }
    }),
  title: z
    .string()
   
    .optional(),
  website: z
    .record(z.string(), z.string().url("Website must be a valid URL"))
    .optional(),
});
