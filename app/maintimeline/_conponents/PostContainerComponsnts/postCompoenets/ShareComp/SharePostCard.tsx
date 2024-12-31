import React from "react";
import HeaderPost from "../HeaderPost";
import ContentPost from "../ContentPost";
import { Address, Profile, User } from "@prisma/client";
import ReactionReactionOptions from "../Reaction&ReactionOptions";
import Comments from "../../CommentComp/Comments";

const SharePostCard = ({
  parentAddress ,
  main_postId,
  user,
  shared_author_id,
  title,
  sharedAddress ,
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
  parentAddress: Address | null
  sharedAddress : Address|null
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

      className={` w-[99%] m-auto md:m-0  expanded-delay-comment-${main_postId} p-3 md:w-full pl-4 shadow-sm  border-2 
      border-[#f9f9f9] rounded-md flex flex-col justify-start items-start bg-white`}
    >
      <HeaderPost
      
        MainUserProfileId={MainUserProfile?.id}
        share={true}
        postId={main_postId}
        author_id={shared_author_id}
        user={user}
        created_at={main_created_at} 
        content={null}
         address={null}    
          />

      <div
        className="w-[91.5%]
      
       pr-3 flex justify-start items-start flex-col"
        style={{
          // margin: "-10px 0 10px 68px",
        }}
      >
        <ContentPost postId={main_postId} content={sharedContent || ""} />
      </div>

      <div
        className="md:w-[87%] w-full m-auto p-4 flex justify-start items-start flex-col "
        style={{
          border: "1px solid rgb(204, 204, 204)",
          borderRadius: " 13px",
        }}
      >
        <HeaderPost
          MainUserProfileId={MainUserProfile.id}
          postId={Post_parent_id}
          author_id={parent_author_id}
          user={user}
          created_at={parentPostCreatedAt} 
          content={null}
         address={parentAddress}      
           />
        <div
        className="max-w-full mt-2"
        >

   
          <ContentPost share={true} postId={Post_parent_id} content={parentTitle || ""} />
        </div>
      </div>
      <div className=" ml-0 md:ml-[65px]  md:w-[92%]   w-full">
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
