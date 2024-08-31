import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async (
  req: NextApiRequest,
  { params }: { params: { id: number } }
) => {
  //  return NextResponse.json({aaa: "aa "}, {status: 200})
  const isUserExisit = await prisma.user.findUnique({
    where: {
      id: +params?.id,
    },
    select: {
      profile: true,
    },
  });
  if (!!isUserExisit) {
    const selectMutualFollwing = await prisma.profile.findUnique({
      where: {
        id: isUserExisit.profile?.id,
      },
      include: {
        following: {
          select: {
            followerId: true,
          },
        },
      },
    });

    const followingIds = selectMutualFollwing?.following.map(
      (follower) => follower.followerId
    );

    // const selectMutualFollwer = await prisma.profile.findUnique({
    //   where: {
    //     id: +params.id,
    //   },
    //   include: {
    //     followers: {
    //       select: {
    //         followingId: true,
    //       },
    //     },
    //   },
    // });

    // const followerIds = selectMutualFollwer?.followers.map(
    //   (follower) => follower.followingId
    // );

    const followingUsers = await prisma.user.findMany({
      where: {
        AND: [
          // Only include profiles that are not already followed by the current user
          {
            profile: {
              followers: {
                some: {
                  followerId: { in: followingIds }, // Profiles followed by user's connections
                },
              },
            },
          },
          // Exclude the current user
          { id: { not: +params.id } },
        ],
      },
      // Select only the profiles that have a similar interest
      select: {
        id: true,
        first_name: true,
        last_name: true,
        user_name: true,
      },
      // select: {
      //   id: true,
      //   profile: {
      //     select: {
      //       followers: true, // You can select more fields as needed
      //     },
      //   },
      // },
    });

    const suggestedUsers = await prisma.user.findMany({
      where: {
        AND: [
          // The user must be followed by someone the current user follows
          {
            profile: {
              followers: {
                some: {
                  followingId: { in: followingIds },
                },
              },
            },
          },
          // Exclude users already followed by the current user
          { id: { notIn: followingIds } },
          // Exclude users who follow back the current user (mutual follow-back)
          {
            profile: {
              followers: {
                none: {
                  followerId: +params.id, // Skip if they follow the current user back
                },
              },
            },
          },
          // Exclude the current user
          { id: { not: +params.id } },

        ],
      },
      select :{
        first_name :true ,
        last_name :true , 
        user_name :true,
        email :true ,

        profile :{
          select :{
            birthdate:true 
            ,cover_picture :true ,
            profile_picture :true 
          }
        }
      }
     
    });

    const test = await prisma.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: +params.id,
            },
          },
          {
            profile: {
              AND: [
                {
                  followers: {
                    some: {
                      followingId: {
                        in: followingIds,
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    });
    // followingUsers, followingIds }
    return NextResponse.json(
      {Suggestion:suggestedUsers} ,
      { status: 200 }
    );
  } else {
    return NextResponse.json({ message: "User not found" }, { status: 400 });
  }
};
