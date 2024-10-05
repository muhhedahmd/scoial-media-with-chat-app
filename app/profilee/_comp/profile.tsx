"use client";
import React, { useState, useRef, useLayoutEffect } from "react";
import ProfilePics from "./profilePics";
import ProfileInfo from "./ProfileInfo";
import ProfileStats from "./ProfileStats";
import { userResponse } from "@/store/Reducers/mainUser";
import { useSelector } from "react-redux";
import TapsComp from "./TapSection";
import { cubicBezier, motion, useTransform } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Profile = ({}) => {
  const CachedUser = useSelector(userResponse)!;
  const [isScrolled, setIsScrolled] = useState(false);
  const ref = useRef(null);
  // Ensure we are referencing the actual scrollable container

  // Use useScroll hook to track the scroll progress of the profileSectionRef

  useGSAP(()=>{
  gsap.fromTo(".test", {
    scrollTrigger: ref.current,
    x: 100,
    y :300
  } , {
    x: 0, 
    y:0,
  });
  


  // ScrollTrigger.create({
  //   trigger: '#id',
  //   start: 'top top',
  //   endTrigger: '#otherID',
  //   end: 'bottom 50%+=100px',
  //   onToggle: (self) => console.log('toggled, isActive:', self.isActive),
  //   onUpdate: (self) => {
  //     console.log(
  //       'progress:',
  //       self.progress.toFixed(3),
  //       'direction:',
  //       self.direction,
  //       'velocity',
  //       self.getVelocity()
  //     );
  //   }
  // });
} ,[ref , ref.current])
  
  if (!CachedUser) return null;

  return (
    <>
      {/* Debugging: This motion div will show the transformation */}
      <div
      className="test"
        style={{
          position: "fixed",
          zIndex: "10000",

          background: "#333",
          width: "100px",
          height: "100px",
        }}
      />

      {/* Scrollable Content */}

      <div
        // ref={profileSectionRef} // Attach the ref to the scrollable container
        className="flex w-full flex-col  overflow-hidden bg-gray-100 text-white p-4"
      >
        {/* Profile Header */}
        <div ref={ref} className="transition-all overflow-hidden duration-500 ">
          <ProfilePics CachedUser={CachedUser} />
          <ProfileInfo isScrolled={isScrolled} CachedUser={CachedUser} />
          <ProfileStats CachedUser={CachedUser} />
          <TapsComp CachedUser={CachedUser} setIsScrolled={setIsScrolled} />
        </div>
      </div>
    </>
  );
};

export default Profile;
