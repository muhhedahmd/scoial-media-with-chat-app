import { post } from "@prisma/client";
import { ContentPostLoader } from "./Loaderes";
import { useGetPostImagesQuery } from "@/store/api/apiSlice";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Gallery } from "react-grid-gallery";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import { cn } from "@/lib/utils";
interface ContentPostProps {

  postId: number;
  content: string;
  minimal?: boolean
}


const ContentPost = ({
  content,
  postId,
  minimal

}: ContentPostProps) => {
  const {
    data: postImages,
    isLoading: isLoadingPostImages,
    isError: isErrorPostImages,

  } = useGetPostImagesQuery(postId);
  const [showMore, setShowMore] = useState(false);

  
  if(!postId) return;


  if (isLoadingPostImages) {
    return <ContentPostLoader />;
  }

  // const handleShowMore = () => {
  //   setShowMore(true);

    return (
      <div className="w-full  mt-3 flex h-fit justify-start flex-col items-start gap-3  md:gap-10">
        <p className="text-start text-gray-900">{content}</p>
  
        {postImages?.length ? (
          <Swiper
          
          style={{
            // height:minimal ? "auto" : "30rem "
          }}
          className={cn("h-[20rem]  w-full " )}
          
          >
            {postImages.map((image, index) => (
              <SwiperSlide
                className="flex justify-center items-center h-full w-full"
                key={index}
              >
                <div className="w-full h-full relative aspect-square">
                  <Image
                    src={image.img_path || ""}
                    alt={`${postId} ${image.id}`}
                    fill
                    quality={100}
                    className="object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          null
        )}
      </div>
    );
  };
  
  

export default ContentPost;
