import React from "react";
import HeaderPost from "../HeaderPost";
import ContentPost from "../ContentPost";
import { User } from "@prisma/client";

const SharePostCard = ({
  postId,
  user,
  author_id,
  title,
}: {
  postId: number;
  author_id: number;
  title: string;

  user: User;
}) => {
  return (

      <div
        id={`${postId}`}
        className={`expanded-delay-comment-${postId} p-3 w-full pl-4 shadow-sm bg-white border-2 border-[#f9f9f9] rounded-md flex flex-col justify-start items-end`}
      >
        <HeaderPost
          share={true}
          postId={postId}
          author_id={author_id}
          user={user}
        />
        <div className="w-[91.5%] pr-3 flex justify-start items-start flex-col">
          <ContentPost postId={postId} content={title} />
        </div>
      </div>
  );
};

export default SharePostCard;
