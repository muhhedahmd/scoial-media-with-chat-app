import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { LoaderCircle, Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import HeaderPost from "../HeaderPost";
import ContentPost from "../ContentPost";
import ReactionReactionOptions from "../Reaction&ReactionOptions";
import { User } from "@prisma/client";
import SharePostCard from "./SharePostCard";
import { Input } from "@/components/ui/input";
import MinmalCard from "./MinmalCard";
import { useAddShareMutation } from "@/store/api/apiSlice";
import { useGetProfileQuery } from "@/store/api/apiProfile";

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

  const   {
    data : MainUserProfileId  , 
    isLoading :status,

  } = useGetProfileQuery({userId : user?.id})

    const [ShareContent ,setShareContent] =useState("")
    const  [ share , {isLoading , isSuccess , isError }] = useAddShareMutation()

  

const [openDialog , setOpenDialog]= useState<boolean>(false)

    const handleShare =()=>{
      if(ShareContent.trim()){

        share({
          author_id : user.id ,
          post_id  : postId  ,
          content : ShareContent
        })

      }
    }

    useEffect(()=>{
      if(isSuccess){
        setOpenDialog(false)
      }
    } , [setOpenDialog , isSuccess])
    

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog} >
      <DialogTrigger asChild>
        <Button
          // disabled={true}
          variant={"outline"}
          className="w-fit h-9 text-muted-foreground  flex justify-center items-center gap-3 "
        >
          
          <Send className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[25rem] rounded-md sm:max-w-[40rem]">
        <div className="flex flex-col justify-start items-start ">
      <HeaderPost
      address={null}
      content={''}
      created_at={undefined}
      minmal={true}
        MainUserProfileId={MainUserProfileId?.id! }
        share={true}
        postId={postId}
        author_id={user.id}
        user={user}
      />
      <input

      placeholder="Share the moment...."
      className="w-full bg-gray-100  border-b-2 border-t-0 border-l-0 my-4 border-r-0  border-gray-400 p-2 pb-1 py-4 pt-1  outline-none focus:outline-none"
      value={ShareContent}
      onChange={(e)=>setShareContent(e.target.value)}
      />
        <MinmalCard
        
          author_id={author_id}
          postId={postId}
          user={user}
          title={title}
          />
          </div>

        <DialogFooter className="flex justify-start flex-col sm:flex-row w-full gap-2 ">
          <DialogClose   disabled={isLoading}>{ 
          isLoading  ? 
          <LoaderCircle  className="animate-spin text-gray-600 w-4 h-4"/>
          :
          "Later"
          }</DialogClose>
          <Button disabled={isLoading} onClick={()=>handleShare()} >
          {isLoading  ? 
          <LoaderCircle  className="animate-spin text-gray-600 w-4 h-4"/>
          :
            "Share"
            }</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
