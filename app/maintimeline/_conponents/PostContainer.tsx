"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import PostCreation from "./PostCreation"
import Posts from "./PostContainerComponsnts/Posts"
import type { Profile, User } from "@prisma/client"
import { setPostsPagination } from "@/store/Reducers/pagganitionSlice"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch } from "@/store/store"
import { useGetPostsQuery } from "@/store/api/apiSlice"
import { Card } from "@/components/ui/card"

interface PostContainerProps {
  user: User
  isLoadingProfile: boolean
  MainUserProfile: Profile | any
}

const PostContainer = ({ isLoadingProfile, MainUserProfile, user }: PostContainerProps) => {
  const dispatch = useDispatch<AppDispatch>()

  const { skip, take } = useSelector((state: any) => state.pagination.posts)
  const {
    data: FetchPostData,
    isLoading: isLoadingFetch,
    isFetching,
  } = useGetPostsQuery({
    pgnum: skip,
    pgsize: take,
  })

  const [isScrolled, setIsScrolled] = useState(false)

  const handleScroll = useCallback(() => {
    if (isFetching || !FetchPostData?.hasMore) return

    // Check if user has scrolled down 520px for the isScrolled state
    setIsScrolled(window.scrollY > 520)

    // Check if user has reached bottom of page
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
    const clientHeight = document.documentElement.clientHeight || window.innerHeight

    if (scrollTop + clientHeight + 5 >= scrollHeight) {
      dispatch(setPostsPagination({ skip: skip + 1, take }))
    }
  }, [isFetching, FetchPostData?.hasMore, dispatch, skip, take])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-md bg-white dark:bg-slate-900">
        <PostCreation
          isScrolled={isScrolled}
          isLoadingProfile={isLoadingProfile}
          profile={MainUserProfile}
          user={user}
        />
      </Card>

      <div className="space-y-4 pr-2">
        <Posts
          isScrolled={isScrolled}
          isLoadingFetch={isLoadingFetch}
          FetchPostData={FetchPostData}
          MainUserProfile={MainUserProfile}
          user={user}
        />
      </div>
    </div>
  )
}

export default PostContainer