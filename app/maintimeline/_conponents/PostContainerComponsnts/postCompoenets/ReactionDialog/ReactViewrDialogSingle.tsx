import { useGetProfileQuery } from "@/store/api/apiProfile"
import { useGetUserQuery } from "@/store/api/apiUser"
import type { Profile, ReactionType } from "@prisma/client"
import { HeaderPostLoader } from "../Loaderes"

import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { UserIcon } from "lucide-react"
import { getColor, getEmoji } from "./ReactViewrDialog"
import ToggleFollow from "../../../ToggleFollow"

interface ReactViewrDialogSingleProps {
  author_id: number
  id: number
  post_id: number

  userId: number
  type: ReactionType
  created_at: Date
  updated_at: Date
  MainUserProfile: Profile
}

const ReactViewrDialogSingle = ({ MainUserProfile, author_id, userId, type }: ReactViewrDialogSingleProps) => {
  const { data: profileData, isLoading: profileLoading } = useGetProfileQuery({
    userId: author_id,
  })

  const { data: userData, isLoading: userloading } = useGetUserQuery({
    userId: author_id,
  })

  if (userloading || profileLoading) {
    return <HeaderPostLoader />
  }
  return (
    <div className=" flex justify-between items-center w-full">
      {profileData && userData && (
        <div className=" w-full flex justify-start items-center gap-3">
          {profileData?.profile_picture ? (
            <Image
              alt={`${userData?.first_name} ${userData?.last_name} Profile Picture`}
              // quality={70}
              src={profileData?.profile_picture || ""}
              width={40}
              height={40}
              className="p-1 object-cover w-14 rounded-full h-14 bg-gray-100 "
            />
          ) : (
            <div className="w-12 rounded-full h-12 bg-gray-300  flex justify-center items-center cursor-pointer">
              <UserIcon />
            </div>
          )}

          {!profileData ? (
            <div className="flex w-full justify-start items-start gap-2 flex-col">
              <Skeleton className="w-1/4 h-2 bg-gray-300" />
              <Skeleton className="w-1/5 h-2 bg-gray-300" />
            </div>
          ) : (
            <div className="flex w-full justify-start items-start  flex-col">
              {!userData.first_name || !userData?.last_name ? (
                <Skeleton className="w-1/4 h-2 mb-3 bg-gray-300" />
              ) : (
                <div className="flex justify-between items-center w-full">
                  <p className="">{userData?.first_name + " " + userData?.last_name}</p>
                </div>
              )}

              {!userData?.user_name ? (
                <Skeleton className="w-1/5 h-2 bg-gray-300" />
              ) : (
                <p className="text-muted-foreground">{"@" + userData?.user_name}</p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-start gap-3 items-center">
        <p className={getColor(type)}>{getEmoji(type)}</p>

        <ToggleFollow MainUserProfileId={MainUserProfile.id} profileDataId={profileData?.id} />
      </div>
    </div>
  )
}

export default ReactViewrDialogSingle
