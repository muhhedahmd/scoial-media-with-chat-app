import React, { useState } from "react";
import AvatarRep from "../AvatarRep";
import UserInfoHeader from "../UserInfoHeader";
import TimeStamp from "../TimeStamp";
import ContentDialog from "./ContentDialog";
import ToggleLikeReplay from "./ToggleLikeReplay";
import { Separator } from "@radix-ui/react-separator";
import NestedReplies from "./NestedReplies";
import { cn } from "@/lib/utils";
import { shapeOfReplies } from "@/app/api/comment/replay/route";
import NestedReplayAddation from "./nestedReplayAddation";
import RepliedTo from "./ReplayTo";

interface ReplayItemProps {
  comment_id: number;
  MainUserId: number;
  post_id: number;
  rep: shapeOfReplies;
  focused: number | null;
  level: number;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  setFocused: React.Dispatch<React.SetStateAction<number | null>>;
  openReplay: number | null;
  author_comment: number;
  setOpenReplay: React.Dispatch<React.SetStateAction<number | null>>;
  mainReps: shapeOfReplies[];
}

const ReplayItem: React.FC<ReplayItemProps> = React.memo(
  ({
    MainUserId,
    comment_id,
    post_id,
    rep,
    focused,
    setFocused,
    level,
    setLevel,
    openReplay,
    setOpenReplay,
    mainReps,
    author_comment,
  }) => {
    const handleMouseEnter = () => setFocused(rep.id);
    const handleMouseLeave = () => setFocused(null);

    return (
      <>
        <div
          className={cn(
            "relative w-full flex flex-col gap-2 ",
            "transition-all duration-300",
            `ml-${level * 4}px`, // Adjust margin based on the level
            `md:ml-[${level * 6}px]` // Adjust margin on larger screens
          )}
          style={{
            opacity:
              (focused === rep.id || focused === rep.parentId) &&
              focused !== null
                ? 1
                : (focused !== rep.id || focused !== rep.parentId) &&
                  focused !== null
                ? 0.5
                : 1,
            marginLeft:
              (focused === rep.id || focused === rep.parentId) &&
              focused !== null
                ? `calc(${level * 4}px + 1rem)`
                : `calc(${level * 4}px + 0.5rem)`,

            transition: ".3s",
          }}
          tabIndex={0}
          onMouseEnter={handleMouseEnter} // On hover, set the focus
          onMouseLeave={handleMouseLeave} // On leave, reset opacity
          onBlur={handleMouseLeave} // Handle blur as well
        >
          <div className="flex items-start gap-3 w-full">
            <div className="relative z-10">
              <AvatarRep author_id={rep.author_id as number} />
            </div>

            <div className="flex flex-col justify-start gap-1 w-full">
              <div className="flex justify-between items-center">
                <div
                  className="flex justify-start gap-3 w-3/4 items-center"
                >
                <UserInfoHeader author_id={rep.author_id as number} />

                {
                  rep.parentId  ? 
                  <RepliedTo mainReps={mainReps} parentId={rep.parentId} />
                  : 
                  <div className="text-sm text-muted-foreground " >
                  replied to comment
                    </div>
                }
                </div>
                <TimeStamp key={rep.id} created_at={rep.created_at} />
              </div>

              <div className="flex justify-start items-center gap-3">
                <ContentDialog content={rep.content} />
                <Separator orientation="vertical" className="h-[1rem]" />

                <ToggleLikeReplay
                  rpelayid={rep.id}
                  post_id={post_id}
                  MainUserId={MainUserId}
                />
                <Separator orientation="vertical" className="h-4" />
                <div
                  className={cn(
                    "text-sm text-muted-foreground cursor-pointer",
                    openReplay === rep.id && "text-emerald-600"
                  )}
                  onClick={() =>
                    setOpenReplay((prev) => (prev === rep.id ? null : rep.id))
                  }
                >
                  Reply
                </div>
              </div>
            </div>
          </div>
        </div>
        <NestedReplies
        mainReps={mainReps}
          replayId={rep.id}
          MainUserId={MainUserId}
          comment_id={comment_id}
          post_id={post_id}
          focused={focused}
          setFocused={setFocused}
          openReplay={openReplay}
          setOpenReplay={setOpenReplay}
          level={level}
          setLevel={setLevel}
          author_comment={author_comment}
        />

        {openReplay === rep.id && (
          <div className="ml-6">
            <NestedReplayAddation
              comment_id={comment_id}
              replay_id={rep.id}
              post_id={post_id}
              userId={MainUserId}
            />
          </div>
        )}
      </>
    );
  }
);

ReplayItem.displayName = "ReplayItem";
export default ReplayItem;
