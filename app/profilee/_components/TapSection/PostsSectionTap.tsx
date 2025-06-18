'use client'

import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import Renderposts from "@/app/maintimeline/_conponents/PostContainerComponsnts/Renderposts"
import { useMessageOpen } from "@/context/comment"
import { useGetProfileQuery } from "@/store/api/apiProfile"
import { useGetPostsOfUserQuery } from "@/store/api/apiSlice"
import { User } from "@prisma/client"
import { AppDispatch, RootState } from "@/store/store"
import { setPaginationForTab, Taps } from "@/store/Reducers/pagganitionSlice"
import PostCreation from "@/app/maintimeline/_conponents/PostCreation"

export default function PostsSectionTap({
  CachedUser
}: {
  CachedUser: User
}) {
  const { isMessageOpen } = useMessageOpen()
  const dispatch = useDispatch<AppDispatch>()

  const {
    data: profileData,
    isLoading: isLoadingProfile,
  } = useGetProfileQuery({
    userId: CachedUser?.id,
  })

  const profiles = useSelector((state: RootState) => state.pagination.multiProfileMain.profiles)
  const id = CachedUser?.id

  // Use optional chaining to safely access nested properties
  const postPagination = profiles?.[id]?.[Taps.posts] || { skip: 0, take: 10 }

  const { data, isLoading } = useGetPostsOfUserQuery({
    skip: postPagination.skip,
    take: postPagination.take,
    userId: CachedUser.id,
  })

  useEffect(() => {
    if (data?.hasMore === false && id) {
      dispatch(setPaginationForTab({
        tab: Taps.posts,
        userId: id as unknown as string,
        skip: postPagination.skip,
        take: postPagination.take,
        stop: true
      }))
    }
  }, [CachedUser.id, data?.hasMore, dispatch, id, postPagination.skip, postPagination.take])

  if (!profileData || !CachedUser) return null

  return (
    <div className="w-full overflow-auto p-3 flex justify-start items-start gap-3 flex-col  text-black">
      <div className="w-full text-gray-700">
        <PostCreation
          isScrolled={false}
          profile={profileData as any}
          isLoadingProfile={isLoadingProfile}
          user={CachedUser}
        />
      </div>
      <Renderposts
        key={`singleUserPosts-Main-${CachedUser.id}`}
        MainUserProfile={profileData}
        isMessageOpen={isMessageOpen}
        posts={data?.posts || []}
        user={CachedUser}
      />
    </div>
  )
}