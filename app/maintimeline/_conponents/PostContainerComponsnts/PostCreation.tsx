import React, { useState, useRef, useEffect, useMemo } from "react";
import { PostCreationLoader } from "./postCompoenets/Loaderes";
import { Profile, User } from "@prisma/client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icon, LoaderCircle, Rocket, Target } from "lucide-react";
import PostCreationOptions from "./postCompoenets/PostCreationOptions";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import ReactPlayer from "react-player";

import {
  FormField,
  FormItem,
} from "@/components/ui/form";
import ImageGrid from "./postCompoenets/ImageGrid";
import { useAddPostMutation } from "@/store/api/apiSlice";
import { useToast } from "@/components/ui/use-toast";
import MultiCropModel from "@/app/_componsents/crop-model/multiCrop";

interface PostContainerProps {
  user: User;
  isLoadingProfile: boolean;
  profile: Profile;
}

export type ImageWithId = {
  id: string;
  file: File;
  isCroped : boolean
};
const Schema = z
  .object({
    mainText: z.string().nullable().optional(),

    images: z
      .array(
        z
          .instanceof(File, {
            message: "Each image must be a valid file",
          })
          .refine((file) => file.type.startsWith("image/"), {
            message: "Each image must be an image file",
          })
      )
      .nullable()
      .optional(),
    video: z
      .instanceof(File, {
        message: "Video must be a valid file",
      })
      .refine((file) => file.type.startsWith("video/"), {
        message: "Video must be a video file",
      })
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      return data.mainText || data.images?.length || data.video;
    },
    {
      message: "At least one of mainText, image, or video is required.",
      path: ["mainText", "image", "video"],
    }
  );

const PostCreation = ({
  isLoadingProfile,
  profile,
  user,
}: PostContainerProps) => {

  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: {
      mainText: "",
      images: [],
      video: null,
    },
  });

  const { toast } = useToast();
  const [images, setImages] = useState<ImageWithId[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [AddPost, { isError, error, isLoading, isSuccess }] = useAddPostMutation();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [imageHolder ,setImageHolder]  = useState<ImageWithId[]>([])

  useEffect(() => {
    setImageHolder(images)
  }, [images]);

  useGSAP(() => {
    if ((images.length > 0 || video) && hasAnimated) return;
    const tl = gsap.timeline({ paused: true });
    tl.fromTo(
      ".expanded-delay",
      {
        height: "8rem",
        duration: 0.5,
      },
      {
        height: "28rem",
        duration: 1,
        delay: 0.1,
      }
    );

    // Run the animation only once when images are added for the first time
    if ((images.length > 0 || video) && !hasAnimated) {
      setHasAnimated(true);
      tl.play();
    } else {
      tl.reverse(0.5);
      setHasAnimated(false); // Reset if images are cleared
    }
  }, [images.length, video]);

  const blobUrl = useMemo(() => {
    if (video) {
      return URL.createObjectURL(video);
    }
    return "";
  }, [video]);

  const handleClick = async (
    e?: React.MouseEvent<HTMLButtonElement, MouseEvent> , imageArry? : ImageWithId[]
  ) => {
    e?.preventDefault();

    console.log(form.getValues("mainText"));
    console.log(form.getValues());
    console.log(await form.trigger());
    if (await form.trigger()) {
      if(!user?.id) return ;
      const formData = new FormData();
      formData.append("mainText", form.getValues("mainText") || "");
      formData.append("author_id", `${user?.id}` );
      if (imageArry?.length) {
        imageArry?.forEach((image) => {
          formData.append("images", image.file);
        });
      }
      if (video) {
        formData.append("video", video);
      }
      AddPost(formData).then(()=>{

        toast({
          title: "Post Uploded succesfully ",
          description: "check it now ",
          variant: "success",
        });

      }).catch((err)=>{
        toast({
          title: "Error",
          description: "At least one of mainText, image, or video is required",
          variant: "destructive",
        });
      })
      setImages([])
      setImageHolder([])
      setVideo(null)
      form.setValue("mainText" , "")

    } else {
      toast({
        title: "Error",
        description: "At least one of mainText, image, or video is required",
        variant: "destructive",
      });
    }
  };

  if (isLoadingProfile || !profile) {
    return <PostCreationLoader />;
  }

  return (
    <div className="expanded-delay bg-white rounded-xl p-4 relative gap-4 flex flex-col justify-start items-start top-0 w-full shadow-md">
      <div className="flex justify-between items-start gap-3 w-full">
        <Image
          priority={true}
          height={50}
          width={50}
          src={profile?.profile_picture || ""}
          alt="cover picture"
          className="w-10 h-10 object-cover bg-gray-300 rounded-full sm:w-14 sm:h-14"
        />
        <FormProvider {...form}>
          <form className="w-[88%] sm:w-[91%] flex-col h-auto justify-center items-center">
            <div className="flex justify-between w-full items-center">
              <FormField
                name="mainText"
                control={form.control}
                render={(field) => {
                  return (
                    <FormItem className="w-full justify-center items-center">
                      <Input
                        onChange={(e) =>
                          form.setValue("mainText", e.target.value)
                        }
                        {...field}
                        placeholder="What is happening?"
                        type="text"
                        className="mt-0 w-[97%]"
                      />
                      {/* <FormMessage /> */}
                    </FormItem>
                  );
                }}
              ></FormField>
              {images.length? 
              <MultiCropModel
              handleFinish={handleClick}
              images={images}
              CropedImages={imageHolder}
              openDialog={openDialog}
              setImageHolder={setImageHolder}

              setOpenDialog={setOpenDialog}
              />
           : 
              <Button
                disabled={isLoading}
                onClick={(e) => handleClick(e )}
                size={"icon"}
                className="w-14 h-9 flex justify-center items-center bg-gray-900"
              >
                {
                  isLoading ?
                  <LoaderCircle className="text-white animate-spin" />
                 : 
                  <Rocket className="w-6 h-6 font-light text-white" />
                }
              </Button>
            }
            </div>
              
            <PostCreationOptions
              disabled={isLoading}
              video={video}
              images={images}
              setImages={setImages}
              setVideo={setVideo}
            />
          </form>
        </FormProvider>
      </div>
      <div className="flex justify-start gap-3 items-center w-full">
        <ImageGrid
        // imageHolder={imageHolder}
        // setImageHolder={setImageHolder}
        
        setImages={setImages}
         images={imageHolder} 
        
        />
        {video && (
          <>
            <iframe
              src={blobUrl || ""}
              height={200}
              width={300}
              className="w-1/3 h-fit"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PostCreation;
