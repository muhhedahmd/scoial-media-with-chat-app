import ReactionReactionOptions from "./postCompoenets/Reaction&ReactionOptions"
import ContentPost from "./postCompoenets/ContentPost"
import Comments from "./CommentComp/Comments"
import SharePostCard from "./postCompoenets/ShareComp/SharePostCard"
import HeaderPost from "./postCompoenets/HeaderPost"
import type { shapeOfPostsRes } from "@/app/api/posts/route"
import type { Profile, User } from "@prisma/client"
import type { UserProfile } from "@/store/api/apiProfile"
import { nanoid } from "@reduxjs/toolkit"
import { Card } from "@/components/ui/card"

const Renderposts = ({
  posts,
  user,
  isMessageOpen,
  MainUserProfile,
}: {
  posts: shapeOfPostsRes[] | undefined
  user: User
  isMessageOpen:
    | {
        open: boolean
        id: number | null
      }
    | undefined
  MainUserProfile: (Profile & UserProfile) | undefined | UserProfile
}) => {
  return (
    <>
      {posts?.map(({ author_id, created_at, updated_at, title, address, id, shared, parentId, parent }, i) => {
        if (!id || !user?.id) return null
        if (shared && parentId && parent) {
          return (
              <Card key={nanoid(10) + id} className="overflow-hidden border-none shadow-md ">
              <SharePostCard
                parentAddress={parent.parentAddress}
                main_postId={id}
                shared_author_id={author_id}
                title={title || ""}
                user={user}
                sharedAddress={shared.address}
                sharedContent={shared.content}
                main_created_at={created_at}
                main_updated_at={updated_at}
                Post_parent_id={parentId}
                parent_author_id={parent.parent_author_id}
                parentPostCreatedAt={parent.created_at}
                parentPostUpdatedAt={parent.updated_at}
                isMessageOpen={isMessageOpen}
                MainUserProfile={MainUserProfile as unknown as any}
                parentTitle={parent.parentTitle}
              />
            </Card>
          )
        }
        return (
          <Card id={`${id}`} key={i} className="  overflow-hidden w-full  shadow-md ">
            <div className="p-4">
              <HeaderPost 
                address={address}
                content={title}
                MainUserProfileId={MainUserProfile?.id}
                postId={id}
                author_id={author_id}
                user={user}
                created_at={created_at}
              />
              <div className="mt-3">
                <ContentPost postId={id} content={title || ""} />
                <ReactionReactionOptions
                  created_at={created_at}
                  user={user}
                  MainUserProfile={MainUserProfile as unknown as any}
                  userId={user.id}
                  postId={parentId ? parentId : id}
                  title={parent?.parentTitle ? parent?.parentTitle : title || ""}
                  author_id={parent?.parent_author_id ? parent?.parent_author_id : author_id}
                />
                {isMessageOpen?.id === id && (
                  <div className="mt-4 pt-4 border-t dark:border-slate-800">
                    <Comments post_id={id} author_id={author_id} userId={user.id} />
                  </div>
                )}
              </div>
            </div>
          </Card>
        )
      })}
    </>
  )
}

export default Renderposts
