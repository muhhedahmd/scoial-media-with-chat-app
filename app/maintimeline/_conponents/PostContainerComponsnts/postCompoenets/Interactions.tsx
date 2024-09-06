"use client";

import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import {  Profile, Reaction } from "@prisma/client";
import { Angry, Frown, Heart, Laugh, PartyPopper, ThumbsUp } from "lucide-react";
import ReactViewrDialog from "./ReactionDialog/ReactViewrDialog";

interface InteractionsProps {
  postId: number;
  isLoading :boolean,
  data  : Reaction[]
  author_id:number,
  MainUserProfile:Profile
}

const Interactions = ({ author_id,  MainUserProfile, postId  ,data , isLoading}: InteractionsProps) => {
const uniqe  = Array?.from(new Set(data?.map(item=>item.type)))
  if (isLoading) {
    return (
      <div className="flex mt-3 justify-start items-center gap-3 w-full">
        <Skeleton className="w-3/12 h-6 bg-gray-300" />
      </div>
    );
  } else {
    return (
   <ReactViewrDialog
   MainUserProfile={MainUserProfile}
   author_id={author_id}
   data={data}
   uniqe={uniqe}
   />
    );
  }
};



export default Interactions;