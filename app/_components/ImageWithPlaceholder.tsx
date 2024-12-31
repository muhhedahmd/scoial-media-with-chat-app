"use client";
import React, { useEffect, useState } from "react";
import { BlurhashCanvas } from "react-blurhash";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface Props {
  imageUrl: string;
  width: number;
  height: number;
  className: string;
  alt: string;
  quality: number;
  blurhash?: string | undefined;
}

const BluredImage: React.FC<Props> = ({
  imageUrl,
  width,
  height,
  className,
  alt,
  quality,
  blurhash,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const img = new window.Image(width, height);
    img.src = imageUrl;
    img.width = width;
    img.height = height;

    img.onload = () => {
      setIsLoading(false);
    };

    img.onerror = () => {
      setIsLoading(false);
    };
    return (
      (()=> img.remove())()  )
  }, [height, imageUrl, width]);

  return (
    <>
      {isLoading && blurhash && (
        <AnimatePresence mode="sync">
          <motion.div
            className={className}

            animate={{ opacity: 1 }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(0px)" }}
            >
            <BlurhashCanvas
              hash={blurhash || ""}
              className={className}
              
            />
          </motion.div>
        </AnimatePresence>
      )}

      {!isLoading && (
        <AnimatePresence>
          <motion.div
            className={`flex justify-center items-center ` + className}
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: .25 }} // Transition takes 1 second
          >
            
            <Image
              alt={alt}
              src={imageUrl }
              quality={quality}
              loading="lazy"
              fill
              className={className}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

export default BluredImage;


