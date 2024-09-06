import React, { useState, useEffect, useRef, useCallback } from "react";
import { post, Profile, User } from "@prisma/client";
import { useGetPostsQuery } from "@/store/api/apiSlice";
import {
  ContentPostLoader,
  HeaderPostLoader,
  InteractionButtonsLoader,
  InteractionsLoader,
} from "./postCompoenets/Loaderes";
import HeaderPost from "./postCompoenets/HeaderPost";
import ContentPost from "./postCompoenets/ContentPost";
import ReactionReactionOptions from "./postCompoenets/Reaction&ReactionOptions";
import { useMessageOpen } from "../../layout";
import Comments from "./CommentComp/Comments";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setPostsPagination } from "@/store/Reducers/pagganitionSlice";

const Posts = ({
  user,
  MainUserProfile,
}: {
  user: User;
  MainUserProfile: Profile;
}) => {
  
  const postsContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  
  const { skip, take } = useSelector((state :any ) => state.pagination.posts);
  const {
    data: FetchPostData,
    isLoading: isLoadingFetch,
    isFetching,
  } = useGetPostsQuery({
    pgnum: skip,
    pgsize: take,
  });
  const { isMessageOpen } = useMessageOpen();


  const handleScroll = useCallback(() => {
    if (!postsContainerRef.current || isFetching || !FetchPostData?.hasMore)
      return;

    const { scrollTop, scrollHeight, clientHeight } = postsContainerRef.current;

    if (scrollTop + clientHeight + 5 >= scrollHeight) {
      dispatch(setPostsPagination({ skip: skip + 1,  take }));

    }
  }, [isFetching, FetchPostData?.hasMore, dispatch, skip, take]);

  useEffect(() => {
    const container = postsContainerRef.current;

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  if (isLoadingFetch) {
    return (
      <div
        ref={postsContainerRef}
        className="h-4/5 w-full gap-3 flex flex-col justify-start items-start overflow-y-auto"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="p-3 w-full shadow-sm bg-white flex flex-col justify-start items-start"
          >
            <HeaderPostLoader />
            <ContentPostLoader />
            <InteractionsLoader />
            <InteractionButtonsLoader />
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div
        ref={postsContainerRef}
        className=" h-4/5 w-full gap-3 flex flex-col justify-start items-start overflow-y-auto"
      >
        {FetchPostData?.posts?.map(
          ({ author_id, created_at, title, id }, i) => {
            if (!id || !user?.id) return null;
            return (
              <div
                id={`${id}`}
                key={i}
                className={`expanded-delay-comment-${id} p-3 w-full shadow-sm bg-white flex flex-col justify-start items-end`}
              >
                <HeaderPost
                  postId={id}
                  author_id={author_id}
                  user={user}
                  created_at={created_at}
                />
                <div className="w-[91.5%] pr-3 flex justify-start items-start flex-col">
                  <ContentPost postId={id} content={title} />
                  <ReactionReactionOptions
                  created_at={created_at}
                  title={title}
                  user={user}
                    MainUserProfile={MainUserProfile}
                    userId={user.id}
                    postId={id}
                    author_id={author_id}
                  />
                  {isMessageOpen?.id === id ? <Comments post_id={id}
                  author_id={author_id}
                  userId={user.id} /> : ""}
                </div>
              </div>
            );
          }
        )}
      </div>
    );
  }
};

export default Posts;
