import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddNestedReplayMutation, useAddReplayMutation } from "@/store/api/apicomment";
import React, { useState } from "react";
interface ReplayAdditonProps {
  comment_id: number;
  post_id: number;
  userId: number;
  replay_id: number;
}

const NestedReplayAddation = ({
  userId,
  comment_id,
  post_id,
  replay_id,
  
}: ReplayAdditonProps) => {
  const [replay, setReplay] = useState("");

  const [addReplay, { data: data, isLoading }] = useAddNestedReplayMutation();

  const handleSubmit = () => {
    if (replay.trim()) {
      console.log({
        author_id: userId,
        comment_id: comment_id,
        content: replay.trim(),
      });
      addReplay({
        replayid :replay_id,
        author_id: userId,
        comment_id: comment_id,
        content: replay.trim(),
        post_id: post_id,
      });
      // console.log(isLoading , isError ,data ,
      // )
    }
  };
  return (
    <form className=" flex w-1/2 gap-3 justify-start items-center">
      <input
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

export default NestedReplayAddation;
