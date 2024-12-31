"use client";

import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { Address, User } from "@prisma/client";
import {
  useGetPostImagesQuery,
  useGetProfilePostQuery,
} from "@/store/api/apiSlice";
import { MapPin, UserIcon } from "lucide-react";
import { formatDistance } from "date-fns";
import MenuPostOption from "./MenuPostOption/MenuPostOption";
import ToggleFollow from "../../ToggleFollow";
import BluredImage from "@/app/_components/ImageWithPlaceholder";
import { cn } from "@/lib/utils";

interface HeaderPostProps {
  postId: number;
  user: User;
  created_at?: Date;
  author_id: number;
  MainUserProfileId?: number;
  share?: boolean;
  content: string | null;
  address: Address | null;
  minmal?  :boolean
}

const HeaderPost = ({
  postId: PostId,
  user,
  created_at,
  author_id,
  MainUserProfileId,
  share,
  content,
  address,
  minmal = false
}: HeaderPostProps) => {
  const {
    data: profileData,
    isLoading,
    error,
    isError,
  } = useGetProfilePostQuery({ PostId, author_id });

  const blurProfile = profileData?.profilePictures.find(
    (x) => x.type === "profile"
  );

  const date = created_at
    ? formatDistance(new Date(created_at), new Date())
    : null;

  const shortTime = date
    ? date
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
        .replace("about", "")
    : null;

  const {
    data: postImages,
    isLoading: isLoadingPostImages,
    isError: isErrorPostImages,
  } = useGetPostImagesQuery(PostId);

  return (
    <div className="w-full flex  justify-start flex-col items-start gap-3">
      <div className={cn("flex w-full justify-start  items-center gap-3")}>
        {profileData?.profile_picture ? (
          <BluredImage
            blurhash={blurProfile?.HashBlur || ""}
            alt={`${user?.first_name} ${user?.last_name} Profile Picture`}
            quality={70}
            imageUrl={profileData?.profile_picture || ""}
            width={28}
            height={28}
            className={cn(
              "rounded-full max-h-[2rem]   max-w-[2rem] min-h-[2rem] min-w-[2rem] md:max-h-[3rem]  md:max-w-[3rem] md:min-h-[3rem] md:min-w-[3rem]"
            )}
          />
        ) : (
          <div className="min-w-12 max-w-12 rounded-full h-12 bg-gray-300 flex justify-center items-center cursor-pointer">
            <UserIcon />
          </div>
        )}

        {!profileData?.user && !share ? (
          <div className="flex w-full justify-start items-start gap-2 flex-col">
            <Skeleton className="w-1/4 h-2 bg-gray-300" />
            <Skeleton className="w-1/5 h-2 bg-gray-300" />
          </div>
        ) : (
          <div className={cn("flex w-full justify-start items-center flex-col" ,!address &&  "-mt-4" )}>
            {!profileData?.user?.first_name || !profileData?.user?.last_name ? (
              <Skeleton className="min-w-1/4 h-2 mb-3 bg-gray-300" />
            ) : (
              <div className="flex justify-between items-center w-full">
                <p className="text-gray-950">
                  {share
                    ? `${profileData?.user?.first_name} ${profileData?.user?.last_name}`
                    : profileData?.user?.id === user?.id
                    ? "you"
                    : `${profileData?.user?.first_name} ${profileData?.user?.last_name}`}
                </p>
                <div className="flex justify-start items-center gap-3">
                  {shortTime && (
                    <p className="text-muted-foreground">{shortTime}</p>
                  )}
                  <ToggleFollow
                    MainUserProfileId={MainUserProfileId!}
                    profileDataId={profileData.id}
                  />
                  {
                    !minmal ? 

                    <MenuPostOption
                    isLoadingImages={isLoadingPostImages}
                    postLink=""
                    initialPostData={{
                      title: content || "",
                      images: postImages?.map((img , i )=>{
                        return {
                          // order: i+1,
                          ...img
                        }
                      }),
                      mentions: null,
                      location: address,
                    }}
                    mainUserId={user.id}
                    postId={PostId}
                    authorId={author_id}
                    /> : null
                  }
                </div>
              </div>
            )}
            <div className="-mt-2 w-full">

              {address && (
                <div
                  className={cn(
                    "font-[10px] gap-1 text-muted-foreground   w-full cursor-pointer items-center flex transition-all rounded-md text-start h-fit"
                    
                  )}
                >
                  <MapPin
                  className="w-3 h-3"
                  />
                  <p className="font-light text-[.8rem]">
                    {address.country}, {address.city}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderPost;
