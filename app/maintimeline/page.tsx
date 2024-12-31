"use client";
import React from "react";
import PostContainer from "./_conponents/PostContainer";
import MoreComponets from "./_conponents/MoreComponets";
import UserInfo from "./_conponents/UserInfo";
import Suggestions from "./_conponents/userInfoComponents/Suggestions";
import { useGetProfileQuery } from "@/store/api/apiProfile";
import Header from "./_conponents/Header";
import { useSelector } from "react-redux";
import { userResponse } from "@/store/Reducers/mainUser";

const Page = () => {
  const user = useSelector(userResponse);

  const {
    data: profile,
    isLoading: status,
    isSuccess,
    isError,
  } = useGetProfileQuery({ userId: user?.id! });

  // if(!user )return
  if (!profile || !user?.id) return;
  return (
    <>
      <Header user={user} />
      <div
        className=" relative gap-3  bg-gray-50 px-4 flex h-full justify-start items-start"
        style={{
          height: "calc(100vh  - 3rem)",
        }}
      >
        <div className="hidden lg:flex  flex-col h-full justify-start items-start gap-3 w-1/3">
          <UserInfo isLoading={status} profile={profile } user={user} />

          <Suggestions user={user} />
        </div>
        <PostContainer
          isLoadingProfile={status}
          MainUserProfile={profile}
          user={user}
        />

        <MoreComponets user={user} />
      </div>
    </>
  );
};

export default Page;
