import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddCommentMutation } from "@/store/api/apicomment";
import React, { useState } from "react";
import InputWithAndHastags from "../../InputWithAndHastags";
import { SendHorizontalIcon } from "lucide-react";

export type parseDataType = {
  mentions: Array<{
    value: string;
    startIndex: number;
    endIndex: number;
    id: number;
  }>;
  hashtags: Array<
    | {
        value: string;
        startIndex: number;
        endIndex: number;
        id: number;
      }
    | undefined
  >;
  ignoredMentions: Array<{
    value: string;
    startIndex: number;
    endIndex: number;
  }>;
  regularTexts: Array<{
    text: string;
    startIndex: number;
    endIndex: number;
  }>;
  fullText: string;
};
interface CommentAddationProps {
  postId: number;
  userId: number;
}

const CommentAddation = ({ userId, postId }: CommentAddationProps) => {
  const [parsedData, setParsedData] = useState<parseDataType>({
    mentions: [] as Array<{
      value: string;
      startIndex: number;
      endIndex: number;
      id: number;
    }>,
    hashtags: [] as Array<{
      value: string;
      startIndex: number;
      endIndex: number;
      id: number;
    }>,
    ignoredMentions: [] as Array<{
      value: string;
      startIndex: number;
      endIndex: number;
    }>,
    regularTexts: [] as Array<{
      text: string;
      startIndex: number;
      endIndex: number;
    }>,
    fullText: "",
  });
  const [addComment, { isLoading }] = useAddCommentMutation();
  const [comment, setComment] = useState("");
  const handleSubmit = () => {
    if (comment) {
      console.log(parsedData);
      addComment({
        parsedData: JSON.stringify(parsedData),
        author_id: userId,
        post_id: postId,
        content: comment.trim(),
      });
      setComment("");
    }
  };
  return (
    <form className="flex w-full gap-3 justify-start items-center">
      <div className="add-comment flex justify-start items-center relative w-full">
        <InputWithAndHastags
          parsedData={parsedData}
          setParsedData={setParsedData}
          disabled={isLoading}
          placeholder="Enter your comment"
          setVal={setComment}
          val={comment}
          className="w-full bg-"
        />
        <Button
        variant={"ghost"}
          className="  cursor-pointer "
          disabled={isLoading}
          type="button"
          onClick={handleSubmit}
        >
          <SendHorizontalIcon className="stroke-gray-500" />
        </Button>

      </div>
    </form>
  );
};

export default CommentAddation;
