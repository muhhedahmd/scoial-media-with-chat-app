"use client"
import React, { useRef } from "react";
import Profile from "./_comp/profile";
import { useScroll } from "framer-motion";

const ProfileSection = () => {
  const profileSectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: profileSectionRef, // Make sure the target is the scrollable container
    offset: ["start start", "end end"], // Optional offsets for more control
  });

  return (
    <div 
   
    className="w-full h-full">
      <Profile/>
    </div>
  );
};

export default ProfileSection;
