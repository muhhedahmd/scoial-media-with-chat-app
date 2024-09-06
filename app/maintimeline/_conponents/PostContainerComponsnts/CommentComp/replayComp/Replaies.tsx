import {
  useGetRepliesLikesQuery,
  useGetRepliesQuery,
} from "@/store/api/apicomment";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import ReplayItem from "./replayItem";

interface ReplaiesProps {
  comment_id: number;
  MainUserId: number;
  post_id: number;
  author_comment: number
}

const Replaies = ({ comment_id, post_id, author_comment, MainUserId }: ReplaiesProps) => {
  const { skip, take } = useSelector((state: any) => state.pagination.replies);
  const [focused, setFocused] = useState<number | null>(null);
  const [openReplay, setOpenReplay] = useState<number | null>(null);
  const [level, setLevel] = useState<number>(0);

  const {
    data: data,
    isLoading,
    isFetching,
  } = useGetRepliesQuery({
    comment_id: comment_id,
    replayTake: 1000,
    replaySkip: 0,
  });

  if (isLoading || isFetching) {
    return <div>loading...</div>;
  }

  return (
    <div className="ml-1 flex flex-col justify-start items-center gap-1">
      {data?.replay &&
        data.replay.map((rep ) => {
          return (
            <ReplayItem
            mainReps={data.replay}
            author_comment={author_comment}
            rep={rep}
            key={rep.id}
            MainUserId={ MainUserId}
            comment_id={comment_id}
            post_id={post_id}
            focused={focused}
            setFocused={setFocused}
            openReplay={openReplay}
            setOpenReplay={setOpenReplay}
            level={level}
            setLevel={setLevel}

            
            />
          );
        })}
    </div>
  );
};

export default Replaies;
