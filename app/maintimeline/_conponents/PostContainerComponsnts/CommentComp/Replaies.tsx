import { useGetRepliesQuery } from "@/store/api/apicomment";
import React from "react";
import { useSelector } from "react-redux";
import CommentItem from "./CommentItem";
import { Avatar } from "@/components/ui/avatar";
import AvatarRep from "./AvatarRep";
import TimeStamp from "./TimeStamp";
import UserInfoHeader from "./UserInfoHeader";

interface ReplaiesProps {
  comment_id: number;
}

const Replaies = ({ comment_id }: ReplaiesProps) => {
  const { skip, take } = useSelector((state: any) => state.pagination.replies);
  const {
    data: data,
    isLoading,
    isFetching,
  } = useGetRepliesQuery({
    comment_id: comment_id,
    replayTake: take,
    replaySkip: skip,
  });

  if (isLoading || isFetching) {
    return <div>loading...</div>;
  }

  return (
    <div className="ml-3 flex flex-col justify-start items-center gap-2">
      {data?.replay &&
        data.replay.map((rep) => {
          return (
            <div
              key={rep.id}
              className="flex w-full flex-col justify-start items-start gap-2 space-x-4"
            >
              <div 
              className="flex justify-center items-start gap-3"
              >
                <AvatarRep author_id={rep.author_id} />

                <div className="flex justify-start gap-3">
                  <div className="flex justify-start gap-4 items-start">
                    <div
                    className="flex flex-col justify-start gap-1"
                    >

                    <UserInfoHeader author_id={rep.author_id} />
                    <div className="">{rep.content}</div>
                    </div>
                    <TimeStamp 
                    key={rep.id}
                    created_at={rep.created_at} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Replaies;
