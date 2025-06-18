// import { Author, bookCover, Category, GENDER, Publisher, purchase, Rating, ReadingHistory, UserRole } from "@prisma/client";
// import {session  as DBSession} from "prisma/client";
import { Session as DBSession, $Enums, Address, Gender, ProfilePicture, Role, Session } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { boolean } from "zod";

type ProfilePictures = {
    id: string;
    url: string;
    publicId: string;
    assetId: string;
    width: number;
    height: number;
    format: string;
    createdAt: Date;
    updatedAt: Date;
    secureUrl: string;
    publicUrl: string;
    assetFolder: string;
    displayName: string;
    tags: string[];
    hashBlur: string;
    profileId: string;
    website: JsonValue;
}

export type ProfileWithPic = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string | null;
    userId?: number;
    bio: string | null;
    phoneNumber: string | null;
    isVerified: boolean;
    birthdate: Date | null;
    profilePictures: ProfilePicture[]
    website: JsonValue;

}

export interface CustomSession {
    user: {
        createdAt: Date,
        updatedAt: Date,
        id: number;
        name?: string | null;
        email?: string | null;
        profile: ProfileWithPic

    };
}
export type userWithProfile = {
    email: string;
    is_2FA_completed: boolean,
    first_name: string;
    last_name: string;
    gender: $Enums.Gender;
    user_name: string;
    role: $Enums.Role;
    id: number;
    expiresAt: Date;
    isPrivate: boolean;
    videoCallStatus: $Enums.VideoCallStatus;
    created_at: Date | null;
    updated_at: Date | null;
    country: $Enums.Country | null;
    timezone: Date | null;
    is_2FA: boolean | null;
    is_verified: boolean | null;
    profile?: {
        isCompleteProfile?: boolean;
        location_id?: number | null;
        user_id?: number;
        PhoneNumber?: string | null;
        created_at?: Date;
        updated_at?: Date | null;
        location?: Address;
        cover_picture?: string;
        profile_picture?: string;
        id?: number;
        title?: string | null;
        bio?: string | null;
        birthdate?: Date | null;
        profilePictures?: ProfilePicture[];
        website?: JsonValue;

    };
};

export type typeProfileWithPic = {
    isCompleteProfile?: boolean;
    location_id?: number | null;
    user_id?: number;
    PhoneNumber?: string | null;
    created_at?: Date;
    updated_at?: Date | null;
    location?: Address;
    cover_picture?: string;
    profile_picture?: string;
    id?: number;
    title?: string | null;
    bio?: string | null;
    birthdate?: Date | null;
    profilePictures?: ProfilePicture[];
    website?: JsonValue;
}


export type next_auth_session = {

    user: {
        first_name: string;
        last_name: string;
        gender: $Enums.Gender;
        role: $Enums.Role;
        user_name: string,
        is_2FA: boolean | null,
        id: number;
        expiresAt: Date;
        isPrivate: boolean;
        created_at: Date | null;
        updated_at: Date | null;
        timezone: Date | null;
        is_verified: boolean | null;
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
export type SessionComp = {
    user: {
        first_name: string;
        last_name: string;
        gender: $Enums.Gender;
        role: $Enums.Role;
        id: number;
        expiresAt: Date;
        isPrivate: boolean;
        created_at: Date | null;
        user_name: string,
        updated_at: Date | null;
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
            sessionToken: string;
            userId: number;
            expires: Date;
            is2FACompleted: boolean | null;
            isDeviceVerfcation: boolean | null;
        }
    }


}
export type UserData = {
    createdAt: Date,
    updatedAt: Date,
    id: string;
    name?: string | null;
    email?: string | null;
    role: Role,
    Gender: Gender
    profile: ProfileWithPic,
    user: {
        id: string
    }

}

export interface Preference {
    id: string
    weight: number
    categoryId: string | null
    authorId: string | null
    category?: {
        id: string
        name: string
    } | null
    author?: {
        id: string
        name: string
    } | null
}
export interface EditedUserPrefrances {

    categoryId: string | null;
    category?: {
        id: string
        name: string
    } | null,
    author?: {
        id: string
        name: string
    } | null

    userId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: string | null;
    weight: number;

}
export type categoryWithchildren = ({
    children: {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
    }[];
} & {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    parentId: string | null;
})
