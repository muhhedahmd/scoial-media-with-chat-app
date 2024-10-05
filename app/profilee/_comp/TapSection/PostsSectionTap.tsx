"use client";
import Renderposts from "@/app/maintimeline/_conponents/PostContainerComponsnts/Renderposts";
import { useMessageOpen } from "@/context/comment";
import { useGetProfileQuery } from "@/store/api/apiProfile";
import { useGetPostsOfUserQuery } from "@/store/api/apiSlice";
import { Profile, User } from "@prisma/client";
import React, { useEffect, useMemo } from "react";
const PostsSectionTap = ({
  CachedUser,
  setIsScrolled,
}: {
  CachedUser: User;
  setIsScrolled: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    isError: isErrorPtofile,
    isLoading: isLoadingProfile,
    isFetching: isFetchingProfile,
    data: prfileData,
  } = useGetProfileQuery({
    userId: CachedUser?.id,
  });
  const { data, isLoading, isFetching, isError } = useGetPostsOfUserQuery({
    userId: CachedUser.id,
  });
  const memoPosts = useMemo(()=> data , [data])
  const { isMessageOpen } = useMessageOpen();

  useEffect(() => {
    const handleScroll = () => {
      // Track scroll and toggle the `isScrolled` state based on the scroll position
      const scrollY = window.scrollY;
      if (scrollY > 200) {
        // You can adjust the threshold as needed
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setIsScrolled]);

  if (!prfileData || !CachedUser) return;
  return (
    <div 
    className="h-[400vh]"
    >
      <Renderposts
        MainUserProfile={prfileData}
        isMessageOpen={isMessageOpen}
        posts={memoPosts?.posts}
        user={CachedUser}
      />
    </div>
  );
};

export default PostsSectionTap;
