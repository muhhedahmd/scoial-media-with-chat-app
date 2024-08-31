import { Separator } from "@/components/ui/separator";
import React, { useEffect } from "react";
import { fetchFollowers, fetchFollowersAndFollowingCount, fetchFollowing, selectFollowers, selectFollowersCount, selectFollowersError, selectFollowersStatus, selectFollowing, selectFollowingCount } from "@/store/Reducers/follwerSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
interface  MinmalFollowerSectionProp {
    userId : number
}

const MinmalFollowerSection = ({userId} :MinmalFollowerSectionProp) => {

const followingCount = useSelector(selectFollowingCount)
const followerCount = useSelector(selectFollowersCount)
const dispatch = useDispatch<AppDispatch>()
const status = useSelector(selectFollowersStatus);
const error = useSelector(selectFollowersError);
const isLoading = status === "loading" || status === "idle" || status === null;

useEffect(() => {

  if ((!followerCount  || !followingCount ) && userId) {
    dispatch(fetchFollowersAndFollowingCount({ userId }));
  }
} , [dispatch, userId, followerCount, followingCount])



  return (
    <div className="px-14 w-full">
      <div className="flex flex-col gap-2 placeholder-sky-300  pt-7 justify-start items-center ">
        <Separator />
        <div className="flex p-3 justify-evenly px-0 w-full items-center">
          <Button variant={"ghost"} className="h-auto flex justify-start items-center flex-col">
            <p>follwers</p>

            {isLoading || !userId ? 
             <Skeleton className="h-2 w-5"/>
             :   
            <p>{followerCount}</p>
        }
          </Button >
          <Separator className="  h-12" orientation="vertical" />
          <Button variant={"ghost"} className="h-auto flex justify-start items-center flex-col">
            <p>follwimg</p>
            {isLoading || !userId? 
             <Skeleton className="h-2 w-5"/>
             :   
             <p>{followingCount}</p>
        }
          </Button>
        </div>

        <Separator />
      </div>
    </div>
  );
};

export default MinmalFollowerSection;
