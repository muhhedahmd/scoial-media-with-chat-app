import type { shapeOfReplies } from "@/app/api/comment/replay/route"
import { useGetUserQuery } from "@/store/api/apiUser"

const RepliedTo = ({
  parentId,
  mainReps,
}: {
  mainReps: shapeOfReplies[]
  parentId: number
}) => {
  const findAuthor = mainReps?.filter((rep) => (rep.id === parentId ? rep.author_id : null))[0]?.author_id!
  console.log({
    mainReps,
    findAuthor,
  })

  const { data: parentData, isLoading: loadingParent } = useGetUserQuery({
    userId: +findAuthor,
  })

  // const { data: childData, isLoading: loadingChild } = useGetUserQuery({
  //   userId: +author_id_child,
  // });

  // if (loadingChild || loadingParent) {
  //   return <div>Loading...</div>;
  // }

  return <div className="text-sm text-muted-foreground ">{parentData && <p>replied to @{parentData.user_name}</p>}</div>
}

export default RepliedTo
