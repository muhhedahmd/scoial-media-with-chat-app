import Image from "next/image"
import { BlurhashCanvas } from "react-blurhash"
import { PhotoProvider, PhotoView } from "react-photo-view"
import "react-photo-view/dist/react-photo-view.css"
import BlurredImage from "./ImageWithPlaceholder"

const PhotoViewrComp = ({
  alt,
  className,
  height,
  imageUrl,
  width,
  blurhash,
}: {
  alt: string
  className: string
  height: number
  imageUrl: string
  width: number
  blurhash?: string
}) => {
  return (
    <PhotoProvider 
    overlayRender={()=>
      blurhash ?
        <BlurhashCanvas 
            className="w-screen h-screen"
            hash={blurhash || ""}
        
        />:<>
        </>
    }
    >
      <PhotoView overlay={
        blurhash ?
        <BlurhashCanvas 
            className="w-screen h-screen"
            hash={blurhash || ""}
        
        /> : <>
        </>
      } src={imageUrl}>

        <Image
        width={width}
        height={height}
        quality={100}
          className={className + "rounded-md"}
          src={imageUrl || "/placeholder.svg"}
          alt={alt}
          onClick={(e) => {
            e.stopPropagation() // Prevent event from bubbling up
          }}
        />


      </PhotoView>
    </PhotoProvider>
  )
}

export default PhotoViewrComp

