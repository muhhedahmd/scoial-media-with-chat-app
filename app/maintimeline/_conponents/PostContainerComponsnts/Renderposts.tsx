import React from "react";
import ReactionReactionOptions from "./postCompoenets/Reaction&ReactionOptions";
import ContentPost from "./postCompoenets/ContentPost";
import Comments from "./CommentComp/Comments";
import SharePostCard from "./postCompoenets/ShareComp/SharePostCard";
import HeaderPost from "./postCompoenets/HeaderPost";
import { shapeOfPostsRes } from "@/app/api/posts/route";
import { Profile, User } from "@prisma/client";
import { UserProfile } from "@/store/api/apiProfile";
import { nanoid } from "@reduxjs/toolkit";

const Renderposts = ({
  posts,
  user,
  isMessageOpen,
  MainUserProfile,
}: {
  posts: shapeOfPostsRes[] | undefined;
  user: User;
  isMessageOpen:
    | {
        open: boolean;
        id: number | null;
      }
    | undefined;
  MainUserProfile: Profile & UserProfile| undefined | UserProfile  ;
}) => {
  return (
    <>
      {posts?.map(
        (
          {
            author_id,
            created_at,
            updated_at,
            title,
            address , 

            id,
            shared,
            parentId,
            parent,
          },
          i
        ) => {
          if (!id || !user?.id) return null;
          if (shared && parentId && parent) {
        
            return (
              <SharePostCard
              parentAddress={parent.parentAddress}
                main_postId={id}
                shared_author_id={author_id}
                title={title || ""}
                user={user}
                key={nanoid(10)+id}
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
            );
          }
          return (
            <div
              id={`${id}`}
              key={i}
              className={`bg-white w-[99%] md:m-0  expanded-delay-comment-${id} p-3 md:w-full pl-4 shadow-sm  border-2 
                border-[#f9f9f9] rounded-md flex flex-col justify-start items-start`}
            >
              <HeaderPost
              address= {address}
              content={title}
                MainUserProfileId={MainUserProfile?.id}
                postId={id}
                author_id={author_id}
                user={user}
                created_at={created_at}
              />
              <div className="w-full pr-3 flex justify-start items-start flex-col">
                <ContentPost postId={id} content={title || ""} />
                <ReactionReactionOptions
                  created_at={created_at}
                  user={user}
                  MainUserProfile={MainUserProfile as unknown as any}
                  userId={user.id}
                  postId={parentId ? parentId : id}
                  title={
                    parent?.parentTitle ? parent?.parentTitle : title || ""
                  }
                  author_id={
                    parent?.parent_author_id
                      ? parent?.parent_author_id
                      : author_id
                  }
                />
                {isMessageOpen?.id === id ? (
                  <Comments
                    post_id={id}
                    author_id={author_id}
                    userId={user.id}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          );
        }
      )}
    </>
  );
};

export default Renderposts;
