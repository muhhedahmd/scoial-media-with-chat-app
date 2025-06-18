"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { useDeletePostMutation } from "@/store/api/apiSlice"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const DeleteDialog = ({
  mainUserId,
  postId,
  setIsPopoverOpen,
}: {
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>
  mainUserId: number
  postId: number
}) => {
  const [open, setOpen] = useState(false)
  const [del, { isSuccess, isLoading, isError }] = useDeletePostMutation()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDialogTrigger = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDialogOpen(true)
  }
  const handleDelete = async () => {
    try {
      await del({
        postId: postId,
        userId: mainUserId,
      }).unwrap()
      setIsDialogOpen(false)
      setIsPopoverOpen(false)
    } catch (error) {
      console.error("Failed to delete post:", error)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Button variant="ghost" className="w-full justify-start text-red-600" onClick={handleDialogTrigger}>
        <Trash className="mr-2 h-4 w-4" />
        Delete Post
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your post and remove it from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteDialog
