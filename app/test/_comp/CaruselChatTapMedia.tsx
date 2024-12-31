'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper as SwiperType } from "swiper/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BluredImage from "@/app/_components/ImageWithPlaceholder";
import VideoPlayer from "@/app/_components/VedioWithPlaceHolder";
import { cn } from "@/lib/utils";
import "swiper/css";

interface MessageMedia {
  type: string;
  name: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  height?: number;
  width?: number;
  HashBlur?: string;
}

interface CaruselChatTapMediaProps {
  openCostumModel: {
    media?: MessageMedia;
    medias: MessageMedia[];
    activeIdx: number;
    x: number;
    y: number;
    amimate: boolean;
  } | null;
  setopenCostumModel: React.Dispatch<
    React.SetStateAction<{
      media?: MessageMedia;
      x: number;
      medias: MessageMedia[];
      activeIdx: number;
      y: number;
      amimate: boolean;
    } | null>
  >;
}

export function CaruselChatTapMedia({
  openCostumModel,
  setopenCostumModel,
}: CaruselChatTapMediaProps) {
  const ref = useRef<SwiperRef>(null);
  const bulletContainerRef = useRef<HTMLDivElement>(null);

  const handlePrevious = useCallback(() => {
    if (!ref.current) return;
    ref.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!ref.current) return;
    ref.current.swiper.slideNext();
  }, []);

  const calculateScale = (index: number, activeIndex: number, totalItems: number) => {
    const distance = Math.abs(index - activeIndex);
    const maxDistance = Math.floor(totalItems / 2);
    const normalizedDistance = Math.min(distance, maxDistance) / maxDistance;
    return 1 - 0.5 * Math.sin(normalizedDistance * Math.PI / 2);
  };

  const handleBullets = useCallback((idx: number) => {
    if (!openCostumModel) return;
    const mediaInView = openCostumModel.medias[idx % openCostumModel.medias.length] as MessageMedia;
    setopenCostumModel((prev) => {
      if (prev) {
        return {
          ...prev,
          media: mediaInView,
          activeIdx: idx,
          amimate: true,
        };
      } else {
        return null;
      }
    });
    ref.current?.swiper.slideTo(idx % openCostumModel.medias.length);
  }, [openCostumModel, setopenCostumModel]);

  useEffect(() => {
    if (!ref.current || openCostumModel?.activeIdx === undefined) return;
    ref.current.swiper.slideTo(openCostumModel.activeIdx % openCostumModel.medias.length, 10);
  }, [openCostumModel?.activeIdx, openCostumModel?.medias.length]);

  const handleSlideChange = (swiper: SwiperType) => {
    if (!openCostumModel) return;
    const activeIdx = swiper.realIndex;
    const mediaInView = openCostumModel.medias[activeIdx] as MessageMedia;
    setopenCostumModel((prev) => {
      if (prev) {
        return {
          ...prev,
          media: mediaInView,
          activeIdx: activeIdx,
          amimate: true,
        };
      } else {
        return null;
      }
    });
  };

  useEffect(() => {
    if (!bulletContainerRef.current || !openCostumModel) return;
    const container = bulletContainerRef.current;
    const activeButton = container.children[openCostumModel.activeIdx] as HTMLElement;
    if (activeButton) {
      const containerWidth = container.offsetWidth;
      const buttonWidth = activeButton.offsetWidth;
      const scrollLeft = activeButton.offsetLeft - containerWidth / 2 + buttonWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [openCostumModel?.activeIdx]);

  return (
    <div className="relative flex w-full justify-start items-center">
      <Button
        variant="ghost"
        className="hidden md:flex rounded-full mr-3 bg-white relative z-10"
        size="icon"
        onClick={handlePrevious}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex flex-col w-full justify-center items-center">
        <Swiper
          ref={ref}
          modules={[Navigation, Pagination]}
          pagination={{ clickable: true }}
          onSlideChange={handleSlideChange}
          className="md:h-[20rem] md:w-[30rem] lg:w-[35rem] lg:h-[25rem] h-[20rem] w-[26rem] bg-slate-800"
        >
          {openCostumModel?.medias.map((item, index) => {
            const isVideo = item.type.startsWith("video");
            return (
              <SwiperSlide
                key={index}
                className="bg-transparent flex items-center justify-center"
              >
                {item && !isVideo ? (
                  <BluredImage
                    alt={item.name}
                    className="h-full w-full object-fill"
                    height={item.height || 0}
                    width={item.width || 0}
                    imageUrl={item.mediaUrl}
                    quality={100}
                    blurhash={item.HashBlur || ""}
                  />
                ) : item && isVideo ? (
                  <VideoPlayer
                    title={item.name}
                    className="h-full w-full object-fill"
                    poster={item.thumbnailUrl || ""}
                    src={item.mediaUrl}
                    aspectRatio="1/1"
                    blurhash={item.HashBlur || ""}
                  />
                ) : null}
              </SwiperSlide>
            );
          })}
          <Skeleton className="w-full h-full bg-slate-800" />
        </Swiper>
        <div className="bg-white/75   max-w-[20rem] overflow-hidden flex justify-center items-center mt-3 rounded-md p-1">
          {openCostumModel?.medias && openCostumModel.medias.length > 1 && (
            <div ref={bulletContainerRef} className="flex justify-start items-center space-x-2 h-[.6rem] overflow-x-auto scrollbar-hide">
              {[...openCostumModel.medias].map((_, index) => {
                const scale = calculateScale(index, openCostumModel.activeIdx, openCostumModel.medias.length * 7);
                return (
                  <button
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all shadow-md flex-shrink-0",
                      openCostumModel.activeIdx === index
                        ? "bg-gray-800"
                        : "bg-gray-400 hover:bg-gray-600"
                    )}
                    style={{
                      transform: `scale(${scale})`,
                      opacity: 0.5 + 0.5 * scale,
                    }}
                    onClick={() => handleBullets(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        className="hidden md:flex rounded-full bg-white ml-3 relative z-10"
        size="icon"
        onClick={handleNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

