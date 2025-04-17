import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { FlipHorizontal, FlipVertical, Pencil, RotateCcwIcon, RotateCw } from "lucide-react";
import React, { SetStateAction, useMemo, useRef, useState } from "react";
import {
  FixedCropper,
  FixedCropperRef,
  ImageRestriction,
  RectangleStencil,
} from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";

interface CropperModalProps {

  imageFile: File | null;
  onCropComplete: (croppedImage: File) => void;
  openDialog: boolean;
  setCroppedImage: React.Dispatch<SetStateAction<File | null>>;
  croppedImage: File | null;
  setOpenDialog: React.Dispatch<SetStateAction<boolean>>;
  cover?: boolean
  profile?: boolean
}

const CropperModal: React.FC<CropperModalProps> = ({
  imageFile,
  openDialog,
  setOpenDialog,
  onCropComplete,
  setCroppedImage,
  croppedImage,
  cover,
  profile
}) => {
  const [aspectRatio, setAspectRatio] = useState<number>(1); // Default to 1:1 (Square)
  const cropperRef = useRef<FixedCropperRef>(null);

  // Generate a blob URL for the image file
  const blobUrl = useMemo(() => {
    if (imageFile) {
      return URL.createObjectURL(imageFile).toString();
    }
    return "";
  }, [imageFile]);

  // Handle the crop action
  const handleCrop = () => {
    if (!imageFile) return
    if (cropperRef && cropperRef.current) {
      const canvas = cropperRef?.current.getCanvas();
      canvas?.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], imageFile.name, {
            type: imageFile.type,
            lastModified: imageFile.lastModified,
          });
          setCroppedImage(croppedFile);
          onCropComplete(croppedFile);
          setOpenDialog(false);
        }
      });
    }
  };

  // Flip the image horizontally or vertically
  const flip = (horizontal: boolean, vertical: boolean) => {
    if (cropperRef?.current) {
      cropperRef?.current.flipImage(horizontal, vertical);
    }
  };

  // Rotate the image by a specific angle
  const rotate = (angle: number) => {
    if (cropperRef?.current) {
      cropperRef?.current.rotateImage(angle);
    }
  };

  // Change the aspect ratio of the cropper
  const changeAspectRatio = (ratio: number) => {
    setAspectRatio(ratio);
  };

  // Get the stencil size based on the selected aspect ratio
  const getStencilSize = () => {
    switch (aspectRatio) {
      case 1:
        return { width: 300, height: 300 }; // 1:1 (Square)
      case 4 / 5:
        return { width: 240, height: 300 }; // 4:5 (Portrait)
      case 16 / 9:
        return { width: 400, height: 225 }; // 16:9 (Widescreen)
      case 1.91:
        return { width: 400, height: 209 }; // 1.91:1 (Landscape)
      default:
        return { width: 300, height: 300 }; // Default to square
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      {/* <DialogTrigger asChild>
        <Pencil onClick={() => setOpenDialog(true)} className="w-5 h-5 cursor-pointer" />
      </DialogTrigger> */}
      <DialogContent className="max-w-[95vw] sm:max-w-3xl">
        <DialogHeader className="text-left">
          <DialogTitle>Edit Image</DialogTitle>
          <DialogDescription>
            Crop and adjust your image. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        {/* Cropper Container */}
        <div
          className="md:w-[45rem] lg:50rem w-full flex flex-col justify-start items-center overflow-hidden"
        >

          <div className="sm:w-full h-[60vh] sm:h-[50vh]  w-[38rem] flex justify-center items-center">
            <FixedCropper
              ref={cropperRef}

              src={blobUrl}
              stencilComponent={RectangleStencil}
              stencilSize={getStencilSize()}
              stencilProps={{
                movable: true,
                resizable: true,
              }}
              imageRestriction={ImageRestriction.stencil}
              className="advanced-cropper w-full h-full"
            />
          </div>

          {/* Aspect Ratio Buttons */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">

            {
              !cover &&
              <>
                <Button variant="outline" onClick={() => changeAspectRatio(1)}>
                  Square (1:1)
                </Button>
                <Button variant="outline" onClick={() => changeAspectRatio(4 / 5)}>
                  Portrait (4:5)
                </Button>
              </>
            }

            {
              !profile &&
              <>
                <Button variant="outline" onClick={() => changeAspectRatio(16 / 9)}>

                  Widescreen (16:9)
                </Button>
                <Button variant="outline" onClick={() => changeAspectRatio(1.91)}>
                  Landscape (1.91:1)
                </Button>
              </>

            }
          </div>

          {/* Action Buttons */}
          <DialogFooter className="flex flex-col sm:flex-row gap-4 sm:gap-2 mt-4">
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => flip(true, false)}>
                <FlipHorizontal className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={() => flip(false, true)}>
                <FlipVertical className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={() => rotate(90)}>
                <RotateCw className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={() => rotate(-90)}>
                <RotateCcwIcon className="w-4 h-4" />
              </Button>
            </div>

            <DialogClose asChild>
              <Button onClick={handleCrop} className="w-full sm:w-auto">
                Save Changes
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default CropperModal;