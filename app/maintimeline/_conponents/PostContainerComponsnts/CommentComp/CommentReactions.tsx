import Tip from "@/app/_componsents/Tip";
import { useGetReactionCommentsQuery } from "@/store/api/apicomment";
import React, { useMemo } from "react";

type EmojiCount = {
  emoji: string;
  len: number;
};

const CommentReactions = ({ comment_id }: { comment_id: number }) => {
  const { data: commentsReactions } = useGetReactionCommentsQuery({
    comment_id: comment_id,
  });
  const emojis = commentsReactions?.map((re) => re.emoji);

  const memo = useMemo(() => {
    const reducer = emojis?.reduce<EmojiCount[]>((prev, cur) => {
      const isFound = prev.findIndex((e) => e.emoji === cur);
      if (isFound !== -1) {
        prev[isFound].len += 1;
      } else {
        prev.push({
          emoji: cur,
          len: 1,
        });
      }
      return prev;
    }, []);

    return reducer;
  }, [emojis]);

  return (
    <div className="flex gap-2">
      {memo?.map(({ emoji, len }, idx) => (
        <div
          className="relative bg border-2 gap-[.4rem] px-[6px] rounded-[15px] border-gray-300  flex bg-[#f7f7f7] items-center justify-center"
          key={idx}
        >
          <Tip trigger={      <span className="">{emoji}</span>} info={len} />
          <span>{len > 9 ? "+9" : len}</span>
        </div>
      ))}
    </div>
  );
};

export default CommentReactions;
