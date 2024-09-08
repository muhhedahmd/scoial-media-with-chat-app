import React from "react";
import Interactions from "./Interactions";
import InteractionButtons from "./InteractionButtons";
import { useGetPostReactionsQuery } from "@/store/api/apiSlice";
import { Profile, User } from "@prisma/client";

interface ReactionReactionOptionsProps {
  postId: number;
  author_id: number;
  userId: number;
  MainUserProfile: Profile;
  created_at :Date
  title:string
  user:User
  parentTitle? :string 
Post_parent_id? :number 
parent_author_id? : number 


}

const ReactionReactionOptions = ({
  author_id,
  MainUserProfile,
  userId,
  postId,
  created_at ,
  title,
  user,
  Post_parent_id ,
  parentTitle ,
  parent_author_id,

}: ReactionReactionOptionsProps) => {
  const { data, isLoading } = useGetPostReactionsQuery({post_id :postId});
  const d = data as any
  console.log({
    data: d,
    author_id,
    postId
  })      

  return (
    <>
      <Interactions
        MainUserProfile={MainUserProfile}
        author_id={author_id}
        data={data }
        isLoading={isLoading}
        postId={postId}
      />
      <InteractionButtons
    Post_parent_id={Post_parent_id}
parentTitle={parentTitle}
parent_author_id={parent_author_id}


      created_at={created_at}
      title={title}
      user={user}

        userId={userId}
        isLoading={isLoading}
        data={data }
        author_id={author_id}
        postId={postId}
      />
    </>
  );
};

export default ReactionReactionOptions;
