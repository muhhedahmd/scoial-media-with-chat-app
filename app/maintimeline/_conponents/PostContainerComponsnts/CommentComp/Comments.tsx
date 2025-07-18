import { LoaderCircle } from "lucide-react"
import CommentItem from "./CommentItem"
import { useGetCommentQuery } from "@/store/api/apicomment"
import { useSelector } from "react-redux"

import CommentAddation from "./CommentAddation"

interface CommentsProps {
  post_id: number
  userId: number
  author_id: number
  hideAddition?: boolean
}

const Comments = ({ post_id, userId, author_id, hideAddition }: CommentsProps) => {
  const { skip, take } = useSelector((state: any) => state.pagination.comments)

  console.log({ post_id, userId })

  const {
    data: CommentsData,
    isLoading: commentLoading,
    error: commentError,
  } = useGetCommentQuery({
    comment_skip: skip,
    comment_take: take,

    post_id: post_id,
  })
  if (commentLoading) {
    ;<div className="flex justify-center mt-4 text-gray-500">
      <LoaderCircle className="animate-spin" />
    </div>
  } else
    return (
      <section className="w-full mt-3">
        <div className="w-full  md:p-4 p-0 space-y-6 mt-2 rounded-lg">
          {CommentsData?.map((commentx) => {
            return (
              <div className="w-full" key={commentx.id}>
                <CommentItem
                  author_id_comment={commentx.author_id}
                  post_id_from_comment={commentx.post_id}
                  post_id={post_id}
                  userId={userId}
                  comment={commentx}
                  hideAddition={hideAddition}
                />
              </div>
            )
          })}
          {hideAddition ? null : <CommentAddation userId={userId} postId={post_id} />}
        </div>
      </section>
    )
}

export default Comments
