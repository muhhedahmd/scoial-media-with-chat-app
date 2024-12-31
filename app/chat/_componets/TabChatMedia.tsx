"use client"

import { ChatMediaTabsType } from "@/app/api/chat/chat-media-tabs/route"
import { useGetMediaTabsQuery } from "@/store/api/apiChat"
import { memo } from "react"
import { MediaGrid } from "./mediaGrid"
import { MessageLinks, MessageMedia } from "@prisma/client"


interface TabChatMediaProps {
  chatId: number
  type: ChatMediaTabsType
  setOpenCustomModel:
  React.Dispatch<React.SetStateAction<{
    media ?:MessageMedia
    medias : MessageMedia[] |MessageLinks[]  | []
    activeIdx : number  
    x: number;
    y: number;
    amimate: boolean;
} | null>>
}

function TabChatMedia({ chatId, type, setOpenCustomModel }: TabChatMediaProps) {
  const {
    data: media,
    isFetching,
    isLoading,
    isError,
  } = useGetMediaTabsQuery({
    chatId,
    skip: 0,
    take: 10,
    type,
  }, {

    skip: !chatId
  })

  if (isError) {
    return (
      <div className="p-4 text-destructive bg-destructive/10 rounded-md">
        Error loading media. Please try again.
      </div>
    )
  }

  const handleItemClick = ( media :MessageMedia, x: number, y: number , medias : MessageMedia[] |MessageLinks[] |[] , activeIdx : number) => {

    const data =  { x, y, amimate: true  , media : media ,  medias , activeIdx }
    setOpenCustomModel(data)
  }

  console.log({
    media
  })

  return (
    <div className="p-4">
      <MediaGrid
        media={media}
        type={type }
        isLoading={isLoading || isFetching}
        onItemClick={handleItemClick}
      />
    </div>
  )
}

// Memoize the component with a proper display name
export default memo(TabChatMedia, (prevProps, nextProps) => {
  return prevProps.chatId === nextProps.chatId && prevProps.type === nextProps.type
})

// Set display name for debugging
TabChatMedia.displayName = "TabChatMedia"

