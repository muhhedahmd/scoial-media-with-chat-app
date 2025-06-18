"use client"
import { useState, useRef, useCallback } from "react"
import type React from "react"

import type { FixedCropperRef } from "react-advanced-cropper"
import "react-advanced-cropper/dist/style.css"
import "react-advanced-cropper/dist/themes/compact.css"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import Multi from "./AdvancedCropper"
import type { initialPostData } from "./MenuPostOption"
import { Plus } from "lucide-react"

interface ImageWithId {
  id: string
  file: File
  isCropped: boolean
}

interface ImageCropUploaderProps {
  editedPost: any
  setEditedPost: React.Dispatch<React.SetStateAction<initialPostData>>
}

export default function ImageCropUploader({ editedPost, setEditedPost }: ImageCropUploaderProps) {
  const [images, setImages] = useState<ImageWithId[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const cropperRef = useRef<FixedCropperRef>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) => ({
        id: URL.createObjectURL(file),
        file,
        isCropped: false,
      }))
      setImages((prevImages) => [...prevImages, ...newImages])
      setOpenDialog(true)
    }
  }

  const handleCrop = useCallback(() => {
    if (cropperRef.current && images[currentImageIndex]) {
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
      })
    }
  }, [currentImageIndex, images])

  const handleFinish = useCallback(() => {
    handleCrop()

    const newImages = images.map((image) => ({
      id: Math.random() * 10000,
      img_path: URL.createObjectURL(image.file),
      post_id: 0,
      public_id: "public_id",
      asset_id: "asset_id",
      width: 0,
      height: 0,
      asset_folder: "folder_name",
      display_name: image.file.name,
      HashBlur: "",
      tags: {},
      type: image.file.type,
      new: true,
      img_file: image.file,
    }))

    setEditedPost((prev) => ({
      ...prev,
      images: prev.images ? [...newImages, ...prev.images] : newImages,
    }))

    setOpenDialog(false)
    setImages([])
    setCurrentImageIndex(0)
  }, [images, setEditedPost, handleCrop])

  return (
    <div className="flex justify-center items-center relative">
      <Label
        className="flex justify-center items-center cursor-pointer w-full transition-all hover:bg-gray-100 rounded-md"
        htmlFor="imageUploadEdit"
      >
        <Plus className="w-4 h-4 mt-1" />
      </Label>
      <Input
        type="file"
        id="imageUploadEdit"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
      <Multi
        editedPost={editedPost}
        cropperRef={cropperRef}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        handleFinish={handleFinish}
        images={images}
        openDialog={openDialog}
        // setEditedPost={setEditedPost}
        setImages={setImages}
        setOpenDialog={setOpenDialog}
      />
    </div>
  )
}
