"use client"

import { Skeleton } from "@/components/ui/skeleton"
import type { Profile } from "@prisma/client"
import ReactViewrDialog from "./ReactionDialog/ReactViewrDialog"
import type { reactionType } from "@/app/api/posts/reactions/route"
import { Button } from "@/components/ui/button"
import { Heart, ThumbsUp, Laugh } from "lucide-react"

interface InteractionsProps {
  postId: number
  isLoading: boolean
  data: reactionType[]
  author_id: number
  userId: number
  MainUserProfile: Profile
}

const Interactions = ({ userId, author_id, MainUserProfile, postId, data, isLoading }: InteractionsProps) => {
  const uniqueReactions = Array?.from(new Set(data?.map((item) => item.type)))

  if (isLoading) {
    return (
      <div className="flex items-center mt-4">
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return null
  }

  // Get reaction counts
  const reactionCounts = data.reduce((acc: Record<string, number>, reaction) => {
    acc[reaction.type] = (acc[reaction.type] || 0) + 1
    return acc
  }, {})

  // Get reaction icons
  const getReactionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "like":
        return <ThumbsUp className="h-4 w-4 text-blue-500" />
      case "love":
        return <Heart className="h-4 w-4 text-red-500" />
      case "haha":
        return <Laugh className="h-4 w-4 text-yellow-500" />
      default:
        return <ThumbsUp className="h-4 w-4 text-blue-500" />
    }
  }

  console.log({
    uniqueReactions ,
    data
  })
  return (
    <ReactViewrDialog
      MainUserProfile={MainUserProfile}
      author_id={author_id}
      data={data}
      uniqe={uniqueReactions}
      userId={userId}
    >
      <Button
        variant="ghost"
        size="sm"
        className="px-2 h-8 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <div className="flex items-center">
          <div className="flex -space-x-1 mr-2">
            {uniqueReactions.map((type, index) => (
              <div
                key={index}
                className="rounded-full bg-white dark:bg-slate-900 p-0.5 border border-white dark:border-slate-900"
              >
                {getReactionIcon(type)}
              </div>
            ))}
          </div>
          <span>{data.length}</span>
        </div>
      </Button>
    </ReactViewrDialog>
  )
}

export default Interactions
