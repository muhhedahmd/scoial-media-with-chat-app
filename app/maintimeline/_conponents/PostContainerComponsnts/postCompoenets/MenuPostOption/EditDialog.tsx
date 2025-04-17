import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import LocationSearch from "@/app/_components/locationComp/locationComp";
import ImageEditPost from "./ImageEditPost";
import ContentPost from "../ContentPost";
import { LocateOffIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { initialPostData } from "./MenuPostOption";
import { useEditPostMutation } from "@/store/api/apiSlice";
import { Spinner } from "@nextui-org/react";

const EditDialog = ({
  setIsPopoverOpen,
  editedPost,
  setEditedPost,
  initialPostData,
  setIsEditDialogOpen,
  isEditDialogOpen,
  postId,
  authorId,
}: {
  setIsPopoverOpen : React.Dispatch<React.SetStateAction<boolean>>
  authorId: number;
  postId: number;
  editedPost: initialPostData;
  setEditedPost: React.Dispatch<React.SetStateAction<initialPostData>>;
  initialPostData: initialPostData;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditDialogOpen: boolean;
}) => {
  const [editPost, { isLoading }] = useEditPostMutation();
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [submited, setSubmited] = useState<initialPostData>({
    title: "",
    location: "",
    images: [],
    mentions: [],
  });
  useEffect(() => {
    if (!editedPost.images) return;
    const orderedImages = editedPost.images.map((img, index) => ({
      ...img,
      order: index + 1, // Fix the order property
    }));
    setSubmited((prev) => ({ ...prev, images: orderedImages }));
  }, [editedPost]);

  const handleCloseAttempt = useCallback(() => {
    if (JSON.stringify(editedPost) !== JSON.stringify(initialPostData)) {
      setShowAlertDialog(true);
    } else {
      setIsEditDialogOpen(false);
    }
  }, [editedPost, initialPostData, setIsEditDialogOpen]);

  const confirmClose = useCallback(() => {
    setEditedPost(initialPostData);
    setIsEditDialogOpen(false);
    setShowAlertDialog(false);
  }, [initialPostData, setEditedPost, setIsEditDialogOpen]);

  const cancelClose = useCallback(() => {
    setShowAlertDialog(false);
  }, []);

  const handleEdit = async () => {
    if (!initialPostData.images || !submited.images) return;
    else {
      const formData = new FormData();

      const newImgs: {
        file: File;
        order: number;
      }[] = submited.images
        .filter((img) => img.new)
        .map(
          (
            img: {
              img_file: File;
              order: number;
            },
            i
          ) => {
            formData.append(`new_imgs-${i}`, img.img_file);
            formData.append(`order-new-imgs-${i}`, `${img.order}`);
            return {
              file: img.img_file,
              order: img.order,
            };
          }
        );
      formData.append("new_imgs_len", `${newImgs.length}`);

      const removedImgs = initialPostData.images
        .filter((imgx) => {
          if (submited?.images)
            return (
              submited?.images.findIndex((img) => img.id === imgx.id) === -1
            );
        })
        .map((e) => {
          return { id: e.id, public_id: e.public_id };
        });

      const orderJust = editedPost.images
        ?.filter((img) => {
          return !img.new ? img : null;
        })
        .map((img) =>
          submited.images?.findIndex((imgx) => imgx.id === img.id) !== -1
            ? {
                id: submited.images?.find((imgx) => imgx.id === img.id).id,
                order: submited.images?.find((imgx) => imgx.id === img.id)
                  .order,
              }
            : null
        );

      formData.append(
        "location",
        JSON.stringify({
          id: editedPost.location?.id,
          tag:
            !initialPostData.location && editedPost.location
              ? "add"
              : JSON.stringify(initialPostData.location) ===
                JSON.stringify(editedPost?.location)
              ? "same"
              : initialPostData.location && editedPost.location
              ? "update"
              : initialPostData.location && !editedPost.location
              ? "del"
              : null,
        })
      );
      if (editedPost.title !== initialPostData.title) {
        formData.append("title", editedPost.title);
        console.log({ "title Changed": editedPost.title });
      }
      formData.append("postId", `${postId}`);
      formData.append("authorId", `${authorId}`);
      formData.append("order_imgs", JSON.stringify(orderJust));
      formData.append("removed_imgs", JSON.stringify(removedImgs));
      submited.images
        .filter((img) => img.new)
        .forEach((img, index) => {
          // Append the file
          formData.append(`new_imgs[${index}][file]`, img.img_file);
          // Append the order
          formData.append(`new_imgs[${index}][order]`, img.order);
        });
      // Implement your edit logic here
      try {
        const editresponse = await editPost({
          formData: formData,
        });
        console.log({
          // editresponse,
          editedPost,
          submited
        });
        setIsEditDialogOpen(false)
        setIsPopoverOpen(false)
        

        // return editresponse;


      
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <>
      <Dialog open={isEditDialogOpen} onOpenChange={handleCloseAttempt}>
        <DialogContent className="max-w-max ">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
              Make changes to your post here. Click save when youre done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-start items-start flex-col">
            <div className="flex justify-center items-center gap-4 w-full">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={editedPost.title}
                onChange={(e) =>
                  setEditedPost((prev) => ({ ...prev, title: e.target.value }))
                }
                className="col-span-3"
              />
            </div>

            <div className="flex justify-start items-center gap-4 w-full">
              
              <Label htmlFor="location" className="text-right text-base">
                Location
              </Label>
              {editedPost.location?.id ? (
                <div className="flex justify-start items-start gap-2">
                  <LocationSearch
                    activeLocation={editedPost.location.id}
                    isEditing={true}
                    fullSelected={editedPost.location}
                    // setActiveLocation={setEditedPost}
                    setEditPost={setEditedPost}
                  />
                  <Button
                    onClick={() => {
                      setEditedPost((prev) => ({
                        ...prev,
                        location: null,
                      }));
                    }}
                    variant={"ghost"}
                  >
                    <LocateOffIcon className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <>
                  <LocationSearch
                    activeLocation={editedPost?.location?.id || null}
                    isEditing={true}
                    // fullSelected={editedPost?.location}
                    // setActiveLocation={setEditedPost}
                    setEditPost={setEditedPost}
                  />
                </>
              )}
            </div>


            <div className="flex justify-center items-center gap-4">
              <div className="flex  justify-center gap-2 items-center">
                <p className="text-right text-base">Images</p>
                <ImageEditPost
                  editedPost={editedPost}
                  setEditedPost={setEditedPost}
                />
              </div>
              <div className="flex justify-start gap-2  w-[18rem] py-2  overflow-x-auto  items-start">
                <ContentPost
                  editedPost={editedPost}
                  setEditedPost={setEditedPost}
                  postId={postId}
                  editableDialog={true}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isLoading}
              onClick={handleCloseAttempt}
            >
              {isLoading ? <Spinner className="w-4 h-4" /> : "Cancel"}
            </Button>
            <Button disabled={isLoading} onClick={handleEdit}>
              {isLoading ? <Spinner className="w-3 h-3" /> : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to close?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Closing will discard these changes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelClose}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClose}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EditDialog;
