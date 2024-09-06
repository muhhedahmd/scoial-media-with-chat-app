import React, { useEffect, useState } from "react";
import { useGetNEstedRepliesQuery } from "@/store/api/apicomment";
import ReplayItem from "./replayItem";
import { shapeOfReplies } from "@/app/api/comment/replay/route";

const NestedReplies = ({
  replayId,
  MainUserId,
  comment_id,
  post_id,
  focused,
  setFocused,
  openReplay,
setOpenReplay,
level,
setLevel,
author_comment,
mainReps
}: {
  focused: number | null;
  setFocused: React.Dispatch<React.SetStateAction<number | null>>;
  replayId: number;
  MainUserId: number;
  comment_id: number;
  post_id: number
  openReplay:  number | null;
  setOpenReplay : React.Dispatch<React.SetStateAction<number | null>>;
  level: number;
  setLevel:React.Dispatch<React.SetStateAction<number >>
  author_comment: number
  mainReps: shapeOfReplies[]
}) => {
  const { data } = useGetNEstedRepliesQuery({
    parent_Id: replayId,
    skip: 0,
    take: 5,
  });


  useEffect(() => {
    if (data && data.replay.length > 0) {
      setLevel((prevLevel) => prevLevel + 1);
    }
  }, [data, setLevel]);

  // Generate a color gradient based on the depth level
  const getColor = (lvl: number) => {
    const base = 50;
    const colorValue = Math.min(Math.round(base + lvl * 20), 255);
    return `rgba(${colorValue}, ${255 - colorValue}, ${colorValue / 2}, 0.8)`;
  };

  return (
    <>
      {data?.replay && data.replay.length > 0 && (
        <div className="relative w-full flex flex-col">

          {data.replay.map((nestedRep) => (
            <ReplayItem
            openReplay={openReplay}
            setOpenReplay={setOpenReplay}
              key={nestedRep.id}
              MainUserId={MainUserId}
              comment_id={comment_id}
              post_id={post_id}
              rep={nestedRep}
              focused={focused}
              setFocused={setFocused}
              level={level}
              setLevel={setLevel}
              author_comment={author_comment}
              mainReps={mainReps}

            />
          ))}
{/* 
          {data && data.replay.length > 0 && (
            <div
              className="hidden md:block"
              style={{
                position: "absolute",
                left: `-${(level + 2) * 10}px`,
                width: "3px",
                backgroundColor: getColor(level),
                height: `${60 * data.replay.length + 20}px`,
                transition: "opacity 0.3s",
              }}
            />
          )} */}
        </div>
      )}
    </>
  );
};

export default NestedReplies;
