import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Send } from "lucide-react";
import React, { useState } from "react";
import HeaderPost from "../HeaderPost";
import ContentPost from "../ContentPost";
import ReactionReactionOptions from "../Reaction&ReactionOptions";
import { User } from "@prisma/client";
import SharePostCard from "./SharePostCard";
import { Input } from "@/components/ui/input";

const ShareDialog = ({
  postId,
  author_id,
  user,
  created_at,
  title,
}: {
  postId: number;
  author_id: number;
  user: User;
  created_at: Date;
  title: string;
}) => {

    const [ShareContent ,setShareContent] =useState("")
    
    const handleShare =()=>{

    }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          // disabled={true}
          variant={"reaction"}
          className="w-1/3 h-9 text-muted-foreground  flex justify-center items-center gap-3 "
        >
          Share
          <Send className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[25rem] rounded-md sm:max-w-[40rem]">
        <DialogHeader>Hello again, complete your share</DialogHeader>
        <div className="flex flex-col justify-start items-start ">
      <HeaderPost
        share={true}
        postId={postId}
        author_id={user.id}
        user={user}
      />
      <Input
      placeholder="Share the moment...."
      className="w-full"
      value={ShareContent}
      onChange={(e)=>setShareContent(e.target.value)}
      />
        <SharePostCard
          author_id={author_id}
          postId={postId}
          user={user}
          title={title}
          />
          </div>

        <DialogFooter className="flex justify-start flex-col sm:flex-row w-full gap-2 ">
          <DialogClose >Later</DialogClose>
          <Button onClick={()=>handleShare()}>Share</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
