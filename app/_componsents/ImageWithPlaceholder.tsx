"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Blurhash, BlurhashCanvas } from "react-blurhash";
import { AnimatePresence, motion } from "framer-motion";
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

    img.onload = async (x) => {
      console.log({ x: x.bubbles.valueOf(), y: x.bubbles.valueOf() });
      // await delay(10000); // Aqqqqqqdjusqqt the delay as needed
      console.log(img);

      setIsLoading(false);
    };

    img.onerror = async () => {
      // await delay(1000); // Adjust the delay for errors as well
      setIsLoading(false);
    };
  }, [height, imageUrl, width]);
  return (
    <>
      {isLoading && blurhash && (
        <>
          <AnimatePresence mode="sync">
            <motion.div
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BlurhashCanvas
                // width={width}
                // height={200}
                hash={blurhash || ""}
                className={className}
                
              />
            </motion.div>
          </AnimatePresence>
        </>
      )}
      {!isLoading && (
        <AnimatePresence>
          <motion.div
            className={`w-full flex justify-center items-center  ` + className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Image
              alt={alt}
              // height={height}
              src={imageUrl}
              quality={100}
              loading="lazy"
              objectFit="cover"
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
