"use client"

import type React from "react"
import { useCallback, useState, type RefObject, type Dispatch, type SetStateAction } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Slider } from "@/components/ui/slider"
import { Cropper, ImageRestriction, RectangleStencil, type CropperRef } from "react-advanced-cropper"
import {
  FlipHorizontal,
  FlipVertical,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
  X,
  Loader2,
  ImageIcon,
  Check,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import "react-advanced-cropper/dist/style.css"
import { Button } from "@/components/ui/button"
import type { initialPostData } from "./MenuPostOption"

interface ImageWithId {
  id: string
  file: File
  isCropped: boolean
}

interface MultiProps {
  cropperRef: RefObject<CropperRef>
  images: ImageWithId[]
  currentImageIndex: number
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>
  openDialog: boolean
  setOpenDialog: (open: boolean) => void
  setImages: Dispatch<SetStateAction<ImageWithId[]>>
  handleFinish: () => void
  editedPost: initialPostData
}

export default function Component({
  editedPost,
  cropperRef,
  images,
  currentImageIndex,
  setCurrentImageIndex,
  openDialog,
  setOpenDialog,
  setImages,
  handleFinish,
}: MultiProps) {
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined)
  const [showAlertDialog, setShowAlertDialog] = useState(false)
  const [zoom, setZoom] = useState(0)
  const [rotation, setRotation] = useState(0)

  const handleClose = useCallback(() => {
    if (images.length > 0) {
      setShowAlertDialog(true)
    } else {
      setOpenDialog(false)
    }
  }, [images, setOpenDialog])

  const confirmClose = useCallback(() => {
    setImages([])
    setOpenDialog(false)
    setShowAlertDialog(false)
  }, [setImages, setOpenDialog])

  const cancelClose = useCallback(() => {
    setShowAlertDialog(false)
  }, [])

  const [loadingStates, setLoadingStates] = useState(Array(images.length).fill(false))
  const handleCrop = useCallback(() => {
    if (cropperRef.current && images[currentImageIndex]) {
      // Set loading state for the current image
      setLoadingStates((prev) => {
        const newLoadingStates = [...prev]
        newLoadingStates[currentImageIndex] = true // Set loading for the current image
        return newLoadingStates
      })

      const canvas = cropperRef.current.getCanvas()
      canvas?.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], images[currentImageIndex].file.name, {
            type: images[currentImageIndex].file.type,
            lastModified: images[currentImageIndex].file.lastModified,
          })

          setImages((prevImages) =>
            prevImages.map((image, idx) =>
              idx === currentImageIndex ? { ...image, file: croppedFile, isCropped: true } : image,
            ),
          )

          if (currentImageIndex < images.length - 1) {
            setCurrentImageIndex((prev) => prev + 1)
          }
        }

        // Reset loading state for the current image
        setLoadingStates((prev) => {
          const newLoadingStates = [...prev]
          newLoadingStates[currentImageIndex] = false // Reset loading for the current image
          return newLoadingStates
        })
      })
    }
  }, [cropperRef, currentImageIndex, images, setCurrentImageIndex, setImages])

  const flip = useCallback(
    (horizontal: boolean, vertical: boolean) => {
      if (cropperRef.current) {
        cropperRef.current.flipImage(horizontal, vertical)
      }
    },
    [cropperRef],
  )

  const rotate = useCallback(
    (angle: number) => {
      if (cropperRef.current) {
        cropperRef.current.rotateImage(angle)
        setRotation((prev) => (prev + angle) % 360)
      }
    },
    [cropperRef],
  )

  const changeAspectRatio = useCallback((ratio: number | undefined) => {
    setAspectRatio(ratio)
  }, [])

  const onZoom = useCallback(
    (value: number) => {
      if (cropperRef.current) {
        cropperRef.current.zoomImage(value / 100)
        setZoom(value)
      }
    },
    [cropperRef],
  )

  const resetTransforms = useCallback(() => {
    if (cropperRef.current) {
      cropperRef.current.reset()
      setZoom(0)
      setRotation(0)
    }
  }, [cropperRef])

  return (
    <>
      <Dialog open={openDialog} onOpenChange={handleClose}>
        <DialogContent className="max-w-[95vw] w-full h-[90vh] flex flex-col justify-start items-center sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[1024px]">
          <DialogHeader className="w-full">
            <DialogTitle className="flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-emerald-600" />
              Edit Image {currentImageIndex + 1} of {images.length}
            </DialogTitle>
            <DialogDescription>Make changes to your image here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col w-full h-full overflow-hidden">
            <div className="flex-grow flex justify-center items-center overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-lg">
              {images[currentImageIndex] && (
                <Cropper
                  ref={cropperRef}
                  src={images[currentImageIndex].id}
                  className="max-h-[calc(100vh-500px)] max-w-full"
                  imageRestriction={ImageRestriction.fitArea}
                  stencilProps={{
                    movable: true,
                    resizable: true,
                    aspectRatio: aspectRatio,
                  }}
                  stencilComponent={RectangleStencil}
                />
              )}
            </div>
            <div className="flex overflow-x-auto py-4 gap-3 mt-4">
              {images.map(({ file, id, isCropped }, idx) => (
                <div
                  onClick={() => setCurrentImageIndex(idx)}
                  key={id}
                  className={cn(
                    "relative cursor-pointer shadow-md transition-all rounded-md flex-shrink-0 focus:outline-none",
                    idx === currentImageIndex
                      ? "ring-2 ring-emerald-600 dark:ring-emerald-400"
                      : "hover:ring-1 hover:ring-emerald-400",
                    isCropped && "ring-1 ring-emerald-300 dark:ring-emerald-700",
                  )}
                  aria-label={`Select image ${idx + 1}`}
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-md">
                    <Image
                      src={URL.createObjectURL(file) || "/placeholder.svg"}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    {isCropped && (
                      <div className="absolute bottom-0 right-0 bg-emerald-500 rounded-tl-md p-0.5">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <Button
                    className="absolute -top-2 -right-2 p-0 h-5 w-5 rounded-full bg-red-500 hover:bg-red-600"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (images) {
                        setImages((prev) => prev.filter((img) => img.id !== id))
                        setImages((prevImages) => {
                          if (prevImages.length <= 1) {
                            setOpenDialog(false)
                          }
                          return prevImages
                        })
                      }
                    }}
                  >
                    <X className="w-3 h-3 text-white" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full mt-4 space-y-4">
            <div className="flex items-center space-x-2">
              <ZoomOut className="w-5 h-5 text-gray-500" />
              <Slider
                value={[zoom]}
                onValueChange={(value) => onZoom(value[0])}
                max={100}
                step={1}
                className="flex-grow"
              />
              <ZoomIn className="w-5 h-5 text-gray-500" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button variant="outline" size="sm" onClick={() => flip(true, false)} className="flex items-center">
                <FlipHorizontal className="w-4 h-4 mr-2" /> Flip H
              </Button>
              <Button variant="outline" size="sm" onClick={() => flip(false, true)} className="flex items-center">
                <FlipVertical className="w-4 h-4 mr-2" /> Flip V
              </Button>
              <Button variant="outline" size="sm" onClick={() => rotate(-90)} className="flex items-center">
                <RotateCcw className="w-4 h-4 mr-2" /> Rotate L
              </Button>
              <Button variant="outline" size="sm" onClick={() => rotate(90)} className="flex items-center">
                <RotateCw className="w-4 h-4 mr-2" /> Rotate R
              </Button>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Aspect Ratio</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={aspectRatio === 1 ? "default" : "outline"}
                  onClick={() => changeAspectRatio(1)}
                  className={cn(
                    aspectRatio === 1
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "hover:border-emerald-600 hover:text-emerald-600",
                  )}
                >
                  1:1
                </Button>
                <Button
                  size="sm"
                  variant={aspectRatio === 4 / 5 ? "default" : "outline"}
                  onClick={() => changeAspectRatio(4 / 5)}
                  className={cn(
                    aspectRatio === 4 / 5
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "hover:border-emerald-600 hover:text-emerald-600",
                  )}
                >
                  4:5
                </Button>
                <Button
                  size="sm"
                  variant={aspectRatio === 16 / 9 ? "default" : "outline"}
                  onClick={() => changeAspectRatio(16 / 9)}
                  className={cn(
                    aspectRatio === 16 / 9
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "hover:border-emerald-600 hover:text-emerald-600",
                  )}
                >
                  16:9
                </Button>
                <Button
                  size="sm"
                  variant={aspectRatio === undefined ? "default" : "outline"}
                  onClick={() => changeAspectRatio(undefined)}
                  className={cn(
                    aspectRatio === undefined
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "hover:border-emerald-600 hover:text-emerald-600",
                  )}
                >
                  Free
                </Button>
                <Button size="sm" variant="outline" onClick={resetTransforms} className="ml-auto">
                  <Move className="w-4 h-4 mr-2" /> Reset
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div>Rotation: {rotation}°</div>
              <div>Zoom: {zoom}%</div>
            </div>
            <div className="flex justify-end gap-2 items-center w-full">
              <Button
                variant="outline"
                disabled={currentImageIndex === 0}
                onClick={() => setCurrentImageIndex((prev) => prev - 1)}
              >
                Previous
              </Button>
              <Button
                disabled={currentImageIndex === images.length}
                onClick={handleCrop}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {loadingStates[currentImageIndex] ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : currentImageIndex === images.length - 1 ? (
                  "Crop"
                ) : (
                  "Crop & Next"
                )}
              </Button>
              <Button
                disabled={!images.every((img) => img.isCropped)}
                variant="default"
                onClick={handleFinish}
                className={cn(
                  "bg-emerald-700 hover:bg-emerald-800",
                  !images.every((img) => img.isCropped) && "opacity-50 cursor-not-allowed",
                )}
              >
                Finish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Closing this dialog will discard all images and changes. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelClose}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClose} className="bg-red-500 hover:bg-red-600 text-white">
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
