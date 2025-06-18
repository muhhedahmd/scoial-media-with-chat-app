"use client"

import type React from "react"

import { useGetPostImagesQuery } from "@/store/api/apiSlice"
import { useEffect, useRef, useState } from "react"
import { Swiper, type SwiperRef, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import BluredImage from "@/app/_components/ImageWithPlaceholder"
import type { post_image } from "@prisma/client"
import type { initialPostData } from "./MenuPostOption/MenuPostOption"

import ImageGrid from "./ImageGrid"

interface ContentPostProps {
  postId: number
  content?: string
  minimal?: boolean
  share?: boolean
  editedPost?: initialPostData
  setEditedPost?: React.Dispatch<React.SetStateAction<initialPostData>> | undefined
  editableDialog?: boolean
}

const parseContent = (text: string) => {
  const parts = text.split(/(\s+)/)
  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      return (
        <span key={index} className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
          {part}
        </span>
      )
    } else if (part.startsWith("#")) {
      return (
        <span key={index} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
          {part}
        </span>
      )
    }
    return part
  })
}

export default function ContentPost({
  content,
  share,
  postId,
  editedPost,
  setEditedPost,
  minimal = false,
  editableDialog = false,
}: ContentPostProps) {
  const { data: postImages, isLoading: isLoadingPostImages, isError: isErrorPostImages } = useGetPostImagesQuery(postId)
  const [showMore, setShowMore] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperRef>(null)

  useEffect(() => {
    if (setEditedPost)
      setEditedPost((prev) => {
        return {
          ...prev,
          images: postImages as post_image[],
        }
      })
  }, [postImages, setEditedPost])

  if (!postId || isLoadingPostImages) return <ContentPostSkeleton />
  if (isErrorPostImages) return <div className="text-red-500 dark:text-red-400">Error loading post images</div>

  const truncatedContent = content?.slice(0, 150)
  const shouldTruncate = content && content?.length > 150

  if (editableDialog || editedPost?.images?.length) {
    return (
      <>
        {
          <div className="w-full">
            <ImageGrid images={editedPost!} setImages={setEditedPost} isEditMode={true} />
          </div>
        }
      </>
    )
  }

  return (
    <div className="w-full space-y-3">
      {/* Post Content */}
      {content && (
        <div className="text-slate-800 dark:text-slate-200 text-base">
          <p>{shouldTruncate && !showMore ? parseContent(truncatedContent + "...") : parseContent(content || "")}</p>
          {shouldTruncate && (
            <Button
              variant="link"
              className="p-0 h-auto text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Show less" : "Show more"}
            </Button>
          )}
        </div>
      )}

      {/* Post Images */}
      {postImages && postImages.length > 0 && !minimal && (
        <div className="relative  rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination]}
            pagination={{ clickable: true }}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="max-h-[500px]"
          >
            {postImages.map((image, index) => (
              <SwiperSlide key={index} className="flex aspect-square items-center justify-center">
                <BluredImage
                  imageUrl={image.img_path || ""}
                  height={image.height}
                  width={image.width}
                  alt={`Post image ${index + 1}`}
                  blurhash={image.HashBlur}
                  quality={100}
                  className="h-full w-full object-contain max-h-[500px]"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Image Navigation Dots */}
          {postImages.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center space-x-2">
              {postImages.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    activeIndex === index ? "bg-emerald-600 dark:bg-emerald-400 w-4" : "bg-slate-300 dark:bg-slate-600",
                  )}
                  onClick={() => swiperRef.current?.swiper.slideTo(index)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Thumbnail Images (for minimal view) */}
      {postImages && postImages.length > 0 && minimal && (
        <div className="flex flex-wrap gap-2">
          {postImages.map((image, index) => (
            <BluredImage
              key={index}
              imageUrl={image.img_path || ""}
              height={48}
              width={48}
              alt={`Thumbnail ${index + 1}`}
              blurhash={image.HashBlur}
              quality={80}
              className="w-12 h-12 object-cover rounded-md"
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ContentPostSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
      </div>
      <div className="h-[300px] bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
    </div>
  )
}
