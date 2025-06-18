import "swiper/css";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import PostsSectionTap from "./PostsSectionTap";
import {  useState } from "react";
import {  motion, } from "framer-motion";
import ProfileTaps from "./Profiletaps";
import { User } from "@prisma/client";
import { usePaginationProfile } from "@/context/PaggnitionSystemProfile";

export const PlaceHolderTweetSlideNum = 0;
export const PlaceHolderMediaSlideNum = 1;
export const PlaceHolderLikesSlideNum = 2;

const TapsComp = ({ CachedUser, isScrolled }: { isScrolled:boolean, CachedUser: User;  }) => {

  const {
    active ,
    setActive ,
  } = usePaginationProfile()
  return (
    <div
    className="w-full    ">

      <ProfileTaps  CachedUser={CachedUser}  active={active}
      setActive={setActive}
      isScrolled={isScrolled}
      //  setActive={setActive}
         />

      <div className="w-full max-w-full ">
        <div className="flex flex-col">

          <motion.div
            key={PlaceHolderTweetSlideNum}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: active === PlaceHolderTweetSlideNum ? 1 : 0, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className={`${
              active === PlaceHolderTweetSlideNum ? "block" : "hidden"
            }`}
          >
            {
              CachedUser ? 
              <PostsSectionTap   CachedUser={CachedUser} />
              : null
            }
          </motion.div>

          <motion.div
            key={PlaceHolderMediaSlideNum}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: active === PlaceHolderMediaSlideNum ? 1 : 0, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className={`${
              active === PlaceHolderMediaSlideNum ? "block" : "hidden"
            }`}
          >
            <>
            <div
            className=" h-[300vh]"
            />
            </>
            {/* Media content */}
          </motion.div>

          <motion.div
            key={PlaceHolderLikesSlideNum}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: active === PlaceHolderLikesSlideNum ? 1 : 0, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className={`${
              active === PlaceHolderLikesSlideNum ? "block" : "hidden"
            }`}
          >
            {/* Likes content */}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TapsComp;