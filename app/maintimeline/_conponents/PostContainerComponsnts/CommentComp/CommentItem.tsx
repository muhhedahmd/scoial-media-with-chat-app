import { useGetUserQuery } from "@/store/api/apiUser";
import { Comment } from "@prisma/client";
import { formatDistance } from "date-fns";
import Replaies from "./replayComp/Replaies";
import ReplayAdditon from "./replayComp/replayAddetion";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useGetProfileQuery } from "@/store/api/apiProfile";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { Emoji } from "./EmojiPicker";
import CommentReactions from "./CommentReactions";
import { FixedComment } from "@/app/api/comment/route";
import { useGetRepliesLikesQuery } from "@/store/api/apicomment";
import { Separator } from "@radix-ui/react-separator";
import { UserIcon } from "lucide-react";
import ContentDialog from "./replayComp/ContentDialog";

interface CommentItemProps {
  comment: FixedComment;
  userId: number;
  post_id: number;
  hideAddition?: boolean;
  author_id_comment: number;
  post_id_from_comment: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  post_id,
  comment,
  userId,
  author_id_comment,
  post_id_from_comment,
  hideAddition,
}) => {
  const { data: commentedUSer, isLoading: loadingUSer } = useGetUserQuery({
    userId: +comment?.author_id,
  });

  const { data: profileData, isLoading: loaddingProfile } = useGetProfileQuery({
    userId: commentedUSer?.id!,
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
              className="w-10 h-10 rounded-full object-cover"
            />
            <AvatarFallback
              role="dialog"
              className="w-16 h-10 flex bg-gray-100 justify-center items-center"
            >
     
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
          <div className="flex justify-start flex-col  items-start gap-2">
            <div className="flex justify-start flex-col md:flex-row mb-2 items-center gap-3">
            <div className="max-w-full break-words">
                  <ContentDialog content={comment.content} />
                </div>
              {/* <p className=" text-gray-700 w-max">{comment.content}</p> */}
            </div>
             
            {isOpen ? (
              <Replaies
                post_id={post_id}
                MainUserId={userId}
                author_comment={comment.author_id}
                comment_id={comment.id}
              />
            ) : null}
          </div>

          {isOpen ? (
            <div>
              <ReplayAdditon
                post_id={post_id}
                comment_id={comment.id}
                userId={userId}
              />
            </div>
          ) : null}
          <div className="flex justify-start w-max gap-1">
            <Button
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(!isOpen)}
              variant={"link"}
            >
              {!isOpen ? "show Replay" : "hide replay"}
            </Button>
            <Separator orientation="horizontal" />
            <Button
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(!isOpen)}
              variant={"link"}
            >
              load more
            </Button>
            <Separator orientation="horizontal" />
            <div className="w-full flex-row flex  gap-3">
                <CommentReactions comment_id={comment.id} />
                <Emoji
                  post_id={post_id}
                  commentId={comment.id}
                  userId={userId}
                />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
