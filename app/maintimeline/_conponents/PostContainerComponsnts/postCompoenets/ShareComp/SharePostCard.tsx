import React from "react";
import HeaderPost from "../HeaderPost";
import ContentPost from "../ContentPost";
import { Profile, User } from "@prisma/client";
import ReactionReactionOptions from "../Reaction&ReactionOptions";
import Comments from "../../CommentComp/Comments";

const SharePostCard = ({
  main_postId,
  user,
  shared_author_id,
  title,

  main_created_at,
  MainUserProfile,
  main_updated_at,
  Post_parent_id,
  parent_author_id,
  sharedContent,
  parentPostCreatedAt,
  parentPostUpdatedAt,
  isMessageOpen,
  parentTitle,
}: {
  isMessageOpen:
    | {
        open: boolean;
        id: number | null;
      }
    | undefined;
  main_postId: number;
  shared_author_id: number;
  title: string;
  Post_parent_id: number;
  user: User;
  main_created_at: Date;
  main_updated_at: Date;
  MainUserProfile: Profile;
  parent_author_id: number;
  sharedContent: string | null;
  parentPostCreatedAt: Date;
  parentPostUpdatedAt: Date;
  parentTitle: string;
}) => {
  return (
    <div
      id={`${main_postId}`}
      className={`expanded-delay-comment-${main_postId} p-3 w-full pl-4 shadow-sm bg-white border-2 
      border-[#f9f9f9] rounded-md flex flex-col justify-start items-start`}
    >
      <HeaderPost
        share={true}
        postId={main_postId}
        author_id={shared_author_id}
        user={user}
        created_at={main_created_at}
      />

      <div
        className="w-[91.5%]
      
       pr-3 flex justify-start items-start flex-col"
        style={{
          margin: "-10px 0 10px 68px",
        }}
      >
        <ContentPost postId={main_postId} content={sharedContent || ""} />
      </div>

      <div
        className="w-[87%] m-auto p-4 flex justify-start items-start flex-col "
        style={{
          border: "1px solid rgb(204, 204, 204)",
          borderRadius: " 13px",
        }}
      >
        <HeaderPost
          postId={Post_parent_id}
          author_id={parent_author_id}
          user={user}
          created_at={parentPostCreatedAt}
        />
        <div
          style={{
            margin: "0 0 0 68px",
          }}
        >
          <ContentPost postId={Post_parent_id} content={parentTitle || ""} />
        </div>
      </div>
      <div className="ml-[65px] w-[92%] ">
        <ReactionReactionOptions
          created_at={main_created_at}
          user={user}
          
          MainUserProfile={MainUserProfile}
          userId={user.id}
          author_id={shared_author_id}
          postId={main_postId}
          title={title}
          parentTitle={parentTitle || ""}
          Post_parent_id={Post_parent_id}
          parent_author_id={parent_author_id}
        />
        {isMessageOpen?.id === main_postId ? (
          <Comments
            post_id={main_postId}
            author_id={shared_author_id}
            userId={user.id}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default SharePostCard;
