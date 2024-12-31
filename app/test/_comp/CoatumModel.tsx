import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { useGSAP } from "@gsap/react";
import { Skeleton } from "@nextui-org/react";
import { ChevronLeft, ChevronRight, Heart, Save, Star } from "lucide-react";
import { MessageLinks, MessageMedia } from "@prisma/client";
import BluredImage from "@/app/_components/ImageWithPlaceholder";
import { BlurhashCanvas } from "react-blurhash";
import { CaruselChatTapMedia } from "./CaruselChatTapMedia";

gsap.registerPlugin(useGSAP);

interface CoatumModelProps {
  openCostumModel: {
    media?: MessageMedia;
    x: number;
    medias: MessageMedia[] | MessageLinks[] | [];
    activeIdx: number;
    y: number;
    amimate: boolean;
  } | null;
  setopenCostumModel: React.Dispatch<
    React.SetStateAction<{
      media?: MessageMedia;
      x: number;
      medias: MessageMedia[] | MessageLinks[] | [];
      activeIdx: number;
      y: number;
      amimate: boolean;
    } | null>
  >;
}

const CoatumModel: React.FC<CoatumModelProps> = ({
  setopenCostumModel,
  openCostumModel,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const modalCardRef = useRef<HTMLDivElement>(null);
  const infoAreaRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!modalRef.current || !modalCardRef.current || !infoAreaRef.current)
      return;

    const tl = gsap.timeline({ paused: true });

    if (openCostumModel) {
      const normalizedX = gsap.utils.clamp(
        5,
        95,
        (openCostumModel.x / window.innerWidth) * 100
      );
      const normalizedY = gsap.utils.clamp(
        5,
        95,
        (openCostumModel.y / window.innerHeight) * 100
      );

      tl.set(modalRef.current, { display: "block", opacity: 1 })
        .to(modalRef.current, {
          opacity: 1,
          duration: 0.1,
          autoAlpha: 1,
          backdropFilter: "blur(6px)",
          ease: "power2.out",
        })
        .from(modalCardRef.current, {
          left: `${normalizedX}%`,
          top: `${normalizedY}%`,
          xPercent: -50,
          yPercent: -50,
          width: "15rem",
          height: "15rem",
          backdropFilter: "blur(6px)",
          opacity: 1,
          visibility: "hidden",
          scale: 0.3,
        })
        .to(modalCardRef.current, {
          left: "50%",
          backdropFilter: "blur(6px)",
          top: "50%",
          xPercent: -50,
          yPercent: -50,
          opacity: 1,
          scale: 0.5,
          width: "15rem",
          height: "15rem",
          duration: 0.2,
          ease: "power3.inOut",
        })
        .to(modalCardRef.current, {
          left: "50%",
          top: "50%",
          xPercent: -50,
          yPercent: -50,
          opacity: 1,
          scale: 1,
          width: "15rem",
          height: "15rem",
          duration: 0.2,
          ease: "power3.inOut",
        })
        .to(infoAreaRef.current, {
          opacity: 1,
          visibility: "visible",
          display: "flex",
          duration: 0.3,
        })
        .to(modalCardRef.current, {
          scale: 1,
          background: "rgba(255, 255, 255, 0)",
          left: "50%",
          top: "50%",
          xPercent: -50,
          yPercent: -50,
          opacity: 1,
          width: "100vw",
          height: "100vh",
          duration: 0.5,
          ease: "power3.inOut",
        });
    } else {
      tl.to(infoAreaRef.current, {
        opacity: 0,
        visibility: "hidden",
        display: "none",
        duration: 0.2,
      })
        .to(modalCardRef.current, {
          background: "transparent",
          backdropFilter: "none",
          duration: 0.2,
          scale: 0.5,
          width: "10rem",
          height: "10rem",
          borderRadius: "12px",
          ease: "power3.inOut",
        })
        .to(
          modalCardRef.current,
          {
            left: `${50}%`,
            top: `${50}%`,
            opacity: 0,
            duration: 0.3,
            ease: "power3.inOut",
          },
          "-=0.3"
        )
        .to(
          modalRef.current,
          {
            autoAlpha: 0,
            duration: 0.2,
            ease: "power2.in",
            onComplete: () => {
              if (modalRef.current) modalRef.current.style.display = "none";
            },
          },
          "-=0.2"
        );
    }

    tl.play();
    return () => tl.kill();
  }, [openCostumModel?.amimate]);

  const handleBackdropClick = () => {
    setopenCostumModel(null);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (openCostumModel) {
      setopenCostumModel((prev) =>
        prev
          ? {
              medias: prev.medias,
              activeIdx: prev.activeIdx,
              media: prev.media,
              x: openCostumModel.x,
              y: openCostumModel.y,
              amimate: false,
            }
          : null
      );
    } else {
      setopenCostumModel(
        (prev) =>
          prev && {
            media: prev?.media,
            x: 0,
            y: 0,
            amimate: false,
            medias: prev.medias,
            activeIdx: prev.activeIdx,
          }
      );
    }
  };

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 hidden opacity-0"
    >
      <div
        ref={modalCardRef}
        onClick={handleCardClick}
        className="absolute bg-white shadow-md flex justify-center items-center overflow-hidden"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          ref={infoAreaRef}
          className="flex-col relative bg-white p-3 md:p-5 rounded-xl shadow-md justify-start items-center gap-3 opacity-0 invisible hidden"
        >
          {openCostumModel?.media?.HashBlur && (
            <BlurhashCanvas
            
              hash={openCostumModel?.media.HashBlur || ""}
              className={"absolute w-full h-full top-0 left-0 rounded-md"}
            />
          )}

          <CaruselChatTapMedia
            openCostumModel={openCostumModel as unknown as any}
            setopenCostumModel={setopenCostumModel as unknown as any }
          />

          <div className="relative w-full flex md:px-[2.4rem] px-0 gap-2 justify-start items-center">
            <Button
              variant={"ghost"}
              size={"icon"}
              className="flex-1 bg-white  flex justify-center items-center h-[2rem] hover:fill-red-400"
            >
              <Heart className="w-4 h-4 text-red-400" />
              heart
            </Button>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="flex-1  bg-white flex justify-center items-center  h-[2rem] hover:fill-yellow-400"
            >
              <Star className="w-4 h-4 text-yellow-400" />
              Star
            </Button>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="flex-1 bg-white  flex justify-center items-center gap-2  h-[2rem] hover:fill-teal-400"
            >
              <Save className="w-4 h-4 text-teal-400" />
              save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoatumModel;
