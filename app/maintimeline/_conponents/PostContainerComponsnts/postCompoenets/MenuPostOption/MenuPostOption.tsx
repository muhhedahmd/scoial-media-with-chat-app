import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { toast } from "@/components/ui/use-toast";

import {
  Clipboard,
  Edit,
  Pin,
  Star,
  Save,
  Archive,
  AlertTriangle,
  EllipsisVertical,
} from "lucide-react";
import DeleteDialog from "./DeleteDialog";

import EditDialog from "./EditDialog";

export type initialPostData = {
  title: string;
  images: any[] | undefined;
  mentions: string[] | null;
  location: any | null;
};

interface MenuPostOptionProps {
  mainUserId: number;
  postId: number;
  authorId: number;
  postLink: string;
  initialPostData: initialPostData;
  isLoadingImages: boolean;
}

export default function MenuPostOption({
  isLoadingImages,
  mainUserId,
  postId,
  authorId,
  postLink,
  initialPostData,
}: MenuPostOptionProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const [editedPost, setEditedPost] = useState(initialPostData);
   
    useEffect(()=>{

    } , [initialPostData])

  const copyPostLink = () => {
    navigator.clipboard.writeText(postLink);
    toast({
      title: "Link copied",
      description: "Post link has been copied to clipboard.",
    });
    setIsPopoverOpen(false);
  };


  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="text-gray-800" size="icon">
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="grid gap-4">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={copyPostLink}
          >
            <Clipboard className="mr-2 h-4 w-4" />
            Copy Post link
          </Button>
          {mainUserId === authorId && (
            <>
              <DeleteDialog
                mainUserId={mainUserId}
                postId={postId}
                setIsPopoverOpen={setIsPopoverOpen}
              />
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Post
              </Button>
              <EditDialog
              setIsPopoverOpen={setIsPopoverOpen}
              authorId={authorId}
              postId={postId}
              editedPost={editedPost}
              initialPostData={initialPostData}
              isEditDialogOpen={isEditDialogOpen}
              setEditedPost={setEditedPost}
              setIsEditDialogOpen={setIsEditDialogOpen}
              />
            </>
          )}
          <Button variant="ghost" className="w-full justify-start hover:text-cyan-400 fill-cyan-400 text-cyan-400">
            <Pin className="mr-2 h-4 w-4 fill-cyan-400 text-cyan-400" />
            Pin Post
          </Button>
          {/* <Button variant="ghost" className="w-full justify-start">
            <Star className="mr-2 h-4 w-4" />
            Mark as Favorite
          </Button> */}
          {/* <Button variant="ghost" className="w-full justify-start">
            <Save className="mr-2 h-4 w-4" />
            Save Post
          </Button> */}
          {/* <Button variant="ghost" className="w-full justify-start">
            <Archive className="mr-2 h-4 w-4" />
            Archive Post
          </Button> */}
          {/* <Button variant="ghost" className="w-full justify-start">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Report Post
          </Button> */}
        </div>
      </PopoverContent>
    </Popover>
  );
}
