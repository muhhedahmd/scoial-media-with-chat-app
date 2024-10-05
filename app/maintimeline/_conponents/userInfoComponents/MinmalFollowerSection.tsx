import { Separator } from "@/components/ui/separator";
import React, { useEffect } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useGetFollowercountQuery, useGetFollowingCountQuery, useGetFollowingQuery } from "@/store/api/apiFollows";
interface  MinmalFollowerSectionProp {
    userId : number
}

const MinmalFollowerSection = ({userId} :MinmalFollowerSectionProp) => {

  const { isLoading : LoadingFollower , isFetching  : fetchingFollower,  data : followerCount} = useGetFollowercountQuery({
    userId: userId
  })

  const { 
    isLoading : LoadingFollowing ,
    isFetching : fetchingFollowing ,
    data : followingCount

  } = useGetFollowingCountQuery({
    userId: userId
  })

  return (
    <div className="px-14 w-full">
      <div className="flex flex-col gap-2 placeholder-sky-300  pt-7 justify-start items-center ">
        <Separator />
        <div className="flex p-3 justify-evenly px-0 w-full items-center">
          <Button variant={"ghost"} className="h-auto flex justify-start items-center flex-col">
            <p>follwers</p>

            {LoadingFollower ||  fetchingFollower? 
             <Skeleton className="h-2 w-5"/>
             :   
            <p>{followerCount?.followerCount || 0 }</p>
        }
          </Button >
          <Separator className="  h-12" orientation="vertical" />
          <Button variant={"ghost"} className="h-auto flex justify-start items-center flex-col">
            <p>follwimg</p>
            {LoadingFollowing || fetchingFollower? 
             <Skeleton className="h-2 w-5"/>
             :   
             <p>{followingCount?.followingCount || 0 }</p>
        }
          </Button>
        </div>

        <Separator />
      </div>
    </div>
  );
};

export default MinmalFollowerSection;
