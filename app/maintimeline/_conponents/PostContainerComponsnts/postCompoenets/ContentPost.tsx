"use client";

import { useGetPostImagesQuery } from "@/store/api/apiSlice";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import BluredImage from "@/app/_components/ImageWithPlaceholder";
import { post_image } from "@prisma/client";
import { initialPostData } from "./MenuPostOption/MenuPostOption";

import ImageGrid from "./ImageGrid";

interface ContentPostProps {
  postId: number;
  content?: string;
  minimal?: boolean;
  share?: boolean;
  editedPost?: initialPostData;
  setEditedPost?:
    | React.Dispatch<React.SetStateAction<initialPostData>>
    | undefined;
  editableDialog?: boolean;
}

const parseContent = (text: string) => {
  const parts = text.split(/(\s+)/);
  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      return (
        <span key={index} className="text-blue-500 font-semibold">
          {part}
        </span>
      );
    } else if (part.startsWith("#")) {
      return (
        <span key={index} className="text-green-500 font-semibold">
          {part}
        </span>
      );
    }
    return part;
  });
};

export default function ContentPost({
  content,
  share,
  postId,
  editedPost,
  setEditedPost,
  minimal = false,
  editableDialog = false,
}: ContentPostProps) {
  const {
    data: postImages,
    isLoading: isLoadingPostImages,
    isError: isErrorPostImages,
  } = useGetPostImagesQuery(postId);
  const [showMore, setShowMore] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperRef>(null);



  useEffect(() => {
    if (setEditedPost)
      setEditedPost((prev) => {
        return {
          ...prev,
          images: postImages as post_image[],
        };
      });
  }, [postImages, setEditedPost]);

  if (!postId || isLoadingPostImages) return <ContentPostSkeleton />;
  if (isErrorPostImages) return <div>Error loading post images</div>;

  const truncatedContent = content?.slice(0, 150);
  const shouldTruncate = content && content?.length > 150;

  if (editableDialog || editedPost?.images?.length) {

    return (
      <>
        {
          <div className="w-full">
            <ImageGrid
              images={editedPost!}
              setImages={setEditedPost}
              isEditMode={true}
            />
          </div>
        }
      </>
    );
  }

  return (
    <div className="w-full mx-auto text-[1rem] text-start gap-2 flex-col bg-white rounded-lg overflow-hidden">
      {postImages && postImages.length > 0 && !minimal && (
        <div className="relative mt-2">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination]}
            navigation={{
              prevEl: ".swiper-button-prev",
              nextEl: ".swiper-button-next",
            }}
            pagination={{ clickable: true }}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="h-[calc(100vw-2rem)] max-h-[30rem] w-full"
          >
            {postImages.map((image, index) => (
              <SwiperSlide
                key={index}
                className="bg-gray-50 flex items-center justify-center"
              >
                <BluredImage
                  imageUrl={image.img_path || ""}
                  height={image.height}
                  width={image.width}
                  alt={`Post image ${index + 1}`}
                  blurhash={image.HashBlur}
                  quality={100}
                  className="h-full w-full object-contain"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="absolute -bottom-2 -translate-x-[50%] left-[50%] z-30">
            {postImages && postImages.length > 1 && !minimal && (
              <div className="flex justify-center space-x-2 pb-4">
                {postImages.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all shadow-md",
                      activeIndex === index ? "bg-gray-800 w-4" : "bg-gray-300"
                    )}
                    onClick={() => swiperRef.current?.swiper.slideTo(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <div
        className={cn(
          "md:ml-[60px] ml-[45px] my-2",
          share ? " " : "md:ml-[60px] ml-[45px]"
        )}
      >
        <p className="text-gray-800 text-sm text-[1rem]">
          {shouldTruncate && !showMore
            ? parseContent(truncatedContent + "...")
            : parseContent(content || "")}
        </p>
        {shouldTruncate && (
          <Button
            variant="link"
            className="mt-2 p-0 h-auto text-blue-500 hover:text-blue-700"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Show less" : "Show more"}
          </Button>
        )}
      </div>
      {postImages && postImages.length > 0 && minimal && (
        <div className="flex flex-wrap gap-2 p-4">
          {postImages.map((image, index) => (
            <BluredImage
              key={index}
              imageUrl={image.img_path || ""}
              height={48}
              width={48}
              alt={`Thumbnail ${index + 1}`}
              blurhash={image.HashBlur}
              quality={100}
              className="w-12 h-12 object-cover rounded-md"
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ContentPostSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-[calc(100vw-2rem)] max-h-[30rem] bg-gray-200" />
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}
