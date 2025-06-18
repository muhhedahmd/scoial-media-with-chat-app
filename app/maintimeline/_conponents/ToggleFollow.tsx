"use client"

import { Button } from "@/components/ui/button"
import { useFollowStateQuery, useToggleFollowerMutation } from "@/store/api/apiFollows"
import { Skeleton } from "@nextui-org/react"
import { Loader2 } from "lucide-react"

const ToggleFollow = ({
  MainUserProfileId,
  profileDataId,
}: {
  MainUserProfileId: number | undefined
  profileDataId: number | undefined
}) => {
  const { data: followState, isLoading: stateLoading } = useFollowStateQuery({
    main_user_id: MainUserProfileId!,
    author_user_id: profileDataId!,
  })

  const [toggle, { isLoading: LoadingToggle, isError: ErrorToggle }] = useToggleFollowerMutation()

  const handleFollow = () => {
    if (MainUserProfileId && profileDataId && followState?.state) {
      toggle({
        author_user_id: profileDataId,
        main_user_id: MainUserProfileId,
        state: followState?.state,
      })
    }
  }

  if (MainUserProfileId === profileDataId) return

  if (stateLoading) return <Skeleton className="w-20 h-10 bg-gray-200 rounded-md" />

  return (
    <div>
      {MainUserProfileId !== profileDataId ? (
        <Button
          disabled={LoadingToggle || stateLoading}
          onClick={() => handleFollow()}
          variant={
            followState?.state === "follow" ? "default" : followState?.state === "following" ? "ghost" : "secondary"
          }
        >
          {LoadingToggle || stateLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : followState?.state}
        </Button>
      ) : null}
    </div>
  )
}

export default ToggleFollow
