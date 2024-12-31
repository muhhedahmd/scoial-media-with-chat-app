'use client'

import { useState, useRef, useMemo, useCallback, SetStateAction } from 'react'
import Image from 'next/image'
import { Cropper, FixedCropper, FixedCropperRef, ImageRestriction, RectangleStencil } from 'react-advanced-cropper'
import 'react-advanced-cropper/dist/style.css'
import 'react-advanced-cropper/dist/themes/corners.css'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { cn } from '@/lib/utils'
import { FlipHorizontal, FlipVertical, Rocket, RotateCcw, RotateCw, Settings } from 'lucide-react'

interface ImageWithId {
  file: File
  id: string
  isCroped: boolean
}

interface MultiCropModelProps {
  images: ImageWithId[]
  setImageHolder: React.Dispatch<React.SetStateAction<ImageWithId[]>>
  openDialog: boolean
  CropedImages: ImageWithId[];
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
  setImages : React.Dispatch<React.SetStateAction<ImageWithId[]>> 
  handleFinish: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>, imageArray?: ImageWithId[]) => void
}

export default function Component({ images , openDialog, setOpenDialog ,  handleFinish , setImages}: MultiCropModelProps ) {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined)
  const cropperRef = useRef<FixedCropperRef>(null)

  const currentImage = images[currentImageIndex] || images[0]


  const handleCrop = useCallback(() => {
    if (cropperRef.current && images[currentImageIndex]) {
      const canvas = cropperRef.current.getCanvas();
      canvas?.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], images[currentImageIndex].file.name, {
            type: images[currentImageIndex].file.type,
            lastModified: images[currentImageIndex].file.lastModified,
          });

          setImages(prevImages => prevImages.map((image, idx) =>
            idx === currentImageIndex
              ? { ...image, file: croppedFile, isCropped: true }
              : image
          ));

          if (currentImageIndex < images.length - 1) {
            setCurrentImageIndex(prev => prev + 1);
          }
        }
      });
    }
  }, [currentImageIndex, images, setImages]);




  // const handleCropSubmit = () => {
  //   if (cropperRef.current && currentImage) {
  //     const canvas = cropperRef.current.getCanvas();
  //     canvas?.toBlob((blob) => {
  //       if (blob) {
  //         const croppedFile = new File([blob], currentImage.file.name, {
  //           type: currentImage.file.type,
  //           lastModified: currentImage.file.lastModified,
  //         });

  //         setImageHolder((prevImages) => {
  //           const updatedImages = prevImages.map((image, idx) =>
  //             idx === currentImageIndex
  //               ? { ...image, file: croppedFile, isCroped: true }
  //               : image
  //           );
  //           return updatedImages;
  //         });
  //         const allImagesCropped = CropedImages.every((image) => image.isCroped);
  //         if(allImagesCropped){
  //           handleFinish(undefined , CropedImages)
  //           setOpenDialog(false)
  //         }
         
  //       }
  //     });
  //   }
  // };

  const flip = useCallback((horizontal: boolean, vertical: boolean) => {
    if (cropperRef.current) {
      cropperRef.current.flipImage(horizontal, vertical)
    }
  }, [])

  const rotate = useCallback((angle: number) => {
    if (cropperRef.current) {
      cropperRef.current.rotateImage(angle)
    }
  }, [])

  const changeAspectRatio = useCallback((ratio: number | undefined) => {
    setAspectRatio(ratio)
    if (cropperRef.current) {
      // cropperRef.current?.setAspectRatio(ratio)
    }
  }, [])

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
    <DialogContent className="max-w-[95vw] max-h-[80vh] overflow-hidden w-full sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[1024px]">
      <DialogHeader>
        <DialogTitle>Edit Image {currentImageIndex + 1} of {images.length}</DialogTitle>
        <DialogDescription>
          Make changes to your image here. Click save when youre done.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col h-[calc(60vh-10rem)] overflow-hidden">
        <div className="flex justify-between items-center mb-2">
          <div className='flex flex-col justify-start gap-2'>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => flip(true, false)} aria-label="Flip Horizontal">
                <FlipHorizontal className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => flip(false, true)} aria-label="Flip Vertical">
                <FlipVertical className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => rotate(90)} aria-label="Rotate Clockwise">
                <RotateCw className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => rotate(-90)} aria-label="Rotate Counter-Clockwise">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => changeAspectRatio(1)}>Square</Button>
              <Button variant="ghost" onClick={() => changeAspectRatio(4/5)}>Portrait</Button>
              <Button variant="ghost" onClick={() => changeAspectRatio(1.91)}>Landscape</Button>
              <Button variant="ghost" onClick={() => changeAspectRatio(undefined)}>Free</Button>
            </div>
          </div>
        </div>
        <div className="flex-grow overflow-hidden">
          {images[currentImageIndex] && (
            <FixedCropper
              stencilSize={{
                height: 400,
                width: 400
              }}
              stencilProps={{
                movable: true,
                resizable: true,
                aspectRatio: aspectRatio,
              }}
              ref={cropperRef}
              src={images[currentImageIndex].id}
              stencilComponent={RectangleStencil}
              imageRestriction={ImageRestriction.stencil}
              className="w-full h-full max-h-[calc(80vh-16rem)]"
            />
          )}
        </div>
        <div className="flex overflow-x-auto py-2 gap-2 mt-2">
          {images.map(({ file, id, isCroped }, idx) => (
            <button
              onClick={() => setCurrentImageIndex(idx)}
              key={id}
              className={cn(
                "cursor-pointer shadow-md transition-all bg-slate-100 rounded-md flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500",
                idx === currentImageIndex && "border-sky-300 border-2"
              )}
              aria-label={`Select image ${idx + 1}`}
            >
              <Image
                src={URL.createObjectURL(file)}
                height={40}
                width={40}
                quality={100}
                className="object-cover rounded-md"
                alt={`Thumbnail ${idx + 1}`}
              />
            </button>
          ))}
        </div>
      </div>
      <DialogFooter className="flex justify-between w-full items-center gap-3 mt-4">
        <Button
          disabled={currentImageIndex === 0}
          onClick={() => setCurrentImageIndex(prev => prev - 1)}
        >
          Back
        </Button>
        <Button
          disabled={currentImageIndex === images.length - 1}
          onClick={handleCrop}
        >
          Next
        </Button>
        <Button
        disabled={
         true
        }
          variant="secondary"
          onClick={()=>{
            handleCrop()
           return handleFinish
          }}
        >
          Post
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}

