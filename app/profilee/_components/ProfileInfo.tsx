"use client"
import { cn } from "@/lib/utils";
import { useGetProfileQuery } from "@/store/api/apiProfile";
import { Skeleton } from "@nextui-org/react";
import { User } from "@prisma/client";
import {AnimatePresence, motion, MotionValue}  from "framer-motion"
import React from "react";


const ProfileInfo = (
  {CachedUser,
    isScrolled ,
  } :{
    CachedUser: User,
    isScrolled :boolean
  }
  
) => {

  const { isError, isLoading, isFetching, data } = useGetProfileQuery({
    userId: CachedUser?.id,
  });

  if(isLoading || isFetching) {
    return  <div  className="mt-16  text-gray-900">
    <Skeleton className="text-2xl mt-2 h-4 rounded-md w-20 font-bold bg-gray-200"/>
    <Skeleton className="bg-gray-200 mt-2 h-4 w-32  rounded-md" />
    <Skeleton className="mt-2 h-4 w-28  bg-gray-200 rounded-md" />
    <Skeleton className="mt-2 bg-gray-200 h-4 w-10 rounded-md" />
    
  </div>
  }

  return (
    <AnimatePresence
    
    >

      <motion.div


      className={cn(`mt-16 text-gray-900`   )}>
        <h1 className="text-2xl font-bold">{data?.user.first_name + " " + data?.user.last_name}</h1>
        <p className="text-gray-500">@{data?.user.user_name}</p>
        <p className="mt-2">
        {
          data?.bio
        }
        </p>
        <p className="mt-2 text-gray-500">
          {
              data?.location
          } ·{" "}
          <p className="text-blue-400">
           
              { JSON.stringify(data?.website)}
          </p>{" "}
          · {
             JSON.stringify( data?.created_at)
              
          }
        </p>
      </motion.div>
    </AnimatePresence>
    );
};

export default ProfileInfo;

