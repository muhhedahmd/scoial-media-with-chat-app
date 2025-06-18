"use client"

import { CoverImageLoader, ProfileImageLoader } from "./Loader"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import MinmalFollowerSection from "./userInfoComponents/MinmalFollowerSection"
import { Button } from "@/components/ui/button"
import type { Profile, User } from "@prisma/client"
import Link from "next/link"
interface UserInfoProps {
  user: User
  isLoading: boolean
  profile: Profile | any
}
const UserInfo = ({ isLoading, profile, user }: UserInfoProps) => {
  return (
    <div
      className="relative
    flex flex-col
    items-center
    bg-white rounded-lg h-[55%] border-2 shadow-md w-full"
    >
      {isLoading && !profile?.cover_picture ? (
        <CoverImageLoader />
      ) : (
        <Image
          priority={true}
          height={50}
          width={50}
          src={profile?.cover_picture || ""}
          objectFit="cover"
          alt="cover picture"
          sizes="cover"
          className="h-28 rounded-lg object-cover bg-slate-950 w-full"
        />
      )}

      {isLoading && !profile?.profile_picture ? (
        <ProfileImageLoader />
      ) : (
        <Image
          priority={true}
          height={50}
          width={50}
          src={profile?.profile_picture || ""}
          objectFit="cover"
          alt="profile picture"
          sizes="cover"
          className="rounded-full p-1 object-cover absolute top-[25%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-white w-20 h-20"
        />
      )}
      <div className="pt-12  flex-col font-semibold flex justify-center items-center gap-2">
        {isLoading ? (
          <Skeleton className="bg-gray-400 w-1/3 h-3 animate-accordion-down" />
        ) : (
          <p className="capitalize">
            {user?.first_name} {user?.last_name}
          </p>
        )}
        {isLoading ? (
          <Skeleton className="bg-gray-400 w-1/5 h-3 animate-accordion-down" />
        ) : (
          <p className=" text-muted-foreground capitalize">@{user?.user_name} </p>
        )}
        {isLoading ? (
          <Skeleton className="bg-gray-400 w-3/5 h-3 animate-accordion-down" />
        ) : (
          <p className="font-normal capitalize">{profile?.bio} </p>
        )}
      </div>
      <MinmalFollowerSection userId={user?.id} />
      <div className="flex flex-1 justify-center items-center  ">
        <Button variant={"ghost"} className="text-gray-500 flex-1 p-2  w-fit">
          <Link href={"/profilee"}>My profile</Link>
        </Button>
      </div>
    </div>
  )
}

export default UserInfo
