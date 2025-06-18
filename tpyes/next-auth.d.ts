import { $Enums, Session } from "@prisma/client";
import { DefaultSession } from "next-auth";

import { Session as DBSession } from "prisma/client";
declare module "next-auth" {
  interface Session {
    user: {

      first_name: string;
      last_name: string;
      gender: $Enums.Gender;
      role: $Enums.Role;
      id: number;
      expiresAt: Date;
      isPrivate: boolean;
      created_at: Date | null;
      updated_at: Date | null;
      user_name: string,
      timezone: Date | null;
      is_verified: boolean | null;
      is_2FA: boolean | null;

      profile?: {
        isCompleteProfile?: boolean;
        user_id?: number;
        created_at?: Date;
        updated_at?: Date | null;

        id?: number;

      },
      session: {
        id: string;
        createdAt: Date | null;
        userId: number;
        expires: Date;
        is2FACompleted: boolean | null;
        isDeviceVerfcation: boolean | null;
      }
    }
    & DefaultSession["user"];
  }
}


declare module "next-auth/jwt" {
  interface JWT {
    first_name: string;
    last_name: string;
    gender: $Enums.Gender;
    role: $Enums.Role;
    id: number;
    user_name: string,

    expiresAt: Date;
    isPrivate: boolean;
    created_at: Date | null;
    updated_at: Date | null;
    timezone: Date | null;
    is_verified: boolean | null;
    is_2FA: boolean | null;
    // is_2FA_completed: boolean | null;
    profile?: {
      isCompleteProfile?: boolean;
      user_id?: number;
      created_at?: Date;
      updated_at?: Date | null;

      id?: number;

    },
    session: {
      id: string;
      createdAt: Date | null;
      userId: number;
      expires: Date;
      is2FACompleted: boolean | null;
      isDeviceVerfcation: boolean | null;
    }
  }

}