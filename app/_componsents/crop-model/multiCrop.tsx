import { ImageWithId } from "@/app/maintimeline/_conponents/PostContainerComponsnts/PostCreation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  FlipHorizontal,
  FlipVertical,
  LoaderCircle,
  Rocket,
  RotateCcwIcon,
  RotateCw,
} from "lucide-react";
import Image from "next/image";
import React, { SetStateAction, useMemo, useRef, useState } from "react";
import {
  Cropper,
  FixedCropper,
  FixedCropperRef,
  ImageRestriction,
  RectangleStencil,
} from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import "react-advanced-cropper/dist/themes/corners.css";

interface MultiCropModelProps {
  images: ImageWithId[];
  setImageHolder: React.Dispatch<SetStateAction<ImageWithId[]>>;
  openDialog: boolean;
  CropedImages: ImageWithId[];
  setOpenDialog: React.Dispatch<SetStateAction<boolean>>;
  handleFinish: (
    e?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    imageArry?: ImageWithId[]
  ) => Promise<void>;
}

const MultiCropModel: React.FC<MultiCropModelProps> = ({
  images,
  CropedImages,
  setImageHolder,
  openDialog,
  setOpenDialog,
  handleFinish,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<number>(1); // Default to 1:1 (Square)
  const cropperRef = useRef<FixedCropperRef>(null);

  const currentImage =
    currentImageIndex !== null ? images[currentImageIndex] : images[0];

  const blobUrl = useMemo(() => {
    if (currentImage) {
      return URL.createObjectURL(currentImage.file).toString();
    }
    return "";
  }, [currentImage]);

  const handleCrop = () => {
    if (cropperRef.current && currentImage) {
      const canvas = cropperRef.current.getCanvas();
      canvas?.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], currentImage.file.name, {
            type: currentImage.file.type,
            lastModified: currentImage.file.lastModified,
          });

          setImageHolder((prevImages) => {
            const updatedImages = prevImages.map((image, idx) =>
              idx === currentImageIndex
                ? { ...image, file: croppedFile, isCroped: true }
                : image
            );
            return updatedImages;
          });
            setCurrentImageIndex((prev) => prev! + 1);
         
        }
      });
    }
  };
  const handleCropSubmit = () => {
    if (cropperRef.current && currentImage) {
      const canvas = cropperRef.current.getCanvas();
      canvas?.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], currentImage.file.name, {
            type: currentImage.file.type,
            lastModified: currentImage.file.lastModified,
          });

          setImageHolder((prevImages) => {
            const updatedImages = prevImages.map((image, idx) =>
              idx === currentImageIndex
                ? { ...image, file: croppedFile, isCroped: true }
                : image
            );
            return updatedImages;
          });
          const allImagesCropped = CropedImages.every((image) => image.isCroped);
          if(allImagesCropped){
            handleFinish(undefined , CropedImages)
            setOpenDialog(false)
          }
         
        }
      });
    }
  };

  const flip = (horizontal: boolean, vertical: boolean) => {
    if (cropperRef.current) {
      cropperRef.current.flipImage(horizontal, vertical);
    }
  };

  const rotate = (angle: number) => {
    if (cropperRef.current) {
      cropperRef.current.rotateImage(angle);
    }
  };

  const changeAspectRatio = (ratio: number) => {
    setAspectRatio(ratio);
  };

  const getStencilSize = () => {
    switch (aspectRatio) {
      case 1:
        return { width: 400, height: 400 }; // 1:1 (Square)
      case 4 / 5:
        return { width: 400, height: 500 }; // 4:5 (Portrait)
      case 16 / 9:
        return { width: 600, height: 225 }; // 16:9 (Widescreen)
      case 19 / 4:
        return { width: 900, height: 400 }; // 16:9 (Widescreen)
      case 1.91:
        return { width: 400, height: 209 }; // 1.91:1 (Landscape)
      case 1.77 :
        return { width: 1920, height: 1080 }; // 1.91:1 (Landscape)
      default:
        return { width: 400, height: 400 }; // Default to square
    }
  };

  return (
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger onClick={() => setOpenDialog(true)}>
          <Button
            type="button"
            size={"icon"}
            className="w-14 h-9 flex justify-center items-center bg-gray-900"
          >
            {false ? (
              <LoaderCircle className="text-white animate-spin" />
            ) : (
              <Rocket className="w-6 h-6 font-light text-white" />
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="overflow-hidden max-w-max">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
            <DialogDescription>
              Make changes to your image here. Click save when youre done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row justify-between items-start w-fit">
            <div className="flex flex-row justify-start overflow-y-auto  h-[25rem] items-start gap-3">
              <div className=" flex-col flex  justify-center gap-4 mt-4">
                <Button variant="outline" onClick={() => changeAspectRatio(1)}>
                  Square
                </Button>
                <Button
                  variant="outline"
                  onClick={() => changeAspectRatio(4 / 5)}
                >
                  Portrait
                </Button>
                <Button
                  variant="outline"
                  onClick={() => changeAspectRatio(16 / 9)}
                >
                  Widescreen
                </Button>
                <Button
                  variant="outline"
                  onClick={() => changeAspectRatio(1.91)}
                >
                  Landscape
                </Button>
                <Button
                  variant="outline"
                  onClick={() => changeAspectRatio(19 / 4)}
                >
                  Extra Widescreen
                </Button>
                <Button
                  variant="outline"
                  onClick={() => changeAspectRatio(1.77)}
                >
                  Desktop
                </Button>
              </div>
              <div className=" flex-col flex justify-center gap-4 mt-4">
                <Button variant="outline" onClick={() => flip(true, false)}>
                  <FlipHorizontal />
                </Button>
                <Button variant="outline" onClick={() => flip(false, true)}>
                  <FlipVertical />
                </Button>
                <Button variant="outline" onClick={() => rotate(90)}>
                  <RotateCw />
                </Button>
                <Button variant="outline" onClick={() => rotate(-90)}>
                  <RotateCcwIcon />
                </Button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md w-fit flex justify-center items-center">
              <Cropper
              
                // stencilSize={getStencilSize()}
                stencilProps={{
                  movable: true,
                  resizable: true,
                  aspectRatio: aspectRatio,
                }}
                ref={cropperRef}
                src={blobUrl}
                stencilComponent={RectangleStencil}
                imageRestriction={ImageRestriction.stencil}
                className="advanced-cropper 
              bg-white
              flex items-center 
              justify-center
                   w-[25rem]
          h-[25rem]
            "
              />
            </div>
            <div className="flex flex-col overflow-y-auto  h-[25rem] py-4 justify-start items-start gap-3 mr-4">
              {images.map(({ file, id, isCroped }, idx) => {
                return (
                  <div
                    onClick={() => setCurrentImageIndex(idx)}
                    key={id}
                    className={cn(
                      "cursor-pointer shadow-md  transition-all bg-slate-100 rounded-md ",
                      idx === currentImageIndex && "border-sky-300 border-2"
                    )}
                  >
                    <Image
                      src={URL.createObjectURL(file)}
                      height={50}
                      width={50}
                      quality={100}
                      className="object-cover"
                      alt={id + "-alt"}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter className="flex flex-row justify-start items-start gap-3">
              <div className="w-full flex justify-evenly items-start gap-3">
                <Button
                  disabled={

                      !(currentImageIndex  > 0 )
                  }
                
                className="flex-1" onClick={()=>{setCurrentImageIndex(currentImageIndex - 1 )}} type="submit">
                  Back
                </Button>
                <Button
                  disabled={
                    !(currentImageIndex < images.length -1 )
                  }
                
                className="flex-1" onClick={handleCrop} type="submit">
                  Next 
                </Button>
                <Button 
                variant={"secondary"}
                disabled={
                  (currentImageIndex < images.length - 1 )
                }
                className="flex-1" onClick={()=>{
                  
                  handleCropSubmit()
                  }} type="submit">
                  Post
                </Button>
              </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MultiCropModel;
