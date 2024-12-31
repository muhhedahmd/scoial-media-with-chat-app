import React, { useCallback } from "react";
import { InteractionButtonsLoader } from "./Loaderes";
import { Button } from "@/components/ui/button";
import { 
 MessageCircle } from "lucide-react";
import { ReactPoper } from "./ReactPoper";
import {  User } from "@prisma/client";
import ShareDialog from "./ShareComp/ShareDialog";

import { reactionType } from "@/app/api/posts/reactions/route";

import SavePopup from "./SaveComp/SavePopup";
import { useMessageOpen } from "@/context/comment";
interface InteractionButtonsProps {
  postId: number;
  author_id: number;
  isLoading: boolean;
  data:  reactionType[]


  userId: number;
  created_at: Date;
  title: string;
  user: User;
  parentTitle?: string;
  Post_parent_id?: number;
  parent_author_id?: number;
}

const InteractionButtons = ({
  postId,
  author_id,
  data,
  userId,
  isLoading,
  created_at,
  title,
  user,
  Post_parent_id,
  parentTitle,
  parent_author_id,
}: InteractionButtonsProps) => {
  const findReactionsCallback = useCallback(() => {

    if (data)
      return data
        ?.filter((react) => react.author_id === userId)
        .map((r) => r.type);
  }, [userId, data]);
  const { toggleMessageOpen } = useMessageOpen();

  const findReactions = findReactionsCallback();



  if (!postId || isLoading) return <InteractionButtonsLoader />;
  else {
    return (
      <div className="flex justify-between items-center gap-3 mt-3 w-full">
        <div 
        className="flex justify-start items-center gap-2"
        >

        <ReactPoper
          findReactions={findReactions || []}
          author_id={author_id}
          userId={userId}
          postId={postId}
        />
        <ShareDialog
          author_id={parent_author_id ? parent_author_id : author_id}
          postId={Post_parent_id ? Post_parent_id : postId}
          created_at={created_at}
          title={parentTitle ? parentTitle : title}
          user={user}
        />
        <Button
          onClick={() => {
            toggleMessageOpen(postId, true);
          }}
          variant={"ghost"}
          className="w-fit hover:bg-yellow-300/15 flex justify-center items-center gap-3  bg-yellow-300/10 h-9 text-muted-foreground"
        >
          <MessageCircle className="w-4 h-4" />
        </Button>
        </div>

          <SavePopup
               userId={userId}
               postId={postId}
          
          
          />
      </div>
    );
  }
};

export default InteractionButtons;
