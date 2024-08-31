import React, {
  memo,
  Suspense,
  useMemo,
  useState,
} from "react";
import { useSortable } from "@dnd-kit/sortable";
import { Loader2Icon, MoveHorizontalIcon, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CSS } from "@dnd-kit/utilities";
import CropperModal from "@/app/_componsents/crop-model/crop";
import { useToast } from "@/components/ui/use-toast";
import { ImageWithId } from "./PostCreation";

interface SingleImageGridProps {
  file: File;
  id: string;
  handleDelete: (id: string) => void;
  settoggele: React.Dispatch<React.SetStateAction<string>>;
  toggele: string;

  // imageHolder: ImageWithId[] | [];
  // setImageHolder: React.Dispatch<
  //   React.SetStateAction<ImageWithId[] | []>
  // >;
}

const SingleImageGrid = memo(
  ({
    toggele,
    settoggele,
    id,
    file,
    handleDelete,
    // imageHolder,
    // setImageHolder,
  }: SingleImageGridProps) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });

    const [croppedImage, setCroppedImage] = useState<File | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const MemeoCropedUrl = useMemo(
      () => (croppedImage ? URL.createObjectURL(croppedImage) : ""),
      [croppedImage]
    );
    const MemeoMainUrl = useMemo(() => URL.createObjectURL(file), [file]);
    const { toast } = useToast();

    // const handleCropComplete = (croppedImage: File) => {
    //   new Promise((resolve, reject) => {
    //     const reader = new FileReader();
    //     reader.onload = () => {
    //       resolve(reader.result as string);
    //     };
    //     reader.onerror = () => {
    //       reject(reader.error);
    //     };
    //     reader.readAsDataURL(croppedImage);
    //   })
    //     .then((base64String) => {
    //       console.log({
    //         MemeoCropedUrl,
    //         MemeoMainUrl,
    //       });
    //       toast({
    //         variant: "success",
    //         title: "image cropped",
    //       });
    //       const updated = imageHolder?.map((obj)=>{
    //         return obj.id === id ? {
    //           file: croppedImage ,
    //           id :obj.id ,
    //           isCroped :true
    //         }:obj
    //       })
    //       // console.log(updated)
    //       setOpenDialog(false); 

    //       // setImageData(base64String); // Update the state with the base64 string
    //     })
    //     .catch(() => {
    //       setCroppedImage(null);
    //       setOpenDialog(false);
    //       toast({
    //         variant: "destructive",
    //         title: "Connot crop this image",
    //       });
    //     });
    //   // Update the image source with the cropped version
    //   console.log("Cropped image: ", croppedImage);
    // };

    return (
      <>
        <Suspense
          fallback={
            <div className="w-[18.75rem] h-48 p-4 flex justify-center items-center">
              <Loader2Icon className="w-5 h-5 animate-spin text-yellow-400" />
            </div>
          }
        >
          <div
            ref={setNodeRef}
            {...attributes}
            style={{
              transform: CSS.Transform.toString(transform),
              transition: transition || ".5s",
            }}
            className={cn(
              "image-grid-item pl-0 bg-white h-48 relative w-16 mr-2 object-cover rounded-md transition-all duration-500",
              toggele === id && " w-[18.75rem] h-48 ",
              isDragging && "z-50 opacity-90"
            )}
            key={id}
          >
            <Image
              height={50}
              width={50}
              src={MemeoCropedUrl ? MemeoCropedUrl : MemeoMainUrl}
              alt={`Uploaded ${id}`}
              className={cn(
                "rounded-md w-full h-full duration-500 transition-all",
                toggele === id ? "object-contain" : "object-cover"
              )}
              onClick={() => {
                settoggele(id);
              }}
            />
            {toggele === id && (
              <div
                className="absolute left-0 top-0 bg-white gap-1 flex flex-col justify-start items-center"
                style={{
                  borderRadius: "0  0 6px  0",
                }}
              >
                <div
                  className="text-gray-800 top-0 z-10 p-1 hover:bg-none rounded-md"
                  {...listeners}
                >
                  <MoveHorizontalIcon className="w-5 h-5" />
                </div>
                <div
                  onClick={() => handleDelete(id)}
                  className="text-gray-900 hover:bg-none"
                >
                  <X className="w-5 h-5" />
                </div>
                {/* <div className="text-gray-900 hover:bg-none">
                  <CropperModal
                    croppedImage={croppedImage}
                    setCroppedImage={setCroppedImage}
                    setOpenDialog={setOpenDialog}
                    openDialog={openDialog}
                    imageFile={file}
                    onCropComplete={handleCropComplete}
                  />
                </div> */}
              </div>
            )}
          </div>
        </Suspense>
      </>
    );
  }
);

export default SingleImageGrid;

SingleImageGrid.displayName = "SingleImageGrid";
