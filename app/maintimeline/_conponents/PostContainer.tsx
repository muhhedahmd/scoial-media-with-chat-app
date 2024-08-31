"use client"
import React, {  } from 'react'
import PostCreation from './PostContainerComponsnts/PostCreation'
import Posts from './PostContainerComponsnts/Posts'
import { Profile, User } from '@prisma/client'


interface PostContainerProps {
  user : User
  isLoadingProfile : boolean 
  MainUserProfile :Profile

}
const PostContainer = ({
  isLoadingProfile ,
  MainUserProfile ,
  user
}:PostContainerProps) => {


  return (
    <div
      className=' relative rounded-sm  h-full  flex justify-start items-start gap-4 flex-col  w-full md:max-w-[50%]   md:w-3/4'
      >
        <PostCreation 
          isLoadingProfile={isLoadingProfile}
          profile={MainUserProfile}
          user={user}
        
        />
        <Posts 
        
        MainUserProfile={MainUserProfile}
        user={user}

        />

      </div>
  )
}

export default PostContainer