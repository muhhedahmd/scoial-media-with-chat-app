import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAddCommentMutation,
  useAddReplayMutation,
  useGetRepliesQuery,
} from "@/store/api/apicomment";
import { useGetUserQuery } from "@/store/api/apiUser";
import React, { useState } from "react";

interface ReplayAdditonProps {
  comment_id: number;
  post_id: number;
  userId: number;
}

const ReplayAdditon = ({ userId, comment_id, post_id }: ReplayAdditonProps) => {
  const [replay, setReplay] = useState("");

  const [addReplay, { data: data, isLoading }] = useAddReplayMutation();
  const {} = useGetUserQuery

  const handleSubmit = () => {
    if (replay.trim()) {
      console.log({
        author_id: userId,
        comment_id: comment_id,
        content: replay.trim(),
      });
      addReplay({
        author_id: userId,
        comment_id: comment_id,
        content: replay.trim(),
        post_id: post_id,
      });
      setReplay("");
      // console.log(isLoading , isError ,data ,
      // )
    }
  };
  return (
    <form className=" flex w-1/2 mt-3 gap-3 justify-start items-center">
      <Input
        disabled={isLoading}
        placeholder="Enter your comment"
        onChange={(e) => setReplay(e.target.value)}
        value={replay}
        className="w-3/4"
      />
      <Button
        variant={"ghost"}
        disabled={isLoading}
        type="button"
        className="w-1/3"
        onClick={handleSubmit}
      >
        replay
      </Button>
    </form>
  );
};

export default ReplayAdditon;
