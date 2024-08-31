import { useGetUserQuery } from "@/store/api/apiUser";
import { Comment } from "@prisma/client";
import { formatDistance } from "date-fns";
import Replaies from "./Replaies";
import ReplayAdditon from "./replayAddetion";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useGetProfileQuery } from "@/store/api/apiProfile";
import { Button } from "@/components/ui/button";
import { useState } from "react";
// import { TooltipProvider } from "@radix-ui/react-tooltip";
// // import EmojiPicker, { Emoji } from 'emoji-picker-react';

// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Heart, ThumbsUp } from "lucide-react";
import { Emoji } from "./EmojiPicker";
import CommentReactions from "./CommentReactions";

interface CommentItemProps {
  comment: Comment;
  userId: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, userId }) => {
  const { data: commentedUSer, isLoading: loadingUSer } = useGetUserQuery({
    userId: +comment.author_id,
  });
  const { data: profileData, isLoading: loaddingProfile } = useGetProfileQuery({
    userId: commentedUSer?.id,
  });
  const [isOpen, setIsOpen] = useState(false);
  const timeStamp = comment.created_at
    ? formatDistance(comment.created_at, new Date(), {
        addSuffix: true,
      })
    : null;

  
  return (
    <div className="space-y-4  ">
      <div className="flex w-full justify-start items-start space-x-4">
        {loaddingProfile ? (
          <div
            className="animate-spin inline-block w-5 h-5 border-4 rounded-full
          border-gray-400"
          ></div>
        ) : (
          <Avatar>
            <AvatarImage
              src={profileData?.profile_picture || ""}
              alt={commentedUSer?.user_name + "profile"}
              className="w-10 h-10 rounded-full"
            />
            <AvatarFallback>
              {commentedUSer?.first_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <span className="font-semibold flex flex-col justify-start items-ceter  text-gray-800">
              {commentedUSer?.first_name + " "} {commentedUSer?.last_name}
  
            </span>
            <span className="text-sm text-gray-500">{timeStamp}</span>
          </div>
          <div className="flex justify-start flex-col items-start gap-2">
            <div className="flex justify-start mb-2 items-center gap-3">
              <p className=" text-gray-700">{comment.content}</p>

              <Emoji 
              commentId={comment.id}
              userId={userId}
              />
        <CommentReactions
        comment_id={comment.id}
        />
           
            </div>
            {isOpen ? 
              
              <Replaies comment_id={comment.id} />
             :null
            }
          </div>

          {isOpen ? (
            <div>
              <ReplayAdditon comment_id={comment.id} userId={userId} />
            </div>
          ) : null}
          <Button
            className="text-sm text-gray-500 hover:text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
            variant={"link"}
          >
            {!isOpen ? "show Replay" : "hide replay"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
