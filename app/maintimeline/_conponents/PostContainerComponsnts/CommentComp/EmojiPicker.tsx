import React, { useState } from "react";
import Picker, { EmojiClickData } from "emoji-picker-react";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { CircleFadingPlus, Heart } from "lucide-react";
import { useToggleEmojiCommentsMutation } from "@/store/api/apicomment";
import { useToast } from "@/components/ui/use-toast";

export const Emoji = ({
  userId,
  commentId,
}: {
  userId: number;
  commentId: number;
}) => {
  const [addReact, { isLoading }] = useToggleEmojiCommentsMutation();
const {toast} = useToast()
  const handleReaction = (emojiObject: EmojiClickData) => {

    if(
      !isLoading &&
      emojiObject
    ){

      addReact({
        author_id:userId ,
        comment_id: commentId,
        emoji: emojiObject.emoji,
        imageUrl :emojiObject.imageUrl,
        names :emojiObject.names
      }).then(()=>{
        toast({
          title: "Reaction Added",
          description: "Your reaction has been added to the comment " + emojiObject.emoji,
          variant:"default"
        })
      }).catch(()=>{
        toast({
          title: "some thing wrong",
          description: "sorry try again later",
          variant:"destructive"
        })
      })
    }
    console.log(emojiObject);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <CircleFadingPlus className="w-4 h-4 " />
      </PopoverTrigger>
      <PopoverContent>
        <Picker
          className="absolute top-0 left-0"
          reactionsDefaultOpen={true}
          onReactionClick={(e) => handleReaction(e)}
        />
      </PopoverContent>
    </Popover>
  );
};
