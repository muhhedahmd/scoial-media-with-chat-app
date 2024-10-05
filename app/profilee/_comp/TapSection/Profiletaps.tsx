"use client";

import { RefObject } from "react";
import { SwiperRef } from "swiper/react";
import {
  PlaceHolderLikesSlideNum,
  PlaceHolderMediaSlideNum,
  PlaceHolderTweetSlideNum,
} from ".";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const ProfileTaps = ({
  swiperRef,
  setActive,
  active,
}: {
  active: number;
  swiperRef: RefObject<SwiperRef>;
  setActive: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const handleSlideTo = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideTo(index);
    }
    setActive(index);

  };

  // Button data array for cleaner management
  const buttons = [
    { label: "Tweets", index: PlaceHolderTweetSlideNum },
    { label: "Media", index: PlaceHolderMediaSlideNum },
    { label: "Likes", index: PlaceHolderLikesSlideNum },
  ];

  return (
    <div className="sticky top-[-17px] mt-4  flex justify-start z-[200] items-center pt-4 space-x-6 border-b bg-gray-100 border-gray-600 pb-2">
      <div className="flex items-center space-x-6">
        {buttons.map(({ label, index }) => (
          <motion.button
            key={label}
            onClick={() => handleSlideTo(index)}
            className={cn(
              "relative w-20 text-center transition-colors duration-300 font-medium",
              index === active ? "text-blue-400" : "text-gray-400"
            )}

          >
            {label}
    
          </motion.button>
        ))}
      </div>

      {/* Animated underline */}

    </div>
  );
};

export default ProfileTaps;
