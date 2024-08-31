"use client";

import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { HeaderPostLoader } from "./Loaderes";
import { post, User } from "@prisma/client";
import { useGetProfilePostQuery } from "@/store/api/apiSlice";
import Image from "next/image";
import { UserIcon } from "lucide-react";
import { formatDistance } from "date-fns";
interface HeaderPostProps {
  postId: number;
  user: User;
  created_at?: Date;
  author_id: number;
}

const HeaderPost = ({
  postId: PostId,
  user,
  author_id,
  created_at,


}: HeaderPostProps) => {
  
  const {
    data: profileData,
    isLoading,
    error,
    isError,
  } = useGetProfilePostQuery({ PostId, author_id });

  const date = created_at
    ? formatDistance(created_at, new Date(), {
        addSuffix: true,
      })
    : null;

  // imageLoader
  return (
    <div className=" w-full flex justify-start items-center gap-3">
      {profileData?.profile_picture ? (
        <Image
          alt={`${user?.first_name} ${user?.last_name} Profile Picture`}
          // quality={70}
          src={profileData?.profile_picture || ""}
          width={40}
          height={40}
          className="p-1 object-cover w-14 rounded-full h-14 bg-gray-100 "
        />
      ) : (
        <div className="w-12 rounded-full h-12 bg-gray-300  flex justify-center items-center cursor-pointer">
          <UserIcon />
        </div>
      )}

      {!profileData?.user  ? (
        <div className="flex w-full justify-start items-start gap-2 flex-col">
          <Skeleton className="w-1/4 h-2 bg-gray-300" />
          <Skeleton className="w-1/5 h-2 bg-gray-300" />
        </div>
      ) : (
        <div className="flex w-full justify-start items-start  flex-col">
          {!profileData?.user?.first_name || !profileData?.user?.last_name ? (
            <Skeleton className="w-1/4 h-2 mb-3 bg-gray-300" />
          ) : (
            <div className="flex justify-between items-center w-full">
              <p className="">
                by{" "}
                {profileData?.user?.id === user?.id
                  ? "me"
                  : profileData?.user?.first_name +
                    " " +
                    profileData?.user.last_name}
              </p>
              {date && <p className="text-muted-foreground">{date}</p>}
            </div>
          )}

          {!profileData?.user?.user_name ? (
            <Skeleton className="w-1/5 h-2 bg-gray-300" />
          ) : (
            <p className="text-muted-foreground">
              {"@" + profileData?.user.user_name}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderPost;
