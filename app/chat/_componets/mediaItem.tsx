import { Download, FileText, Videotape } from "lucide-react";
import { MessageLinks, MessageMedia } from "@prisma/client";
import BluredImage from "@/app/_components/ImageWithPlaceholder";
import DownloadButton from "@/components/DownloadButton";
import { ChatMediaTabsType } from "@/app/api/chat/chat-media-tabs/route";
import { FixedResponseTaps } from "@/store/api/apiChat";

interface MediaItemProps {
  item: MessageMedia;
  onItemClick:  (media: MessageMedia, x: number, y: number, medias: MessageMedia[] | MessageLinks[] | [], activeIdx: number) => void
  type: ChatMediaTabsType;
  idx: number;
  allMedia: FixedResponseTaps;
}

export function MediaItem({
  item,
  onItemClick,
  type,
  allMedia,
  idx,
}: MediaItemProps) {




  const handleClick = (
    e: React.MouseEvent<HTMLDivElement>,
    item: MessageMedia,
    activeIdx: number
  ) => {
    const pos = e.currentTarget.getBoundingClientRect();
    if (allMedia?.[`${type}`]?.media) {
      const mediaInIt = allMedia?.[`${type}`]?.media;
      onItemClick(item, pos.x, pos.y, mediaInIt || [], activeIdx);
    }
  };

  if (type === "others") {
    return (
      <div className="relative rounded-md shadow-md w-full">
        <BluredImage
          imageUrl={item.thumbnailUrl || ""}
          alt={item.name}
          blurhash={item.HashBlur || ""}
          height={item.height || 0}
          width={item.width || 0}
          quality={90}
          className="w-full h-20 object-cover rounded-lg"
        />
        <div className="absolute w-full bottom-0 left-0">
          <DownloadButton
            item={{
              mediaUrl: item.mediaUrl,
              name: item.name,
            }}
            className="w-full flex items-center p-2 bg-background/80 backdrop-blur-sm rounded-lg"
          >
            <FileText className="h-3 w-3 text-muted-foreground mr-2" />
            <span className="text-sm truncate flex-1">{item.name}</span>
            <Download className="h-4 w-4 text-muted-foreground" />
          </DownloadButton>
        </div>
      </div>
    );
  }

  const isVideo = type.startsWith("video");
  const showPlaceholder = isVideo && (!item.thumbnailUrl || !item.HashBlur);

  return (
    <div
      onClick={(e) => handleClick(e, item , idx)}
      className="aspect-square rounded-lg shadow-md overflow-hidden cursor-pointer transition-opacity hover:opacity-90"
    >
      {showPlaceholder ? (
        <div className="w-full h-full bg-muted flex-col flex justify-center items-center">
          <Videotape className="w-5 h-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {item.name.length > 10
              ? `${item.name.substring(0, 10)}...`
              : item.name}
          </p>
        </div>
      ) : (
        <BluredImage
          alt={item.name || ""}
          className="w-full h-full object-cover"
          height={item.height || 0}
          imageUrl={item.thumbnailUrl || item.mediaUrl || ""}
          quality={100}
          width={item.width || 0}
          blurhash={item.HashBlur || ""}
        />
      )}
    </div>
  );
}
