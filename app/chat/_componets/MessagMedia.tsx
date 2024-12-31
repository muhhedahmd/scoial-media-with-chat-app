"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { MessageMedia } from "@prisma/client";
import { FileText, Film, Download, X, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import BluredImage from "@/app/_components/ImageWithPlaceholder";
import DownloadButton from "@/components/DownloadButton";
import VideoPlayer from "@/app/_components/VedioWithPlaceHolder";
import { cn } from "@/lib/utils";

interface MessagMediaProps {
  msg_id: number;
  MessageContent: React.ReactNode;
  isAuthUserSender: boolean;
  media: MessageMedia[];
}

export default function MessagMedia({
  msg_id,
  MessageContent,
  isAuthUserSender,
  media = [],
}: MessagMediaProps) {
  const [selectedItem, setSelectedImage] = useState<MessageMedia | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const images = media.filter((item) => item.type.startsWith("image"));
  const videos = media.filter((item) => item.type.startsWith("video"));
  const audios = media.filter((item) => item.type.startsWith("audio"));
  const documents = media.filter(
    (item) =>
      !item.type.startsWith("image") &&
      !item.type.startsWith("video") &&
      !item.type.startsWith("audio")
  );

  const handleAudioPlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const normailzeAmountOfImagesAndVideos = [...images, ...videos].length > 4 ?  [...images, ...videos].slice(0,4) :[...images, ...videos] 
  const isThreeMedia = [...images, ...videos].length === 3 

  return (
    <div
      className={`p-4 rounded-lg ${
        isAuthUserSender
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground"
      }`}
    >
      {audios.length > 0 && (
        <div className="mb-4">
          <audio ref={audioRef} src={audios[0].mediaUrl} className="hidden" />
          <Button
            onClick={handleAudioPlayPause}
            variant="outline"
            className="w-full"
          >
            {isPlaying ? (
              <Pause className="mr-2 h-4 w-4" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            {isPlaying ? "Pause Audio" : "Play Audio"}
          </Button>
        </div>
      )}

      {(images.length > 0 || videos.length > 0) && (
        <div className={cn(
          [...images, ...videos].length > 4 ?" grid-cols-2 grid gap-2 " :
          "flex justify-start flex-wrap max-w-[21rem] gap-[.2rem]  "
          
          )}>
          {normailzeAmountOfImagesAndVideos.map((item, index) => (
            <div className={cn(isThreeMedia && 'flex flex-1')} key={item.id}>
              {item.type.startsWith("image") ? (
                <div
                  className="relative flex flex-1 "
                  onClick={() => setSelectedImage(item)}
                >
                  <BluredImage
                    imageUrl={item.mediaUrl}
                    alt={item.name}
                    blurhash={item.HashBlur || ""}
                    height={item.height || 0}
                    width={item.width || 0}
                    quality={90}
                    className="object-cover rounded-lg flex flex-1 w-[6rem] h-[4rem] md:w-[10rem] md:h-[7rem] "
                  />
                </div>
              ) : (
                
                <div
                  onClick={() => setSelectedImage(item)}
                  className="relative  bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-lg"
                >
                  <BluredImage
                    imageUrl={item.thumbnailUrl || ""}
                    alt={item.name}
                    blurhash={item.HashBlur || ""}
                    height={item.height || 0}
                    width={item.width || 0}
                    quality={90}
                    className="object-cover rounded-lg w-[10rem] h-[7rem]"
                  />
                  <Button
                    variant={"outline"}
                    className="
     absolute top-[50%] left-[50%] 
    transform -translate-x-[50%] -translate-y-[50%]"
                  >
                    <Play className="w-5 h-5 " />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {documents.length > 0 && (
        <div className="mb-4 space-y-2 flex gap-3">
          {documents.map((item) => (
            <div className="relative" key={item.id}>
              <BluredImage
                imageUrl={item.thumbnailUrl || ""}
                alt={item.name}
                blurhash={item.HashBlur || ""}
                height={item.height || 0}
                width={item.width || 0}
                quality={90}
                className="
                      w-[10rem]
                      h-[5rem]
                    object-cover rounded-lg"
              />
              <div className="absolute bottom-0 left-0 w-full">
                <DownloadButton
                  item={{
                    mediaUrl: item.mediaUrl,
                    name: item.name,
                  }}
                  className="w-full flex items-center p-2 bg-gray-800 rounded-lg"
                >
                  <FileText className="h-3 w-3 text-gray-400 mr-2" />
                  <span className="text-sm truncate flex-1">{item.name}</span>
                  <Download className="h-4 w-4 text-gray-400" />
                </DownloadButton>
              </div>
            </div>
          ))}

        </div>
      )}

      <div className="mt-2">{MessageContent}</div>
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedImage(null)}>
      <DialogContent
      style={{
        aspectRatio :selectedItem?.height && selectedItem.width ? selectedItem?.width / selectedItem?.height : 1/1
      }}
      className={cn( `w-full
         amax-w-[${selectedItem?.width && `${selectedItem?.width}`+"px" || "50vw"}] 
          amax-h-[${selectedItem?.height && `${selectedItem?.height}`+"px" || "50vh"}] 
          p-0 border-none overflow-hidden` , 
        selectedItem?.height && selectedItem.width && ''

      )}>
        <DialogClose 
        
        className="absolute right-4 top-4 z-10 rounded-full bg-black/50 text-white hover:bg-black/70">
          
        </DialogClose>

        {selectedItem && selectedItem.type.startsWith("image") && (
          <div className="relative w-full h-full">
            <BluredImage
              className="object-fill w-full h-full"
              alt={selectedItem.name}
              imageUrl={selectedItem.mediaUrl}
              quality={100}
              blurhash={selectedItem.HashBlur || ""}
              height={selectedItem.height || 0 }
              width={selectedItem.width || 0 }

            />
          </div>
        )}
        {selectedItem && selectedItem.type.startsWith("video") && (
          <div className="w-full h-full">
            <VideoPlayer
              className="object-contain w-full h-full"
              poster={selectedItem.thumbnailUrl || ""}
              src={selectedItem.mediaUrl}
              title={selectedItem.name}
              blurhash={selectedItem.HashBlur || ""}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
    </div>
  );
}
