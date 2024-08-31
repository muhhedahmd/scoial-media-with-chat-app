import React from "react";
import Interactions from "./Interactions";
import InteractionButtons from "./InteractionButtons";
import { useGetPostReactionsQuery } from "@/store/api/apiSlice";
import { Profile } from "@prisma/client";

interface ReactionReactionOptionsProps {
  postId: number;
  author_id: number;
  userId: number;
  MainUserProfile: Profile;
}

const ReactionReactionOptions = ({
  author_id,
  MainUserProfile,
  userId,
  postId,
}: ReactionReactionOptionsProps) => {
  const { data, isLoading } = useGetPostReactionsQuery(postId);

  return (
    <>
      <Interactions
        MainUserProfile={MainUserProfile}
        author_id={author_id}
        data={data || []}
        isLoading={isLoading}
        postId={postId}
      />
      <InteractionButtons
        userId={userId}
        isLoading={isLoading}
        data={data || []}
        author_id={author_id}
        postId={postId}
      />
    </>
  );
};

export default ReactionReactionOptions;
