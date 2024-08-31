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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogClose } from "@radix-ui/react-dialog";
import { FlipHorizontal, FlipVertical, Pencil, RotateCcwIcon, RotateCw } from "lucide-react";
import React, { SetStateAction, useMemo, useRef, useState } from "react";
import {
  Cropper,
  CropperPreview,
  CropperRef,
  FixedCropper,
  FixedCropperRef,
  ImageRestriction,
  RectangleStencil,
} from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";

interface CropperModalProps {
  imageFile: File;
  onCropComplete: (croppedImage: File) => void;
  openDialog :boolean
  setCroppedImage:  React.Dispatch<SetStateAction<File| null>>
  croppedImage:File | null
  setOpenDialog  : React.Dispatch<SetStateAction<boolean>>
}

const CropperModal: React.FC<CropperModalProps> = ({
  imageFile,
  openDialog,
  setOpenDialog,
  onCropComplete,
  setCroppedImage,
  croppedImage
  
}) => {
  const [aspectRatio, setAspectRatio] = useState<number>(1); // Default to 1:1 (Square)

  const cropperRef = useRef<FixedCropperRef>(null);
  const blobUrl = useMemo(() => {
    if (imageFile) {
      return URL.createObjectURL(imageFile).toString();
    }
    return "";
  }, [imageFile]);
  const handleCrop = () => {
    if (cropperRef && cropperRef.current) {
      const canvas = cropperRef?.current.getCanvas();
      
      canvas?.toBlob((blob) => {
        if(blob){

          const originalFile = new File([blob], blobUrl, {
            type: imageFile.type,
            lastModified: imageFile.lastModified,
          });
          setCroppedImage(originalFile);
        }
      });
      if (croppedImage) {
        onCropComplete(croppedImage);
      }
    }
  };

  const flip = (horizontal: boolean, vertical: boolean) => {
    if (cropperRef?.current) {
      cropperRef?.current.flipImage(horizontal, vertical);
    }
  };

  const rotate = (angle: number) => {
    if (cropperRef?.current) {
      cropperRef?.current.rotateImage(angle);
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
      case 1.91:
        return { width: 400, height: 209 }; // 1.91:1 (Landscape)
      default:
        return { width: 400, height: 400 }; // Default to square
    }
  };
  return (
    <Dialog
    open={openDialog}

    >
      <DialogTrigger asChild>
        <Pencil onClick={()=>setOpenDialog(true)} className="w-5 h-5" />
      </DialogTrigger>
      <DialogContent  className="overflow-hidden  ">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-white p-6 rounded-md w-full flex justify-center items-center">
          <FixedCropper
  
            stencilSize={getStencilSize()}
            
            stencilProps={{
              movable: true,
              resizable: true,
            }}
            
            ref={cropperRef}
            src={blobUrl}
            stencilComponent={RectangleStencil}
            imageRestriction={ImageRestriction.stencil}
            className="advanced-cropper 
              bg-white
              flex items-center 
              justify-center
                   w-[40rem]
          h-[25rem]
            "
          />

          <div className="flex
   
          justify-between mt-4"></div>
        </div>
        <DialogFooter>

          <div>

          <div className="flex justify-center gap-4 mt-4">
          <Button variant={"outline"} onClick={() => changeAspectRatio(1)}>
          Square 
          </Button>
          <Button variant={"outline"} onClick={() => changeAspectRatio(4 / 5)}>
          Portrait 
          </Button>
          <Button variant={"outline"} onClick={() => changeAspectRatio(16 / 9)}>
          Widescreen  
          </Button>
          <Button variant={"outline"} onClick={() => changeAspectRatio(1.91)}>
          Landscape
          </Button>
        </div>

          <DialogClose>

          <Button onClick={handleCrop} type="submit">
            Save changes
          </Button>
          </DialogClose>


          <Button variant={"outline"} onClick={() => flip(true, false)}><FlipHorizontal/></Button>
          <Button variant={"outline"} onClick={() => flip(false, true)}><FlipVertical/></Button>
          <Button variant={"outline"} onClick={() => rotate(90)}><RotateCw/></Button>
          <Button variant={"outline"} onClick={() => rotate(-90)}><RotateCcwIcon/></Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CropperModal;