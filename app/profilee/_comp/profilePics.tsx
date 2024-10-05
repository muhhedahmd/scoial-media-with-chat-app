"use client";
import BluredImage from "@/app/_componsents/ImageWithPlaceholder";
import { useGetProfileQuery } from "@/store/api/apiProfile";
import { userResponse } from "@/store/Reducers/mainUser";
import { Skeleton } from "@nextui-org/react";
import { User } from "@prisma/client";
import { MotionValue } from "framer-motion";
import { ImageIcon, User2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import{motion} from "framer-motion"

const ProfilePics = ({
  profileComponent,
  CachedUser,
  xProfilePic,
yProfilePic,
  transformed
}: {
  xProfilePic:MotionValue<number> ,

  yProfilePic:MotionValue<number>,
  transformed :MotionValue<number> ,
  CachedUser: User;
  profileComponent?: React.ReactNode;
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
        <motion.div 
        style={{
          x : xProfilePic,
          y  :yProfilePic
        }}
        className="fixed top-[124px] left-[5.5vw] lg:left-[15.5vw]  w-24 h-24 flex justify-center items-center shadow-sm border-2 border-gray-300 bg-gray-200 rounded-full">
          <BluredImage
            width={blurProfile?.width!}
            height={blurProfile?.height!}
            blurhash={blurProfile?.HashBlur || ""}
            imageUrl={blurProfile?.secure_url || ""}
            alt="profile_pictre"
            quality={100}
            className="rounded-full min-h-20 min-w-20  h-[5.5rem]  object-cover"
          />
        </motion.div>
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
