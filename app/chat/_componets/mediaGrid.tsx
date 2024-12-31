import { Link2 } from 'lucide-react'
import { LoaderMediaItems } from "./LoaderMediaItems"
import { MediaItem } from "./mediaItem"
import { ChatMediaTabsType } from "@/app/api/chat/chat-media-tabs/route"
import { FixedResponseTaps } from "@/store/api/apiChat"
import { MessageLinks, MessageMedia } from '@prisma/client'

interface MediaGridProps {
  media?: FixedResponseTaps | undefined
  type: ChatMediaTabsType,
  isLoading?: boolean
  onItemClick: ( media :MessageMedia, x: number, y: number , medias : MessageMedia[] |MessageLinks[] | [] , activeIdx : number)=> void
}

export function MediaGrid({ media,  type, isLoading, onItemClick }: MediaGridProps) {
  if (type === "link") {
    return (
      <div className="space-y-3">
        {media && media?.[`${type}`]?.media.map((item) => (
          <div
            key={item.id}
            className="flex items-center p-3 bg-muted rounded-lg"
          >
            <Link2 className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm break-all hover:underline"
            >
              {item.link}
            </a>
          </div>
        ))}
        {isLoading && <LoaderMediaItems  isOthers={false} isLinks second={!!media?.link?.media} />}

      </div>
    )
  }

  return (
    <>
      <div className={`grid gap-4 ${
        type === "others" 
          ? "grid-cols-3 lg:grid-cols-5" 
          : "grid-cols-4 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-5"
      }`}>
        {media && media?.[`${type}`]?.media?.map((item , idx) => (
          <MediaItem
          idx={idx}
          allMedia={media}
            key={item.id}
            item={item}
            onItemClick={onItemClick}
            type={type}
          />
        ))}
      </div>
      { isLoading &&
       <LoaderMediaItems isOthers={type === "others"} second={!!media?.[`${type}`]?.media} isLinks={false} />
      }
    </>
  )
}

