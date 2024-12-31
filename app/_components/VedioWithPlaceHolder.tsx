"use client";

import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { AnimatePresence, motion } from "framer-motion";
import { BlurhashCanvas } from "react-blurhash";
import Image from "next/image";

interface VideoPlayerProps {
  src: string;
  poster: string;
  blurhash: string;
  title?: string;
  aspectRatio?: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  blurhash,
  title = "Video Player",
  aspectRatio = "16/9",
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new window.Image();
    img.src = poster;
    img.onload = () => setIsLoading(false);
    img.onerror = () => setIsLoading(false);

    return () => {
      img.src = "";
    };
  }, [poster]);

  return (
    <div 
      className={`relative w-full ${className}`} 
      style={{ aspectRatio }}
    >
      {isLoading && blurhash.length && (
        <AnimatePresence mode="sync">
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BlurhashCanvas  
            
            hash={blurhash} 
            className="w-full h-full"
            punch={1} />
          </motion.div>
        </AnimatePresence>
      )}

      <AnimatePresence>
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <ReactPlayer
            url={src}
            playing={false}
            
            light={
              <Image 
                alt={title} 
                src={poster} 
                layout="fill"
                objectFit="cover"
              />
            }
            fallback={

              blurhash ?
              <BlurhashCanvas
                hash={blurhash}
            className="w-full h-full"
                punch={1}
              />: <>
              </>

            }
            muted={false}
            volume={1}
            controls
            width="100%"
            height="100%"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VideoPlayer;