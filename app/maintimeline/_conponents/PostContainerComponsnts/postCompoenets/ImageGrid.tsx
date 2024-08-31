import React, { useCallback, useState, useEffect, useRef } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import SingleImageGrid from "../SingleImageGrid";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ImageWithId } from "../PostCreation";

interface ImageGridProps {
  images: ImageWithId[];
  setImages: React.Dispatch<React.SetStateAction<ImageWithId[]>>;
  // imageHolder: ImageWithId[];
  // setImageHolder:    React.Dispatch<React.SetStateAction<ImageWithId[] | []>>;

}

const ImageGrid = ({ images, setImages  ,}: ImageGridProps) => {



  const [toggle, setToggle] = useState<string>("");

  const handleDragEnd = useCallback(
    (event: any) => {
      // setActiveId(null);
      const { active, over } = event;

      if (!active || !over || active.id === over.id) return;

      const sourceIndex = images.findIndex((image) => image.id === active.id);
      const targetIndex = images.findIndex((image) => image.id === over.id);

      if (sourceIndex !== targetIndex) {
        setImages((prevImages) =>
          arrayMove(prevImages, sourceIndex, targetIndex)
        );

        // Add GSAP animation delay here
      }
    },
    [images, setImages]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor)
  );

  const imageWrapperRef = useRef(null);
  const [hasAnimated , setHasAnimated] = useState(false);

  useGSAP(() => {
    if (images.length >0 && hasAnimated) return ;

    const tlImageWrapper = gsap.timeline({ paused: true });
    tlImageWrapper.fromTo(
      imageWrapperRef.current,
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
        duration: 0.5,
        delay:.8,
        ease: "power1.inOut",
      }
    );

    if (images.length > 0) {
      tlImageWrapper.play();
      setHasAnimated(true);

    } else {
      tlImageWrapper.reverse();
            setHasAnimated(false); // Reset if images are cleared

    }
  }, [images]);

  return (
    <div
      ref={imageWrapperRef}
      className="image-wrapper flex justify-start w-full md:w-2/3 overflow-auto items-start "
    >
      {images.length > 0 && (
        <div className="flex justify-start items-start  gap-2 w-max h-48">
          <DndContext
            sensors={sensors}
            // onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}
          >
            <SortableContext
              items={images}
              strategy={horizontalListSortingStrategy}
            >
              {images.map((image, index) => (
                <SingleImageGrid
                // imageHolder={imageHolder} 
                // setImageHolder={setImageHolder}
                  settoggele={setToggle}
                  key={image.id} // Use unique id as key
                  file={image.file}
                  id={image.id}
                  handleDelete={(id) =>
                    setImages((prev) => prev.filter((img) => img.id !== id))
                  }
                  // setToggle={setToggle}
                  toggele={toggle}
                />
              ))}
            </SortableContext>

            <DragOverlay>
              {toggle ? <div /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default ImageGrid;