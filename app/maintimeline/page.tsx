"use client"
import React, { useEffect } from "react";
import PostContainer from "./_conponents/PostContainer";
import MoreComponets from "./_conponents/MoreComponets";
import UserInfo from "./_conponents/UserInfo";
import Suggestions from "./_conponents/userInfoComponents/Suggestions";
import { useSession } from "next-auth/react";
import {  User } from "@prisma/client";
import { useGetProfileQuery } from "@/store/api/apiProfile";

const Page = () => {

  const { data } = useSession();
  const user = data?.user as User;

    const   {
      data : profile , 
      isLoading :status,
      isSuccess  ,
      isError
    } = useGetProfileQuery({userId : user?.id})
  if(!profile  || !user.id)return;
  return (
    <div
      className=" relative gap-3 pt-4 bg-gray-100 px-4 flex h-full justify-start items-start"
      style={{
        height: "calc(100vh  - 3rem)",
      }}
    >
      <div className="hidden lg:flex  flex-col h-full justify-start items-start gap-3 w-1/3">
        <UserInfo 
        isLoading={status}
        profile={profile}
        user={user}

        />
        
        <Suggestions 
        user={user}
        />
      </div>
      <PostContainer
      
      isLoadingProfile={status}
      MainUserProfile={profile}
      user={user}
      />
      
      <MoreComponets user={user} />
    </div>
  );
};

export default Page;
