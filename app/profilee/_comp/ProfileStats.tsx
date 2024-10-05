"use client";
import prisma from "@/lib/prisma";
import {
  useGetFollowercountQuery,
  useGetFollowingCountQuery,
} from "@/store/api/apiFollows";
import { Skeleton } from "@nextui-org/react";
import { User } from "@prisma/client";
import { MotionValue } from "framer-motion";
import React from "react";

const ProfileStats = ({ CachedUser  ,transformed }: { CachedUser: User ,transformed :MotionValue<number> }) => {
  const {
    isLoading: LoadingFollower,
    isFetching: fetchingFollower,
    data: followerCount,
  } = useGetFollowercountQuery({
    userId: CachedUser.id,
  });

  const {
    isLoading: LoadingFollowing,
    isFetching: fetchingFollowing,
    data: followingCount,
  } = useGetFollowingCountQuery({
    userId: CachedUser.id,
  });
  if(
    LoadingFollower ||
    LoadingFollowing ||
    fetchingFollower ||
    fetchingFollowing

  ){

    return (
      <div className="flex space-x-4 mt-4 text-gray-400">
      <Skeleton className="w-20 h-3 bg-gray-200" />
      <Skeleton className="w-24 h-3 bg-gray-200" />
      <Skeleton className="w-20 h-3 bg-gray-200" />
    </div>
  );
}
else {
  return (
    <div className="flex space-x-4 mt-4 text-gray-400">
   <span>{followingCount?.followingCount || 0 } Following</span>
        <span>{followerCount?.followerCount || 0 } Followers</span>
        <span>123 Likes</span>

    </div>
  )
}
};

export default ProfileStats;
