"use client"
import { useGetPostImagesQuery } from '@/store/api/apiSlice'
import Image from 'next/image'
import React from 'react'
const ImagesPost = ({
    postId
}:{
    postId: number
}) => {
if(!postId)
    <div>
        no id provide 
    </div>

    const {
        data: images,
        isLoading,
        error
        
    } =useGetPostImagesQuery(postId)

    if(isLoading)
        <div>Loading...</div>

  return (
    <div>
        {images?.map(({id ,img_path ,post_id})=>{

            return <Image
            key={id}
            width={50 }
            height={50}
            alt={
                `image ${id}`
            }
            src={img_path}
            />
        })}

    </div>
  )
}

export default ImagesPost