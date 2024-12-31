"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import PostCreation from '../../_components/PostCreation'
import Posts from './PostContainerComponsnts/Posts'
import { Profile, User } from '@prisma/client'
import { setPostsPagination } from '@/store/Reducers/pagganitionSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { useGetPostsQuery } from '@/store/api/apiSlice'


interface PostContainerProps {
  user : User
  isLoadingProfile : boolean 
  MainUserProfile :Profile | any

}
const PostContainer = ({
  isLoadingProfile ,
  MainUserProfile ,
  user
}:PostContainerProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { skip, take } = useSelector((state: any) => state.pagination.posts);
  const {
    data: FetchPostData,
    isLoading: isLoadingFetch,
    isFetching,
  } = useGetPostsQuery({
    pgnum: skip,
    pgsize: take,
  });

  const postsContainerRef = useRef<HTMLDivElement>(null);

  const [isScrolled , setIsScrolled ]= useState(false)


  const handleScroll = useCallback(() => {
    if (!postsContainerRef.current || isFetching || !FetchPostData?.hasMore)
      return;

    const { scrollTop, scrollHeight, clientHeight } = postsContainerRef.current;

    if(postsContainerRef && postsContainerRef.current){
      postsContainerRef.current.addEventListener('scroll', () => {
        if(postsContainerRef?.current) {
          setIsScrolled(postsContainerRef?.current?.scrollTop > 520  )
        }
        });
        
      setIsScrolled(false)
    }

    if (scrollTop + clientHeight + 5 >= scrollHeight) {
      dispatch(setPostsPagination({ skip: skip + 1, take }));
    }
  }, [postsContainerRef, isFetching, FetchPostData?.hasMore, dispatch, skip, take]);

  useEffect(() => {
    const container = postsContainerRef.current;

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll, postsContainerRef]);
  return (
    <div
      className=' relative rounded-sm  scrollbar-hide h-full  flex justify-start items-start gap-4 flex-col  w-full md:max-w-[50%]   md:w-3/4'
      >
        
        <PostCreation 
        isScrolled={isScrolled}
          isLoadingProfile={isLoadingProfile}
          profile={MainUserProfile}
          user={user}
        
        />
    

        <Posts 
        isScrolled={isScrolled}
        postsContainerRef={postsContainerRef}
        isLoadingFetch={isLoadingFetch}
       FetchPostData={FetchPostData}
        MainUserProfile={MainUserProfile}
        user={user}
        
        />

      </div>
  )
}

export default PostContainer