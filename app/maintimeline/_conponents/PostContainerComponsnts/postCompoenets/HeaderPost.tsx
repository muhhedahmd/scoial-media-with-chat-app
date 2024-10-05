"use client";

import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { HeaderPostLoader } from "./Loaderes";
import { post, User } from "@prisma/client";
import { useGetProfilePostQuery } from "@/store/api/apiSlice";
import Image from "next/image";
import { EllipsisVertical, UserIcon } from "lucide-react";
import { formatDistance } from "date-fns";
import MenuPostOption from "./MenuPostOption/MenuPostOption";
import { Button } from "@/components/ui/button";
import ToggleFollow from "../../ToggleFollow";
interface HeaderPostProps {
  postId: number;
  user: User;
  created_at?: Date;
  author_id: number;
  MainUserProfileId?: number 
  share?: boolean;
}

const HeaderPost = ({
  postId: PostId,
  user,
  author_id,
  created_at,
  MainUserProfileId,
  share,
}: HeaderPostProps) => {
  const {
    data: profileData,
    isLoading,
    error,
    isError,
  } = useGetProfilePostQuery({ PostId, author_id });

  const date = created_at
    ? formatDistance(new Date(created_at || ""), new Date())
    : null;

  let shortTime;
  if (date) {
    shortTime = date
      .replace("minutes", "min")
      .replace("minute", "min")
      .replace("hours", "hrs")
      .replace("hour", "hr")
      .replace("days", "day")
      .replace("day", "day")
      .replace("weeks", "week")
      .replace("week", "week")
      .replace("months", "mo")
      .replace("month", "mo")
      .replace("years", "yr")
      .replace("year", "yr")
      .replace("about", "");
  }

  // imageLoader

  console.log(
    {
      profileData
    }
  )
  return (
    <div className=" w-full flex justify-start items-center gap-3">
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
          <div className="min-w-12 rounded-full h-12 bg-gray-300  flex justify-center items-center cursor-pointer">
            <UserIcon />
          </div>
        )}

        {!profileData?.user && !share ? (
          <div className="flex w-full justify-start items-start gap-2 flex-col">
            <Skeleton className="w-1/4 h-2 bg-gray-300" />
            <Skeleton className="w-1/5 h-2 bg-gray-300" />
          </div>
        ) : (
          <div className="flex w-full justify-start items-start  flex-col">
            {!profileData?.user?.first_name || !profileData?.user?.last_name ? (
              <Skeleton className="min-w-1/4 h-2 mb-3 bg-gray-300" />
            ) : (
              <div className="flex justify-between items-center w-full">
                <p className="">
                  {share
                    ? `${profileData?.user?.first_name} ${profileData?.user?.last_name}`
                    : profileData?.user?.id === user?.id
                    ? "you"
                    : `${profileData?.user?.first_name} ${profileData?.user?.last_name}`}
                </p>
                <div className="flex justify-start items-center gap-3">
                  {date && (
                    <p className="text-muted-foreground ">{shortTime}</p>
                  )}
                  <ToggleFollow
                    MainUserProfileId={MainUserProfileId!}
                    profileDataId={profileData.id}
                  />

                    <MenuPostOption />
          
                </div>
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
    </div>
  );
};

export default HeaderPost;
