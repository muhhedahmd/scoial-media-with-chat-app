"use client";
import React, { useRef } from "react";
import ProfilePics from "./profilePics";
import ProfileInfo from "./ProfileInfo";
import ProfileStats from "./ProfileStats";
import TapsComp from "./TapSection";
import { User } from "@prisma/client";

const Profile = ({isScrolled  , CachedUser}  :{
  isScrolled: boolean
  CachedUser : User
}) => {

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const profileInfoRef = useRef<HTMLDivElement>(null);
  const profileStatsRef = useRef<HTMLDivElement>(null);
  const tapsCompRef = useRef<HTMLDivElement>(null);

  // Framer Motion scroll hook


  return (
    <>
      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef} // Attach the scrollContainerRef to the scrollable container
        className="flex w-full  md:w-[50vw] flex-col  max-h-[90vh] rounded-md"
      >

        {/* Profile Header */}
        <div className="transition-all  w-full duration-500">
          {/* P rofile Pics */}
          <div className="p-4" ref={profileInfoRef}>
            <ProfilePics  CachedUser={CachedUser} />
            <ProfileInfo   isScrolled={isScrolled} CachedUser={CachedUser} />
          </div>
          <div  className="px-4" ref={profileStatsRef}>
            <ProfileStats  CachedUser={CachedUser} />
          </div>
          <div   ref={tapsCompRef}>
            <TapsComp
            
            CachedUser={CachedUser} isScrolled={isScrolled} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
