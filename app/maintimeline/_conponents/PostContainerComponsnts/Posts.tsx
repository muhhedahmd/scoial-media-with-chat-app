import type React from "react"
import type { Profile, User } from "@prisma/client"

import { useMessageOpen } from "@/context/comment"
import Renderposts from "./Renderposts"
import type { shapeOfPostsRes } from "@/app/api/posts/route"
import { Loader2 } from "lucide-react"

const Posts = ({
  postsContainerRef,
  user,
  MainUserProfile,
  isLoadingFetch,
  FetchPostData,
  isScrolled,
}: {
  isScrolled: boolean
  isLoadingFetch: boolean
  FetchPostData:
    | {
        posts: shapeOfPostsRes[]
        hasMore: boolean
      }
    | undefined
  user: User
  MainUserProfile: Profile
  postsContainerRef: React.RefObject<HTMLDivElement>
}) => {
  const { isMessageOpen } = useMessageOpen()

  if (isLoadingFetch) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg shadow-md bg-white dark:bg-slate-900 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
            <div className="h-40 w-full bg-slate-200 dark:bg-slate-700 rounded mt-4"></div>
            <div className="flex justify-between mt-4">
              <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!FetchPostData || FetchPostData.posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900 rounded-lg shadow-md">
        <div className="w-16 h-16 mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-lg font-medium mb-2 dark:text-white">No posts yet</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          Start following people or create your first post to see content in your feed.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Renderposts
        user={user}
        isMessageOpen={isMessageOpen}
        MainUserProfile={MainUserProfile as unknown as any}
        posts={FetchPostData?.posts}
      />

      {FetchPostData.hasMore && (
        <div className="flex justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600 dark:text-emerald-400" />
        </div>
      )}
    </div>
  )
}

export default Posts
