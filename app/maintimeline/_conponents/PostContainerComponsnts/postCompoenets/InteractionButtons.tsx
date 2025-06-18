"use client"

import { useCallback } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, Share2 } from "lucide-react"
import { ReactPoper } from "./ReactPoper"
import type { User } from "@prisma/client"
import ShareDialog from "./ShareComp/ShareDialog"
import type { reactionType } from "@/app/api/posts/reactions/route"
import SavePopup from "./SaveComp/SavePopup"
import { useMessageOpen } from "@/context/comment"
import { Skeleton } from "@/components/ui/skeleton"

interface InteractionButtonsProps {
  postId: number
  author_id: number
  isLoading: boolean
  data: reactionType[]
  userId: number
  created_at: Date
  title: string
  user: User
  parentTitle?: string
  Post_parent_id?: number
  parent_author_id?: number
}

const InteractionButtons = ({
  postId,
  author_id,
  data,
  userId,
  isLoading,
  created_at,
  title,
  user,
  Post_parent_id,
  parentTitle,
  parent_author_id,
}: InteractionButtonsProps) => {
  const findReactionsCallback = useCallback(() => {
    if (data) return data?.filter((react) => react.author_id === userId).map((r) => r.type)
  }, [userId, data])

  const { toggleMessageOpen, isMessageOpen } = useMessageOpen()
  const findReactions = findReactionsCallback()

  if (isLoading) {
    return (
      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-2">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
        <Skeleton className="h-9 w-10 rounded-md" />
      </div>
    )
  }

  const isCommentOpen = isMessageOpen?.id === postId && isMessageOpen.open

  return (
    <div className="flex justify-between items-center mt-4">
      <div className="flex space-x-2">
        <ReactPoper findReactions={findReactions || []} author_id={author_id} userId={userId} postId={postId} />

        <Button
          onClick={() => toggleMessageOpen(postId, !isCommentOpen)}
          variant="ghost"
          size="sm"
          className={cn(
            " dark:border-slate-800",
            isCommentOpen &&
              "bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-400",
          )}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
        </Button>

        <ShareDialog
          // author_id={author_id}
          author_id={parent_author_id ? parent_author_id : author_id}
          postId={Post_parent_id ? Post_parent_id : postId}
          created_at={created_at}
          title={parentTitle ? parentTitle : title}
          user={user}
        >
          <Button variant="ghost" size="sm" className="">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </ShareDialog>
      </div>

      <SavePopup userId={userId} postId={postId} />
    </div>
  )
}

// Import cn function
import { cn } from "@/lib/utils"

export default InteractionButtons
