import prisma from "@/lib/prisma";
import { ProfilePicture } from "@prisma/client";
import { NextResponse } from "next/server";

export type followerType = {
  user: {
    id: number;
    email: string;
    first_name: string;
    user_name: string;
    last_name: string;
  };
  profilePicture: ProfilePicture[];
};

export const GET = async (
  _: Request,
  { params }: { params: { id: number } }
) => {
  try {
    const profileFollwer = await prisma.profile.findUnique({
      where: {
        user_id: +params.id,
      },
      select: {
        followers: {
          where: {
            following: {
              user: {
                NOT:{
                  OR: [
                    { ChatCreation: { some: { reciverId: +params.id } } },
                    { ChatReciver: { some: { creatorId: +params.id } } },
                  ],
                }
              },
            },
          },
          skip: 0,
          take: 10,
          select: {
            following: {
              select: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    last_name: true,
                    first_name: true,
                    user_name: true,
                  },
                },
                profilePictures: true,
              },
            },
          },
        },
      },
    });
    const fixed = profileFollwer?.followers.map((userx) => {
      return {
        user: {
          ...userx.following.user,
        },
        profilePicture: userx.following.profilePictures,
      };
    }) as followerType[];

    if (!!fixed) {
      return NextResponse.json(fixed, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "this user not found" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
};
