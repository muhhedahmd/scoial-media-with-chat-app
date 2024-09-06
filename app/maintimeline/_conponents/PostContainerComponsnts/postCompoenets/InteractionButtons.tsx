import React, { useCallback } from "react";
import { InteractionButtonsLoader } from "./Loaderes";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send } from "lucide-react";
import { ReactPoper } from "./ReactPoper";
import { Reaction, ReactionType, User } from "@prisma/client";
import { useMessageOpen } from "@/app/maintimeline/layout";
import ShareDialog from "./ShareComp/ShareDialog";
interface InteractionButtonsProps {
  postId: number;
  author_id: number;
  isLoading: boolean;
  data: {
    author_id: number;
    reaction: {
        id: number;
        type: ReactionType;
        created_at: Date;
        updated_at: Date;
        innteractId: number;
        interactionShareId: number | null;
    }[];
} | null

  userId: number;
  created_at :Date
  title:string
  user:User
}

const InteractionButtons = ({
  postId,
  author_id,
  data,
  userId,
  isLoading,
  created_at,
  title,
  user

}: InteractionButtonsProps) => {
  const findReactionsCallback = useCallback(() => {
    if(data )
    return data.reaction?.filter((react) => data.author_id=== userId).map((r) => r.type);
  }, [userId, data]);
  const { toggleMessageOpen } = useMessageOpen();

  const findReactions = findReactionsCallback();

  console.log({
    findReactions ,
    data
  })

  if (!postId || isLoading) return <InteractionButtonsLoader />;
  else {
    return (
      <div className="flex justify-start items-center gap-3 mt-3 w-full">
        <ReactPoper
          userId={userId}
          findReactions={findReactions || []}
          author_id={author_id}
          postId={postId}
        />
        <ShareDialog
          author_id={author_id}
          postId={postId}
          created_at={created_at}
          title={title}
          user={user}
        />
        <Button
          onClick={() => {
            console.log({ postId });
            toggleMessageOpen(postId, true);
          }}
          variant={"ghost"}
          className="w-1/3 hover:bg-yellow-300/15 flex justify-center items-center gap-3  bg-yellow-300/10 h-9 text-muted-foreground"
        >
          <p>Comment</p>
          <MessageCircle className="w-4 h-4" />
        </Button>
      </div>
    );
  }
};

export default InteractionButtons;
