"use client";
import BluredImage from "@/app/_components/ImageWithPlaceholder";
import { useGetProfileQuery } from "@/store/api/apiProfile";
import { Skeleton } from "@nextui-org/react";
import { User } from "@prisma/client";
import { MotionValue } from "framer-motion";
import { ImageIcon, User2 } from "lucide-react";

import React from "react";

import { cn } from "@/lib/utils";

const ProfilePics = ({
  CachedUser,
  minmalcard,
  scaleDownprofilePic,
}: {
  minmalcard?: boolean;
  scaleDownprofilePic?: MotionValue<number>;
  CachedUser: User;
}) => {
  const { isError, isLoading, isFetching, data } = useGetProfileQuery({
    userId: CachedUser?.id,
  });
  const blurProfile = data?.profilePictures.find((x) => x.type === "profile");
  const blurCover = data?.profilePictures.find((x) => x.type === "cover");

  if (isError) return <div>Error fetching data</div>;
  if (isLoading || isFetching) {
    return (
      <div className="relative">
        <Skeleton className="bg-gray-200 h-40 rounded-lg" /> {/* Cover Photo */}
        <Skeleton className="absolute -bottom-12 left-4 w-24 h-24 bg-white rounded-full" />
        <Skeleton className="absolute top-4 right-4 px-4 py-1 bg-white text-black rounded-full" />
      </div>
    );
  }

  console.log({
    blurProfile,
    blurCover,
  })
  if (minmalcard) {
    return (
      <div className="flex justify-start relative items-center   gap-4">
        {data?.profile_picture ? (
          <div className="flex justify-center items-center absolute ">
            <BluredImage
              width={blurProfile?.width!}
              height={blurProfile?.height!}
              blurhash={blurProfile?.HashBlur || ""}
              imageUrl={blurProfile?.secure_url || ""}
              alt="profile_pictre"
              quality={100}
              className={cn(
                "rounded-full  max-h-[3rem] max-w-[3rem] min-h-[3rem] min-w-[3rem]  "
              )}
            />
            {/* <User2 className="w-10 h-10 text-muted-foreground" /> */}
          </div>
        ) : (
          <div className=" flex justify-center items-center shadow-sm border-2 border-gray-300 bg-gray-200 rounded-full">
            <User2 className="w-10 h-10 text-muted-foreground" />
          </div>
        )}
        <div className="flex flex-col justify-start pl-16 items-start ">
          <h3 className="text-black">
            {CachedUser.first_name + " " + CachedUser.last_name}
          </h3>
          <p className="text-muted-foreground text-sm text-gray-400">
            @{CachedUser.user_name}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="relative">
      {data?.cover_picture ? (
        <div className="bg-gray-500 h-40 w-full rounded-lg flex justify-center items-center">
          <BluredImage
            blurhash={blurCover?.HashBlur || ""}
            alt={
              "cover_picture " +
              data.user.first_name +
              " " +
              data.user.last_name
            }
            width={blurCover?.width!}
            height={blurCover?.height!}
            quality={75}
            imageUrl={data?.cover_picture || ""}
            className="  h-40    w-full object-cover rounded-md"
          />
        </div>
      ) : (
        <div className="bg-gray-200 h-40 rounded-lg flex justify-center items-center">
          <ImageIcon className="w-10 h-10 text-muted-foreground" />
        </div>
      )}

      {data?.profile_picture ? (
        <div className="absolute -bottom-12 left-4 w-24 h-24 flex justify-center items-center shadow-sm border-2 border-gray-300 bg-gray-200 rounded-full">
          <BluredImage
            width={blurProfile?.width!}
            height={blurProfile?.height!}
            blurhash={blurProfile?.HashBlur || ""}
            imageUrl={blurProfile?.secure_url || ""}
            alt="profile_pictre"
            quality={100}
            className={cn(
              "rounded-full   h-[5.5rem] w-[5.5rem]  object-cover",
             
            )}
          />
        </div>
      ) : (
        <div className="absolute -bottom-12 left-4 w-24 h-24 flex justify-center items-center shadow-sm border-2 border-gray-300 bg-gray-200 rounded-full">
          <User2 className="w-10 h-10 text-muted-foreground" />
        </div>
      )}
      {/* Profile Photo */}
      <button className="absolute top-4 right-4 px-4 py-1 shadow-sm bg-white text-black rounded-full">
        Edit Profile
      </button>
    </div>
  );
};

export default ProfilePics;
