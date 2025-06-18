"use client"
import WebsiteIcon from "@/hooks/useFavicon";
import Favicon from "@/hooks/useFavicon";
import { cn } from "@/lib/utils";
import { useGetProfileQuery } from "@/store/api/apiProfile";
import { Skeleton } from "@nextui-org/react";
import { User } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion, MotionValue } from "framer-motion"
import { Eye, Link2Icon, LinkIcon, Link as linkIcon } from "lucide-react";
import Link from "next/link";
import React from "react";


const ProfileInfo = (
  { CachedUser,
    isScrolled,
  }: {
    CachedUser: User,
    isScrolled: boolean
  }

) => {

  const { isError, isLoading, isFetching, data } = useGetProfileQuery({
    userId: CachedUser?.id,
  });

  if (isLoading || isFetching) {
    return <div className="mt-16  text-gray-900">
      <Skeleton className="text-2xl mt-2 h-4 rounded-md w-20 font-bold bg-gray-200" />
      <Skeleton className="bg-gray-200 mt-2 h-4 w-32  rounded-md" />
      <Skeleton className="mt-2 h-4 w-28  bg-gray-200 rounded-md" />
      <Skeleton className="mt-2 bg-gray-200 h-4 w-10 rounded-md" />

    </div>
  }
  console.log(
    data?.website
  )

  return (
    <AnimatePresence

    >

      <motion.div


        className={cn(`mt-16 `)}>
        <h1 className="text-2xl font-bold">{CachedUser.first_name + " " + CachedUser.last_name}</h1>
        <p className="text-muted-foreground">@{CachedUser.user_name}</p>
        <p className="mt-2">
          {
            data?.bio
          }
        </p>
        <p className="mt-2 text-gray-500">
          {
            data?.location?.city
          }
          <div className="flex justify-start items-center gap-2 mb-2">

            {data?.website && Object.keys(data?.website) && <div className="flex justify-center items-center gap-1 text-blue-500">
              <LinkIcon
                className=" w-4 h-4"
              />:
            </div>
            }
            {
              data?.website && Object.keys(data?.website).slice(0, 3).map((value, i) => (
                <div key={i} className="text-blue-500">

                  <Link
                    href={data?.website[value]}
                  >
                    <WebsiteIcon
                      domain={value as string}
                      size={20}
                    />
                  </Link>
                </div>
              ))

            }



          </div>

          {


            data?.created_at && formatDistanceToNow(new Date(data?.created_at)) + " ago"

          }
        </p>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileInfo;

