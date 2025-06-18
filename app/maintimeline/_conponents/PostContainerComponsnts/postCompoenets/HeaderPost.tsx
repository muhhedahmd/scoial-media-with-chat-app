"use client"

import { Skeleton } from "@/components/ui/skeleton"
import type { Address, User } from "@prisma/client"
import { useGetPostImagesQuery, useGetProfilePostQuery } from "@/store/api/apiSlice"
import { MapPin } from "lucide-react"
import { formatDistance } from "date-fns"
import MenuPostOption from "./MenuPostOption/MenuPostOption"
import ToggleFollow from "../../ToggleFollow"
import BluredImage from "@/app/_components/ImageWithPlaceholder"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"

interface HeaderPostProps {
  postId: number
  user: User
  created_at?: Date
  author_id: number
  MainUserProfileId?: number
  share?: boolean
  content: string | null
  address: Address | null
  minmal?: boolean
}

const HeaderPost = ({
  postId: PostId,
  user,
  created_at,
  author_id,
  MainUserProfileId,
  share,
  content,
  address,
  minmal = false,
}: HeaderPostProps) => {
  const { data: profileData, isLoading, error, isError } = useGetProfilePostQuery({ PostId, author_id })

  const blurProfile = profileData?.profilePictures.find((x) => x.type === "profile")

  const date = created_at ? formatDistance(new Date(created_at), new Date()) : null

  const shortTime = date
    ? date
        .replace("minutes", "min")
        .replace("minute", "min")
        .replace("hours", "hrs")
        .replace("hour", "hr")
        .replace("days", "day")
        .replace("day", "day")
        .replace("weeks", "week")
        .replace("week", "week")
        .replace("months", "mo")
        .replace("month", "mo")
        .replace("years", "yr")
        .replace("year", "yr")
        .replace("about", "")
    : null

  const { data: postImages, isLoading: isLoadingPostImages, isError: isErrorPostImages } = useGetPostImagesQuery(PostId)

  if (isLoading) {
    return (
      <div className="flex items-center space-x-3 mb-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start space-x-3">
      <Link href={`/profile/${author_id}`} className="flex-shrink-0">
        {profileData?.profile_picture ? (
          <BluredImage
            blurhash={blurProfile?.HashBlur || ""}
            alt={`${profileData?.user?.first_name} ${profileData?.user?.last_name} Profile Picture`}
            quality={80}
            imageUrl={profileData?.profile_picture || ""}
            width={40}
            height={40}
            className="rounded-full h-10 w-10 object-cover"
          />
        ) : (
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
              {profileData?.user?.first_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <Link href={`/profile/${author_id}`} className="font-medium text-slate-900 dark:text-white hover:underline">
              {share
                ? `${profileData?.user?.first_name} ${profileData?.user?.last_name}`
                : profileData?.user?.id === user?.id
                  ? "You"
                  : `${profileData?.user?.first_name} ${profileData?.user?.last_name}`}
            </Link>
            {shortTime && <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">{shortTime}</span>}
            {address && (
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                <span>
                  {address.city}, {address.country}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1">
            {profileData?.user?.id !== user?.id && (
              <ToggleFollow MainUserProfileId={MainUserProfileId!} profileDataId={profileData.id} />
            )}

            {!minmal && (
              <MenuPostOption
                isLoadingImages={isLoadingPostImages}
                postLink=""
                initialPostData={{
                  title: content || "",
                  images: postImages?.map((img, i) => {
                    return {
                      ...img,
                    }
                  }),
                  mentions: null,
                  location: address,
                }}
                mainUserId={user.id}
                postId={PostId}
                authorId={author_id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderPost
