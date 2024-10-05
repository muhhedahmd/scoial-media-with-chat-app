import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Profile, Reaction, ReactionType } from "@prisma/client";
import {
  Angry,
  Frown,
  Heart,
  Laugh,
  PartyPopper,
  ThumbsUp,
} from "lucide-react";
import React from "react";
import ReactViewrDialogSingle from "./ReactViewrDialogSingle";
import { Separator } from "@/components/ui/separator";
import { reactionType } from "@/app/api/posts/reactions/route";

export const getColor = (type: string) => {
  switch (type) {
    case "like":
      return "text-blue-500";
    case "haha":
      return "text-orange-500";
    case "angry":
      return "text-red-500";
    case "love":
      return "text-pink-500";
    case "sad":
      return "text-gray-500";
    case "wow":
      return "text-purple-500";
    default:
      return "text-gray-500";
  }
};
export const getEmoji = (type: string) => {
  switch (type) {
    case "like":
      return <ThumbsUp className="w-4 h-4 " />;
    case "haha":
      return <Laugh className="w-4 h-4 " />;
    case "angry":
      return <Angry className="w-4 h-4 " />;
    case "love":
      return <Heart className="w-4 h-4 " />;
    case "sad":
      return <Frown className="w-4 h-4 " />;

    case "wow":
      return <PartyPopper className="w-4 h-4 " />;
    default:
      return <PartyPopper />;
  }
};
interface ReactViewrDialogProps {
  uniqe: ReactionType[];
  data:  reactionType[];
  author_id:number
  MainUserProfile:Profile
  userId:number
}


const ReactViewrDialog = ({  userId,MainUserProfile, uniqe, data  , author_id}: ReactViewrDialogProps) => {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex cursor-pointer justify-start my-1 items-center">
          {uniqe?.map((react, i) => {
            return (
              <div key={i} className="flex justify-start items-center w-max">
                <p className={`-rotate-3 ${getColor(react)}`}>
                  {getEmoji(react)}
                </p>
              </div>
            );
          })}
          <p className="text-muted-foreground">
            {data.length ? data.length : null}
          </p>
        </div>
      </DialogTrigger>

      <DialogContent className="h-[65%] w-full flex flex-col justify-start items-start gap-5">
      <div className="w-full flex flex-col justify-start items-start gap-2  text-xl text-gray-800" >
          Reactions
      <Separator
    
      />
      </div>
        <div  className="w-full h-full flex justify-start flex-col gap-4 items-start ">
          {data?.map((react) => {

            if( react && react.author_id)
            return <ReactViewrDialogSingle
            userId={userId}
            MainUserProfile={MainUserProfile}
            key={react.id} 
            {...react} />;
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReactViewrDialog;
