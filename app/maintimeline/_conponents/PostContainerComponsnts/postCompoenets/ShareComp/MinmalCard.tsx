import React from 'react'
import ContentPost from '../ContentPost'
import HeaderPost from '../HeaderPost'
import { User } from '@prisma/client'





interface MinmalCardProps {
    author_id : number
postId : number
user : User
title: string
} 

const MinmalCard = ({
author_id,
postId,
user,
title,
} :MinmalCardProps) => {


  return (
    <div
    id={`${postId}`}
    className={`expanded-delay-comment-${postId} p-3 w-full pl-4 shadow-sm bg-white border-2 
    border-[#f9f9f9] rounded-md flex flex-col justify-start items-start`}
  >
  


    <div
      className="w-[95%] m-auto p-4 flex justify-start items-start flex-col "
   
    >
      <HeaderPost
        postId={postId}
        author_id={author_id}
        user={user}
      />
      <div
        style={{
          margin: "0 0 0 68px",
        }}
      >
        <ContentPost postId={postId} content={title || ""} />
      </div>
    </div>

  </div>

  )
}

export default MinmalCard