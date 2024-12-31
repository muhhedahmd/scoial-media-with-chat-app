"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { PostCreationLoader } from "../maintimeline/_conponents/PostContainerComponsnts/postCompoenets/Loaderes";
import { Profile, User } from "@prisma/client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Rocket, User2 } from "lucide-react";
import PostCreationOptions from "../maintimeline/_conponents/PostContainerComponsnts/postCompoenets/PostCreationOptions";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import ImageGrid from "../maintimeline/_conponents/PostContainerComponsnts/postCompoenets/ImageGrid";
import { useAddPostMutation } from "@/store/api/apiSlice";
import { useToast } from "@/components/ui/use-toast";
import MultiCropModel from "@/app/_components/crop-model/multiCrop";
import MentionInput, {
  parserData,
} from "@/app/_components/mentionComp/MentionDropDown";
import { AnimatePresence, motion } from "framer-motion";

interface PostContainerProps {
  user: User;
  isLoadingProfile: boolean;
  profile: Profile;
  isScrolled: boolean;
}

export type ImageWithId = {
  id: string;
  file: File;
  isCroped: boolean;
};
const Schema = z
  .object({
    Text: z.string().nullable().optional(),
    images:
      typeof window !== "undefined"
        ? z
            .array(
              z
                .instanceof(File, {
                  message: "Each image must be a valid file",
                })
                .refine(
                  (file) =>
                    typeof window !== "undefined"
                      ? file.type.startsWith("image/")
                      : true,

                  {
                    message: "Each image must be an image file",
                  }
                )
            )
            .nullable()
            .optional()
        : z.any().nullable().optional(),
    video:
      typeof window !== "undefined"
        ? z
            .instanceof(File, {
              message: "Video must be a valid file",
            })
            .refine(
              (file) =>
                typeof window !== "undefined"
                  ? file.type.startsWith("video/")
                  : true,
              {
                message: "Video must be a video file",
              }
            )
            .nullable()
            .optional()
        : z.any().nullable().optional(),
  })
  .refine(
    (data) => {
      return data.Text || data.images?.length || data.video;
    },
    {
      message: "At least one of mainText, image, or video is required.",
      path: ["mainText", "image", "video"],
    }
  );

const PostCreation = ({
  isLoadingProfile,
  isScrolled,
  profile,
  user,
}: PostContainerProps) => {
  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: {
      Text: "",
      images: [],
      video: null,
    },
  });

  const { toast } = useToast();
  const [images, setImages] = useState<ImageWithId[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [AddPost, { isError, error, isLoading, isSuccess }] =
    useAddPostMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const [imageHolder, setImageHolder] = useState<ImageWithId[]>([]);
  const [parsedData, setParsedData] = useState<parserData>();
  const [inputValue, setInputValue] = useState<string>("");
  const [activeLocation, setActiveLocation] = useState<number | null>(null);

  useEffect(() => {
    setImageHolder(images);
  }, [images]);

  useEffect(() => {
    form.setValue("Text", inputValue);
  }, [form, inputValue]);

  const blobUrl = useMemo(() => {
    if (video) {
      return URL.createObjectURL(video);
    }
    return "";
  }, [video]);

  const handleClick = async (
    e?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    imageArry?: ImageWithId[]
  ) => {
    e?.preventDefault();

    if (await form.trigger()) {
      if (!user?.id) return;
      const formData = new FormData();
      formData.append("mainText", form.getValues("Text") || "");
      formData.append("parsedData", JSON.stringify(parsedData));
      formData.append("author_id", `${user?.id}`);
      if (activeLocation)
        formData.append("activeLocation", `${activeLocation}`);

      if (imageArry?.length) {
        imageArry?.forEach((image) => {
          formData.append("images", image.file);
        });
      }
      if (video) {
        formData.append("video", video);
      }
      AddPost(formData)
        .then((res) => {
          console.log({ res });
          toast({
            title: "Post Uploded succesfully ",
            description: "check it now ",
            variant: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: "Error",
            description:
              "At least one of mainText, image, or video is required",
            variant: "destructive",
          });
        });
      setImages([]);
      setImageHolder([]);
      setVideo(null);
      setInputValue("");

      setActiveLocation(null);
      form.setValue("Text", "");
      form.setValue("images", null);
      form.setValue("video", null);

      console.log({
        vals: form.getValues(),
        parsedData: parsedData,
      });
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
  if(isScrolled) return <></>
  return (<motion.div
      className="expanded-delay h-auto bg-white rounded-xl p-4 relative gap-4 flex flex-col justify-start items-start top-0 w-full shadow-md"
      style={{
        height: "auto",
        transition: ".3s",
      }}
    >
      <div className="flex justify-between  items-start gap-3 w-full">
        {profile?.profile_picture ? (
          <Image
            priority={true}
            height={50}
            width={50}
            src={profile?.profile_picture || ""}
            alt="cover picture"
            className="w-10 h-10 object-cover bg-gray-300 rounded-full sm:w-14 sm:h-14"
          />
        ) : (
          <div className="w-12 h-12 object-cover bg-gray-300 rounded-full sm:w-14 sm:h-14 flex justify-center items-center p-1">
            <User2 />
          </div>
        )}

        <FormProvider {...form}>
          <form className="w-[88%] sm:w-[91%] flex-col h-auto justify-center items-center">
            <div className="flex justify-between w-full items-center">
              <MentionInput
                className={"col-span-12 md:col-span-3 md:mb-0"}
                inputValue={inputValue}
                setInputValue={setInputValue}
                parsedData={parsedData}
                setParsedData={setParsedData}
              />
              {/* {images.length ? ( */}
                <MultiCropModel
                setImages={setImages}
                  handleFinish={handleClick}
                  images={images}
                  CropedImages={imageHolder}
                  openDialog={openDialog}
                  setImageHolder={setImageHolder}
                  setOpenDialog={setOpenDialog}
                />
              {/* ) : ( */}
                <Button
                  disabled={isLoading}
                  onClick={(e) => handleClick(e)}
                  size={"icon"}
                  className="w-14 h-9 flex justify-center items-center bg-gray-900"
                >
                  {isLoading ? (
                    <LoaderCircle className="text-white animate-spin" />
                  ) : (
                    <Rocket className="w-6 h-6 font-light text-white" />
                  )}
                </Button>
              {/* )} */}
            </div>
            {!isScrolled && (
              <AnimatePresence>
                <motion.div
                  className="w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <PostCreationOptions
                    activeLocation={activeLocation}
                    setActiveLocation={setActiveLocation}
                    disabled={isLoading}
                    video={video}
                    images={images}
                    setImages={setImages}
                    setVideo={setVideo}
                  />
                </motion.div>
              </AnimatePresence>
            )}
          </form>
        </FormProvider>
      </div>
      <AnimatePresence>
        {!isScrolled ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-start gap-3 items-center w-full"
          >
            <ImageGrid
              // imageHolder={imageHolder}
              // setImageHolder={setImageHolder}
              isEditMode={false}
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
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostCreation;
