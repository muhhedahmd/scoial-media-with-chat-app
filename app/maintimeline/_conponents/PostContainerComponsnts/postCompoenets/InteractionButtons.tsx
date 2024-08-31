import React, { useCallback } from "react";
import { InteractionButtonsLoader } from "./Loaderes";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Send,
} from "lucide-react";
import { ReactPoper } from "./ReactPoper";
import { Reaction } from "@prisma/client";
import { useMessageOpen } from "@/app/maintimeline/layout";
interface InteractionButtonsProps {
  postId: number;
  author_id: number;
  isLoading: boolean;
  data: Reaction[];
  userId: number
}

const InteractionButtons = ({
  postId,
  author_id,
  data,
  userId,
  isLoading,
  
}: InteractionButtonsProps) => {
  const findReactionsCallback = useCallback(() => {

    return data.filter((react) => react.user_id === userId).map((r) => r.type);
  }, [userId , data]);
  const { toggleMessageOpen  } = useMessageOpen();


  const findReactions = findReactionsCallback();

  if (!postId || isLoading) return <InteractionButtonsLoader />;
  else {
    return (
      <div className="flex justify-start items-center gap-3 mt-3 w-full">
        <ReactPoper
        userId={userId}
          findReactions={findReactions}
          author_id={author_id}
          postId={postId}
        />
        <Button
          // disabled={true}
          variant={"reaction"}
          className="w-1/3 h-9 text-muted-foreground  flex justify-center items-center gap-3 "
        >
          Share
          <Send className="w-4 h-4" />
        </Button>
        <Button
        onClick={()=>{
          console.log({postId})
          toggleMessageOpen(postId , true )}}
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
