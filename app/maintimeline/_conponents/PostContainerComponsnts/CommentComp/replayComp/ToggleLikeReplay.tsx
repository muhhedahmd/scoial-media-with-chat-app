import { cn } from "@/lib/utils";
import {
  useGetRepliesLikesQuery,
  useGetRepliesQuery,
  useToggleReplayLikesMutation,
} from "@/store/api/apicomment";
import { Heart } from "lucide-react";
import React from "react";

interface ToggleLikeReplayInterface {
  rpelayid: number;
  MainUserId: number;
  post_id: number;
}

const ToggleLikeReplay = ({
  rpelayid,
  MainUserId,
  post_id,
}: ToggleLikeReplayInterface) => {
  const [toggle, { isLoading, data }] = useToggleReplayLikesMutation();
  const handleToggle = () => {
    toggle({ author_id: MainUserId, replay_id: rpelayid, post_Id: post_id });
  };
  const { data: replayiesLikes, isLoading: isLoadingreplayiesLikes } =
    useGetRepliesLikesQuery({
      replay_id: rpelayid,
    });

  const isIn =
    replayiesLikes?.find((like) => like.author_id === MainUserId) !== undefined;




  return (
 <div className="relative bg border-2 gap-[.4rem] px-[6px] rounded-[15px] border-gray-300  flex bg-[#f7f7f7] items-center justify-center">
      <div
        onClick={() => handleToggle()}
        className="  text-muted-foreground cursor-pointer w-4 h-4"
      >
        <Heart
          className={cn("w-4 h-4", isIn ? "text-pink-700 fill-pink-500  " : "text-gray-400")}
        />
      </div>

      <div className="text-sm text-muted-foreground cursor-pointer">
        {replayiesLikes?.length}
      </div>
    </div>
  );
};

export default ToggleLikeReplay;
