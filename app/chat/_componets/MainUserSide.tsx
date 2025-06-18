import BluredImage from '@/app/_components/ImageWithPlaceholder';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useGetProfileQuery } from '@/store/api/apiProfile';
import { userResponse } from '@/store/Reducers/mainUser';
import { User } from '@prisma/client';
import { Settings2, User2 } from 'lucide-react';
import React from 'react'
import { useSelector } from 'react-redux';
import {motion} from "framer-motion"
import { Button } from '@/components/ui/button';
const MainUserSide = ({
    CachedUser
} : {
    CachedUser :User
}) => {

    const { isError, isLoading, isFetching, data } = useGetProfileQuery({
        userId: CachedUser?.id,
      });
      
      const blurProfile = data?.profilePictures?.find((x) => x.type === "profile");
      const blurCover = data?.profilePictures?.find((x) => x.type === "cover");
    
      if(isLoading || isFetching){
        return (
            <motion.div className="flex w-full p-2 justify-center items-center  gap-2">
            <div>

            <Skeleton  className=" flex-1 w-10 h-10 rounded-xl bg-gray-300"/>
            </div>
            <div className="flex h-[10] gap-2 justify-between  flex-col ">

            <Skeleton className="w-28 h-2 bg-gray-300" />
            <Skeleton className="w-24 h-2 bg-gray-300" />
            </div>
            <Skeleton  className="  w-5 h-5 rounded-xl bg-gray-300"/>
            <Skeleton  className="  flex-1"/>
            {/* <Skeleton className="w-24 h-2 bg-gray-300" /> */}
          </motion.div>
        )
      }
    return (
    <div 
    className="flex w-full p-2 justify-center items-center    gap-2"
    >
    
       {blurProfile ? (
          <div className="flex justify-center items-center  ">
            <BluredImage
              width={blurProfile?.width!}
              height={blurProfile?.height!}
              blurhash={blurProfile?.HashBlur || ""}
              imageUrl={blurProfile?.secure_url || ""}
              alt="profile_pictre"
              quality={100}
              className={cn(
                "rounded-xl  max-h-10 max-w-10 min-h-10 min-w-10  "
              )}
            />
            {/* <User2 className="w-10 h-10 text-muted-foreground" /> */}
          </div>
        ) : (
          <div className=" flex justify-center items-center shadow-sm border-2 border-accent rounded-full">
            <User2 className="w-5 h-5 text-muted-foreground" />
          </div>
        )}
        <div>
            <p className=" text-sm">{CachedUser.first_name} {CachedUser.last_name}</p>
            <p className=" text-sm text-neutral-50 font-bold">@{CachedUser.user_name}</p>
        </div>
        <Button
        variant={"ghost"}
        size={"icon"}
        >

        <Settings2
        className='w-4 h-4'
        />
        </Button>
        <div
        className='flex-1'
        />
        

    </div>
  )
}

export default MainUserSide