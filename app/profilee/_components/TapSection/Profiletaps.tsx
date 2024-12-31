"use client";


import {
  PlaceHolderLikesSlideNum,
  PlaceHolderMediaSlideNum,
  PlaceHolderTweetSlideNum,
} from ".";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import ProfilePics from "../profilePics";
import { User } from "@prisma/client";

const ProfileTaps = ({
  setActive,
  isScrolled ,
  active,
  CachedUser,
}: {
  isScrolled:boolean
  CachedUser: User;
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
}) => {
 
  const buttons = [
    { label: "posts", index: PlaceHolderTweetSlideNum },
    { label: "Media", index: PlaceHolderMediaSlideNum },
    { label: "Likes", index: PlaceHolderLikesSlideNum },
  ];

  return (
    <motion.div className="sticky  top-[-17px] bg-white backdrop-blur-[10px]  mt-4 flex-col  flex justify-start z-[1] items-start pt-4 border-b  border-gray-600 pb-2">
    { 
    isScrolled  ? 
    <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="ml-2 mb-3 pt-3"
          >
          <ProfilePics CachedUser={CachedUser} minmalcard={true} />
        </motion.div>
      </AnimatePresence>
         : null}

      <div className="flex items-center space-x-6">
        {buttons.map(({ label, index }) => (
          <motion.button
            key={label}
            onClick={() => setActive(index)}
            className={cn(
              "relative w-20 text-center transition-colors duration-300 font-medium",
              index === active ? "text-black font-bold" : "text-gray-400"
            )}
          >
            {label}
          </motion.button>
        ))}
      </div>

  
    </motion.div>
  );
};

export default ProfileTaps;
