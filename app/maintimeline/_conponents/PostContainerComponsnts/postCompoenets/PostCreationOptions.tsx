"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon, Image, LocateFixedIcon, Video, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { ImageWithId } from "../PostCreation";
import { cn } from "@/lib/utils";

interface PostCreationOptionsProps {
  setImages: React.Dispatch<React.SetStateAction<ImageWithId[] >>;
  setVideo: React.Dispatch<React.SetStateAction<File | null>>;
  images: ImageWithId[];
  video: File | null;
  disabled: boolean
}

const PostCreationOptions = ({
  disabled,
  images,
  setImages,
  setVideo,
  video,
}: PostCreationOptionsProps) => {
  const { register, setValue, getValues, control } = useFormContext(); // retrieve hook methods
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`Latitude: ${latitude}, Longitude: ${longitude}`);
        setValue("location", { latitude, longitude }); // Set form location value
        setLoading(false);
      },
      (error) => {
        alert(`Error getting location: ${error.message}`);
        setLoading(false);
      }
    );
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files).map((file) => ({
        id: crypto.randomUUID(), // Generate a unique ID for each image
        file,
        isCroped : false
      }));

      setImages((prev) => [...prev, ...selectedFiles]);

      // Update form value with the newly added files
      setValue("images", [
        ...getValues("images"),
        ...selectedFiles.map((item) => item.file),
      ]);
    }
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log({ getValues: getValues() });
    if (event.target.files && event.target.files[0]) {
      setVideo(event.target.files[0]);
      setValue("video", event.target.files[0]);
    }
  };

  useEffect(() => {
    const imagesFiles = images.map((a) => a.file);
    setValue("images", imagesFiles);
  }, [images, setValue]);

  const clearImages = () => {
    setImages([]);
    setValue("images", []);
  };
  const clearVideo = () => {
    setVideo(null);
    setValue("video", []);
  };

  return (
    <div 
    className={cn("flex  justify-start items-center gap-3 mt-3 w-full" , disabled && "opacity-55 text-muted-foreground cursor-pointer pointer-events-none")}>
      {/* Image Upload */}
      <div className="w-1/6 flex justify-center items-center relative">
        {images.length > 0 && (
          <div
            onClick={() => clearImages()}
            className="relative w-fit  flex justify-center items-center cursor-pointer p-2 hover:bg-gray-100 rounded-md"
          >
            <Image className="h-6 w-6" />
            <X className="w-4 h-4 absolute left-1/2 top-4 bg-white text-red-600" />
          </div>
        )}
        <Label
        
          className="flex justify-center items-center cursor-pointer p-2 hover:bg-gray-100 rounded-md"
          htmlFor="imageUpload"
        >
          <Image className="h-6 w-6" />
        </Label>
        <Input
          type="file"
          id="imageUpload"
          multiple
          accept="image/*"
          className="hidden"
          // disabled={images.length > 0}
          {...register("images")}
          onChange={handleImageChange}
        />

        {/* Image Preview */}
      </div>

      {/* Video Upload */}
      <div className="w-1/6 flex justify-center items-center relative">
      {video  && (
          <div
            onClick={() => clearVideo()}
            className="relative w-fit  flex justify-center items-center cursor-pointer p-2 hover:bg-gray-100 rounded-md"
          >
            <Video className="h-6 w-6" />
            <X className="w-4 h-4 absolute left-1/2 top-4 bg-white text-red-600" />
          </div>
        )}
        <Label
          className="flex justify-center items-center cursor-pointer p-2 hover:bg-gray-100 rounded-md"
          htmlFor="videoUpload"
        >
          <Video className="h-6 w-6" />
        </Label>
        <Input
          type="file"
          id="videoUpload"
          accept="video/*"
          className="hidden"
          {...register("video")}
          onChange={handleVideoChange}
        />
      </div>

      {/* Location Sharing */}
      <div className="w-1/6">
        <Button
          type="button"
          className="w-full flex justify-center items-center"
          variant={"ghost"}
          onClick={handleGetLocation}
        >
          {loading ? (
            <span>Loading...</span>
          ) : (
            <LocateFixedIcon className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Displaying the Location (Optional) */}
      {location && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">Location: {location}</p>
        </div>
      )}
    </div>
  );
};

export default PostCreationOptions;
