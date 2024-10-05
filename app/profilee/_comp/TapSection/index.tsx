import "swiper/css";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import PostsSectionTap from "./PostsSectionTap";
import { useRef, useState } from "react";
import { AnimatePresence, motion, MotionValue } from "framer-motion";
import ProfileTaps from "./Profiletaps";
import { User } from "@prisma/client";
import { cn } from "@/lib/utils";

export const PlaceHolderTweetSlideNum = 0;
export const PlaceHolderMediaSlideNum = 1;
export const PlaceHolderLikesSlideNum = 2;

const TapsComp = ({ CachedUser, setIsScrolled , isHeaderSticky  }: {  isHeaderSticky: MotionValue<number>,  CachedUser: User; setIsScrolled: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [active, setActive] = useState(0);
  const _swiperRef = useRef<SwiperRef>(null);

  return (
    <div
    className="max-w-full    ">

      <ProfileTaps active={active} setActive={setActive} swiperRef={_swiperRef} />

      <div className="w-full md:w-full lg:w-[70vw]">
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
            <PostsSectionTap setIsScrolled={setIsScrolled} CachedUser={CachedUser} />
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