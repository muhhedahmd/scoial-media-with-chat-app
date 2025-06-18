import ContentPost from "../ContentPost"
import HeaderPost from "../HeaderPost"
import type { User } from "@prisma/client"
import { useGetProfileQuery } from "@/store/api/apiProfile"

interface MinmalCardProps {
  author_id: number
  postId: number
  user: User
  title: string
}

const MinmalCard = ({ author_id, postId, user, title }: MinmalCardProps) => {
  const { data: MainUserProfile, isLoading: status, isSuccess, isError } = useGetProfileQuery({ userId: user?.id })

  const { data: profileData, isLoading, error, isError: ErrorAuthor } = useGetProfileQuery({ userId: author_id })

  return (
    <div
      id={`${postId}`}
      className={`expanded-delay-comment-${postId} p-3 w-full pl-4 shadow-sm bg-white border-2 
    border-[#f9f9f9] rounded-md flex flex-col justify-start items-start`}
    >
      <div className="w-[95%] m-auto p-4 flex justify-start items-start flex-col ">
        <HeaderPost
          address={null}
          content={""}
          created_at={undefined}
          minmal={true}
          share={true}
          MainUserProfileId={MainUserProfile?.id!}
          postId={postId}
          author_id={author_id}
          user={user}
        />
        <div
          style={{
            margin: "0 0 0 68px",
          }}
        >
          <ContentPost minimal={true} postId={postId} content={title || ""} />
        </div>
      </div>
    </div>
  )
}

export default MinmalCard
