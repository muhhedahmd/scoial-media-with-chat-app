

"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageIcon, Video, Smile, X, Rocket, LoaderCircle } from "lucide-react";
import { useAddPostMutation } from "@/store/api/apiSlice";
import { toast } from "@/components/ui/use-toast";
import type { Profile, User } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTheme } from "next-themes";
import LocationSearch from "@/app/_components/locationComp/locationComp";
import MentionInput, { parserData } from "@/app/_components/mentionComp/MentionDropDown";
import MultiCropModel from "@/app/_components/crop-model/multiCrop";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ProfileWithPic } from "@/Types";
import BlurredImage from "@/app/_components/ImageWithPlaceholder";

interface PostCreationProps {
  isLoadingProfile: boolean;
  profile: ProfileWithPic;
  user: User;
  isScrolled: boolean;
}

export type ImageWithId = {
  id: string;
  file: File;
  isCroped: boolean;
};

const formSchema = z.object({
  text: z.string().nullable().optional(),
  images: z.array(z.any()).optional(),
  video: z.any().optional(),
  location: z.any().optional(),
}).refine(
  (data) => data.text || data.images?.length || data.video,
  {
    message: "At least one of text, images, or video is required",
    path: ["text"]
  }
);

const PostCreation = ({ isLoadingProfile, profile, user, isScrolled }: PostCreationProps) => {
  const [images, setImages] = useState<ImageWithId[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [activeLocation, setActiveLocation] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addPost] = useAddPostMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [imageHolder, setImageHolder] = useState<ImageWithId[]>([]);
  const [parsedData, setParsedData] = useState<parserData>();
  const [inputValue, setInputValue] = useState<string>("");

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      images: [],
      video: null,
      location: null,
    },
  });

  const { register, handleSubmit, reset, setValue, watch } = methods;
  const text = watch("text");

  useEffect(() => {
    setImageHolder(images);
  }, [images]);

  useEffect(() => {
    setValue("text", inputValue);
  }, [inputValue, setValue]);

  const blobUrl = useMemo(() => {
    if (video) {
      return URL.createObjectURL(video);
    }
    return "";
  }, [video]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("mainText", data.text || "");
      formData.append("parsedData", JSON.stringify(parsedData));
      formData.append("author_id", `${user.id}`);

      if (images.length > 0) {
        images.forEach((image) => {
          formData.append("images", image.file);
        });
      }

      if (video) {
        formData.append("video", video);
      }

      if (activeLocation) {
        formData.append("locationId", activeLocation.toString());
      }

      await addPost(formData).unwrap();

      toast({
        title: "Success!",
        description: "Your post has been published.",
        variant: "default",
      });

      reset();
      setImages([]);
      setVideo(null);
      setActiveLocation(null);
      setInputValue("");
      setParsedData(undefined);
    } catch (error) {
      console.error("Failed to create post:", error);
      toast({
        title: "Error",
        description: "Failed to create your post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) => ({
        id: crypto.randomUUID(),
        file,
        isCroped: false,
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const removeVideo = () => {
    setVideo(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setInputValue((prev) => (prev || "") + emoji.native);
  };

  if (isLoadingProfile || !profile) {
    return <div className="h-40 w-full bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>;
  }

  if (isScrolled) return null;

  const pPic = profile?.profilePictures.find((item)=>item.type === "profile")
  return (
    <FormProvider {...methods}>
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-xl p-4 w-full shadow-md"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="flex space-x-3">
            {/* User Avatar */}
            {profile?.profilePictures.find((item)=>item.type === "profile") ? (
              <BlurredImage
                imageUrl={pPic?.secure_url ||""}
                alt={`${user.first_name} ${user.last_name}`}
                width={40}
                height={40}
                blurhash={pPic?.HashBlur || ""}
                quality={100}
                className="rounded-full h-10 w-10 object-cover"
              />
            ) : (
              <Avatar className="h-10 w-10">
                <AvatarFallback>{user.first_name?.charAt(0)}</AvatarFallback>
              </Avatar>
            )}

            {/* Post Content */}
            <div className="flex-1">
              <MentionInput
                inputValue={inputValue}
                setInputValue={setInputValue}
                parsedData={parsedData}
                setParsedData={setParsedData}
                className=""
                
                placeholder={`What's on your mind, ${user.first_name}?`}
              />

              {/* Media Preview */}
              <AnimatePresence>
                {(images.length > 0 || video) && (
                  <motion.div
                    className="mt-3 space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {/* Image Previews */}
                    {images.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {images.map((image) => (
                          <div key={image.id} className="relative group">
                            <Image
                              width={200}
                              height={200}
                              
                              src={URL.createObjectURL(image.file)}
                              alt="Preview"
                              className="h-20 w-20 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(image.id)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Video Preview */}
                    {video && (
                      <div className="relative group inline-block">
                        <video src={blobUrl} className="h-20 rounded-md" controls />
                        <button
                          type="button"
                          onClick={removeVideo}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Post Actions */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="h-5 w-5 mr-1" />
                    <span className="sr-only md:not-sr-only md:inline-block">Photo</span>
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <Video className="h-5 w-5 mr-1" />
                    <span className="sr-only md:not-sr-only md:inline-block">Video</span>
                  </Button>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoUpload}
                  />

                  <LocationSearch 
                    activeLocation={activeLocation} 
                    setActiveLocation={setActiveLocation} 
                  />

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Smile className="h-5 w-5 mr-1" />
                        <span className="sr-only md:not-sr-only md:inline-block">Emoji</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 border-none" align="start">
                      <Picker
                        data={data}
                        onEmojiSelect={handleEmojiSelect}
                        theme={theme === "dark" ? "dark" : "light"}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || (!text && images.length === 0 && !video)}
                  className="bg-emerald-600  hover:bg-emerald-700 text-white"
                  size="sm"
                >
                  {isSubmitting ? (
                    <LoaderCircle className="animate-spin mr-2" size={16} />
                  ) : (
                    <Rocket className="mr-2" size={16} />
                  )}
                  Post
                </Button>
              </div>

              <MultiCropModel
                setImages={setImages}
                handleFinish={(e) => {
                  e?.preventDefault();
                  handleSubmit(onSubmit)();
                }}
                images={images}
                CropedImages={imageHolder}
                openDialog={openDialog}
                setImageHolder={setImageHolder}
                setOpenDialog={setOpenDialog}
              />
            </div>
          </div>
        </form>
      </motion.div>
    </FormProvider>
  );
};

export default PostCreation;