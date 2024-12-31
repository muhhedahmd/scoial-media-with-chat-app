import React, { useCallback, useState, useRef } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import SingleImageGrid from "../SingleImageGrid";
import { ImageWithId } from "../../../../_components/PostCreation";
import { initialPostData } from "./MenuPostOption/MenuPostOption";
import { post_image } from "@prisma/client";
import { cn } from "@/lib/utils";

interface ImageGridProps {
  images: ImageWithId[] | post_image[] | initialPostData;
  setImages:
    | React.Dispatch<React.SetStateAction<ImageWithId[]>>
    | React.Dispatch<React.SetStateAction<initialPostData>>
    | React.Dispatch<
        React.SetStateAction<{ images: ImageWithId[] | post_image[] }>
      >
    | undefined;
  isEditMode: boolean;
  editableDialog?: boolean;
}

const ImageGrid = ({ images, setImages, isEditMode }: ImageGridProps) => {
  const [toggle, setToggle] = useState<string | number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = useCallback(
    (event: any) => {
      const { active, over } = event;
      if (!active || !over || active.id === over.id) return;

      const getImageArray = () => {
        if (Array.isArray(images)) {
          return images;
        } else if (typeof images === "object" && images.images) {
          return images.images;
        }
        return [];
      };

      const currentImages = getImageArray();

      const sourceIndex = currentImages.findIndex(
        (image) => image.id === active.id
      );
      const targetIndex = currentImages.findIndex(
        (image) => image.id === over.id
      );

      if (sourceIndex !== targetIndex) {
        if (Array.isArray(images)) {
          if(setImages){

            const a =  arrayMove(images as ImageWithId[], sourceIndex, targetIndex) as unknown[] as any
            setImages?.(a);
        }
        } else if (typeof images === "object" && images.images) {

          
          setImages?.((prevImages: any) => ({
            ...prevImages,
            images: 
              arrayMove(prevImages.images  , sourceIndex, targetIndex).map((img : any  , i)=>{
                return {
                  ...img,
                  
                  order : i+1
                }
              })
          }));
        }
      }
    },
    [images, setImages]
  );

  const sensors = useSensors(
    useSensor(TouchSensor),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function isImageWithId(image: any): image is ImageWithId {
    return (
      (image as ImageWithId).id !== undefined &&
      (image as ImageWithId).file !== undefined
    );
  }

  const getImageArray = () => {
    if (Array.isArray(images)) {
      return images;
    } else if (typeof images === "object" && images.images) {
      return images.images;
    }
    return [];
  };

  const currentImages = getImageArray();

  return (
    <div
      ref={containerRef}
      className="image-wrapper flex justify-start w-full overflow-x-auto items-start"
      style={{ overscrollBehavior: "contain" }}
    >
      {currentImages.length > 0 && (
        <div
          className={cn(
            "flex justify-start w-max items-start gap-2",
            !isEditMode && "h-48"
          )}
        >
          <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}
          >
            <SortableContext
              items={currentImages}
              strategy={horizontalListSortingStrategy}
            >
              {currentImages.map((image, index) => {
                if (isEditMode && !isImageWithId(image)) {
                  return (
                    <div className="w-full" key={image.id}>
                      <SingleImageGrid
                        newImg={image.new}
                        isEditMode={true}
                        settoggele={setToggle}
                        image={image}
                        id={image.id}
                        handleDelete={(id) =>
                          setImages?.((prev: any) =>
                            Array.isArray(prev)
                              ? prev.filter((img: any) => img.id !== id)
                              : {
                                  ...prev,
                                  images: prev.images.filter(
                                    (img: any) => img.id !== id
                                  ),
                                }
                          )
                        }
                        toggele={toggle}
                      />
                    </div>
                  );
                } else if (!isEditMode && isImageWithId(image)) {
                  return (
                    <SingleImageGrid
                      settoggele={setToggle}
                      key={image.id}
                      file={image.file}
                      id={image.id}
                      handleDelete={(id) =>
                        setImages?.((prev: any) =>
                          Array.isArray(prev)
                            ? prev.filter((img: any) => img.id !== id)
                            : {
                                ...prev,
                                images: prev.images.filter(
                                  (img: any) => img.id !== id
                                ),
                              }
                        )
                      }
                      toggele={toggle}
                    />
                  );
                }
                return null;
              })}
            </SortableContext>
            <DragOverlay>{toggle ? <div /> : null}</DragOverlay>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default ImageGrid;
