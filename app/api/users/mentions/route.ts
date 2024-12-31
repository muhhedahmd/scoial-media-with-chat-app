import { NextResponse } from "next/server";
import { PrismaClient, ProfilePicture } from "@prisma/client";

const prisma = new PrismaClient();



export type ShapeOfUserSearchMention = {
  id: number;
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  profile ?: { profilePictures: ProfilePicture[]  | null};
  isFollower: boolean | null;
  isFollowing: boolean | null;
  followerCount: number;
  hasChatted: boolean;
  interactionCount: number;
};
export async function GET(req: Request) {
  const { search, size, take, userId } = Object.fromEntries(
    new URL(req.url).searchParams
  );
  const currentUserId = parseInt(userId);

  const findUserNames = await prisma.user.findMany({
    where: {
      AND: [
        {
          OR: [
            { user_name: { contains: search, mode: "insensitive" } },
            { first_name: { contains: search, mode: "insensitive" } },
            { last_name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            {
              first_name: {
                contains: search.split(" ")[0],
                mode: "insensitive",
              },
              last_name: {
                contains: search.split(" ")[1] || "",
                mode: "insensitive",
              },
            },
          ],
        },
        { id: { not: currentUserId } },
      ],
    },
    select: {
      id: true,
      user_name: true,
      first_name: true,
      last_name: true,
      email: true,
      profile: {
        select: {
          profile_picture: true,
          profilePictures: true,
          followers: {
            where: {
              followingId: currentUserId,
            },
          },
          following: {
            where: {
              followerId: currentUserId,
            },
          },
          _count: {
            select: {
              followers: true,
            },
          },
        },
      },
      ChatReciver: {
        where: {
          creatorId: currentUserId,
        },
      },
      ChatCreation: {
        where: {
          reciverId: currentUserId,
        },
      },
      Interaction: {
        where: {
          author_id: currentUserId,
        },
      },
    },
    orderBy: [
      { profile: { followers: { _count: "desc" } } },
      { ChatReciver: { _count: "desc" } },
      { ChatCreation: { _count: "desc" } },
      { Interaction: { _count: "desc" } },
      { profile: { following: { _count: "desc" } } },
    ],
    skip: parseInt(size) * parseInt(take),
    take: parseInt(take),
  });

  const processedUsers  
  :  ShapeOfUserSearchMention[] 
  = findUserNames.map((user) => ({
    id: user.id,
    user_name: user.user_name,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    profile: {
      profilePictures: user.profile?.profilePictures || [],
    },

    isFollower: user.profile && user.profile?.followers.length > 0,
    isFollowing: user.profile && user.profile?.following.length > 0,
    followerCount: user.profile?._count.followers || 0,
    hasChatted: user.ChatReciver.length > 0 || user.ChatCreation.length > 0,
    interactionCount: user.Interaction.length,
    
  }));
  //type of processedUsers

  // return processedUsers

  // Custom sorting function
  const sortedUsers = processedUsers.sort((a, b) => {
    // First, sort by isFollower and hasChatted
    if (a.isFollower !== b.isFollower) return b.isFollower ? 1 : -1;
    if (a.hasChatted !== b.hasChatted) return b.hasChatted ? 1 : -1;
    // Then, sort by interaction count
    if (a.interactionCount !== b.interactionCount)
      return b.interactionCount - a.interactionCount;
    // Then, sort by isFollowing
    if (a.followerCount !== b.followerCount) return b.followerCount ? 1 : -1;

    if (a.isFollowing !== b.isFollowing) return b.isFollowing ? 1 : -1;

    return a.first_name.localeCompare(b.first_name);

    // Finally, sort by follower count
  });

  return NextResponse.json(sortedUsers, { status: 200 });
}
