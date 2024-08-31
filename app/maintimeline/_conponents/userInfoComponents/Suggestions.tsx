"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchSuggetionFollowers,
  selectFollowersError,
  selectFollowersStatus,
  selectSuggestions,
} from "@/store/Reducers/follwerSlice";
import { AppDispatch } from "@/store/store";
import { User } from "@prisma/client";
import Image from "next/image";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SuggestionLoader } from "../PostContainerComponsnts/postCompoenets/Loaderes";

const Suggestions = ({
  user
} : {user : User} ) => {
  const SelectSuggestion = useSelector(selectSuggestions);
  const status = useSelector(selectFollowersStatus);
  const Error = useSelector(selectFollowersError);
  const dispatch = useDispatch<AppDispatch>();
  const isLoading =
    status === "loading" || status === "idle" || status === null ;

 
  useEffect(() => {

    if (!selectSuggestions.length ||status === "idle" && user?.id ) {
      dispatch(fetchSuggetionFollowers({ userId: user?.id}));
    }

  }, [dispatch, status, user?.id]);

  if (isLoading) {
    return <SuggestionLoader/>
  }

  return (
    <div className="relative gap-2  flex-col p-4 pt-0 overflow-y-auto overflow-x-hidden flex justify-start items-start bg-white rounded-lg h-[30%] border-2 shadow-md w-full">
    <div className="flex sticky top-0 z-10 bg-white p-1 justify-between items-center w-full">
      <p className=" font-normal ">people may you know </p>
      <div>
        <p className=" font-normal ">See all</p>
      </div>
    </div>

    <div className="flex flex-col gap-6 justify-start items-start w-full">
      {SelectSuggestion?.map((user, i) => {
        return (
          <div
            key={i}
            className="flex w-full gap-6 justify-start items-center"
          >
            <Image 
            src={user?.profile?.profile_picture || ""}
            alt={user.first_name+"pic"}
            width={50}
            height={50}
            className="w-12 h-12 object-cover rounded-full bg-slate-300" />
            <div className="flex w-full flex-col justify-start gap-0 items-start">
              {/* <Skeleton className="w-[90%] h-5 bg-slate-300" /> */}
                <p>

              {user.first_name +" " + user.last_name}
                </p>
              <p className="cursor-pointer text-muted-foreground">
              @{user.user_name}
              </p>

              {/* <Skeleton className="w-[50%] h-5 bg-slate-300" /> */}
            </div>
          </div>
        );
      })}
    </div>
  </div>
  );
};

export default Suggestions;
