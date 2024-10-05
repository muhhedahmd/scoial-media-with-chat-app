import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {

  useAddReplayMutation,

} from "@/store/api/apicomment";
import React, { useState } from "react";
import InputWithAndHastags from "../../../InputWithAndHastags";
import { parseDataType } from "../CommentAddation";

interface ReplayAdditonProps {
  comment_id: number;
  post_id: number;
  userId: number;
}

const ReplayAdditon = ({ userId, comment_id, post_id }: ReplayAdditonProps) => {
  const [parsedData, setParsedData] = useState<parseDataType>({
    mentions: [] as Array<{ value: string; startIndex: number; endIndex: number; id :number }>,
    hashtags: [] as Array<{ value: string; startIndex: number; endIndex: number;  id : number}>,
    ignoredMentions: [] as Array<{ value: string; startIndex: number; endIndex: number; }>,
    regularTexts: [] as Array<{ text: string; startIndex: number; endIndex: number; }>,
    fullText: "",
  });
  const [replay, setReplay] = useState("");

  const [addReplay, { data: data, isLoading }] = useAddReplayMutation();

  const handleSubmit = () => {
    if (replay.trim()) {
      console.log({
        author_id: userId,
        comment_id: comment_id,
        content: replay.trim(),
      });
      addReplay({
        parsedData : JSON.stringify(parsedData),
        author_id: userId,
        comment_id: comment_id,
        content: replay.trim(),
        post_id: post_id,
      });
      setReplay("");

    }
  };
  return (
    <form className="md:ml-[-70px]   mt-3 ml-0 flex w-3/4 gap-3 justify-start items-center">
    <InputWithAndHastags
    disabled={isLoading}
    placeholder="Enter your comment"
    setVal={setReplay}
    val={replay}
    setParsedData={setParsedData}
    parsedData={parsedData}
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
