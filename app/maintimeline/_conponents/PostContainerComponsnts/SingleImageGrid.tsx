import React, { memo, useMemo, useState } from "react";
import { AnimateLayoutChanges, NewIndexGetter, useSortable, UseSortableArguments } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Dot, MoveHorizontalIcon, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import BluredImage from "@/app/_components/ImageWithPlaceholder";
import { post_image } from "@prisma/client";
import { Disabled, SortingStrategy } from "@dnd-kit/sortable/dist/types";
import { SortableTransition } from "@dnd-kit/sortable/dist/hooks/types";

// Define the Arguments interface
// export interface Arguments
//   extends Omit<UseSortableArguments, "disabled">,
//     Pick<UseSortableArguments, "resizeObserverConfig"> {
//   animateLayoutChanges?: AnimateLayoutChanges;
//   disabled?: boolean | Disabled;
//   getNewIndex?: NewIndexGetter;
//   strategy?: SortingStrategy;
//   transition?: SortableTransition | null;
// }

interface SingleImageGridProps {
  file?: File;
  id: string | number;
  handleDelete: (id: string | number) => void;
  settoggele: React.Dispatch<React.SetStateAction<string | number | null>>;
  toggele: string | number | null;
  image?: post_image;
  isEditMode?: boolean;
  newImg?: boolean
}

const SingleImageGrid = memo(
  ({

    isEditMode = false,
    toggele,
    settoggele,
    id,
    file,
    image,
    handleDelete,
    newImg = false
  }: SingleImageGridProps) => {
    // Sortable setup with drag sensitivity control


   

  
    // const getNewIndex = 
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({

      id,
      getNewIndex  : ({ activeIndex, id, items, overIndex }) => {
        const threshold = 20; // Drag sensitivity threshold in pixels
      
        const activeItem = items[activeIndex];
        const overItem = items[overIndex];
      
        // Calculate the difference in position
        if (
          activeItem &&
          overItem ) {
          // Math.abs(activeItem - overItem) > threshold
          // Only change the index if the position difference is greater than the threshold
          return overIndex;
        }
        return activeIndex; // Return null to keep the current index if within the threshold
      },
      transition: {
        duration: 200, // Duration of drag transition
        easing: "ease-out", // Easing function for smoothness
      },
    });

    const [croppedImage, setCroppedImage] = useState<File | null>(null);
    const MemeoCropedUrl = useMemo(
      () => (croppedImage ? URL.createObjectURL(croppedImage) : ""),
      [croppedImage]
    );
    const MemeoMainUrl = useMemo(
      () => file && URL.createObjectURL(file),
      [file]
    );
    const { toast } = useToast();

    return (
      <div
        ref={setNodeRef}
        {...attributes}
        style={{
          transform: CSS.Transform.toString(transform),
          transition: transition || ".5s",
        }}
        className={cn(
          "image-grid-item pl-0 bg-white relative w-16 mr-2 object-cover rounded-md transition-all duration-500",
          !isEditMode && "h-48",
          toggele === id && !isEditMode && "w-[18.75rem] h-48",
          toggele === id && isEditMode && "",
          isDragging && "z-50 opacity-90"
        )}
        key={id}
      >
        {isEditMode && image ? (
          <div

          className={ cn( ' overflow-x-hidden',  
            newImg && 'border-2 rounded-md  border-emerald-500'
          )}
            onClick={() => {
              settoggele(e => e===id ? null : id);
            }}
          >
            <BluredImage
              alt={`Post image ${image.id + 1}`}
              className="w-16 h-16 object-cover rounded"
              height={image.height}
              imageUrl={image.img_path}
              quality={50}
              width={image.width}
              blurhash={image.HashBlur}
            />
          </div>
        ) : (
          <Image
            height={50}
            width={50}
            src={MemeoCropedUrl ? MemeoCropedUrl : MemeoMainUrl || ""}
            alt={`Uploaded ${id}`}
            className={cn(
              "rounded-md w-full h-full duration-500 transition-all",
              toggele === id ? "object-contain" : "object-cover"
            )}
            onClick={() => {
              settoggele(e => e===id ? null : id);
            }}
          />
        )}

        {toggele === id && (
          <div
            className="absolute left-0 top-0 shadow-lg bg-white gap-1 pb-1 pr-1 flex flex-col justify-start items-center"
            style={{
              borderRadius: "0  0 6px  0",
            }}
          >
                        {
              newImg ?       <div
              // onClick={() => handleDelete(id)}
              className="text-emerald-400 rounded-full hover:bg-none bg-emerald-400 w-2 h-2 "
            />: null
            }

            <div
              className="text-orange-400 w-fit h-fit top-0 z-10 hover:bg-none rounded-md"
              {...listeners}
            >
              <MoveHorizontalIcon className="w-4 h-4" />
            </div>
            <div
              onClick={() => handleDelete(id)}
              className="text-red-400 hover:bg-none"
            >
              <X className="w-4 h-4" />
            </div>
     
          </div>
        )}
      </div>
    );
  }
);

export default SingleImageGrid;

SingleImageGrid.displayName = "SingleImageGrid";
