"use client"
import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import "react-advanced-cropper/dist/style.css";
import "./styles.css";
import prisma from "@/lib/prisma";




const Example = () => {
  
  return (
    <div className="example">
      <div>

      </div>
    </div>
  );
};
export default Example



// <div
// id={`${id}`}
// key={i}
// className={`expanded-delay-comment-${id} p-3 w-full shadow-sm bg-white flex flex-col justify-start items-end`}
// >
// <div className="flex w-full justify-start items-start flex-col">
//   <div className="w-full  flex flex-col justify-start items-start">
//     <HeaderPost
//       postId={id}
//       author_id={author_id}
//       user={user}
//       created_at={created_at}
//     />
//     <div
//       className="w-[93%]
                
//                 ml-[64px] pr-3 flex my-2 justify-start items-start flex-col"
//     >
//       <p>this is pull shit</p>
//     </div>
//   </div>
//   <div
//     className="w-[90%] m-auto py-[1.3rem] px-2 "
//     style={{
//       border: "2px solid rgba(101, 101, 101, 0.11)",
//       borderRadius: "11px",
//     }}
//   >
//     <HeaderPost
//       postId={id}
//       author_id={author_id}
//       user={user}
//       created_at={created_at}
//     />
//     <div className="w-full pr-3 ml-[70px] flex justify-start items-start flex-col">
//       <ContentPost postId={id} content={title} />
//     </div>
//   </div>
//   <ReactionReactionOptions
//     MainUserProfile={MainUserProfile}
//     userId={user.id}
//     postId={id}
//     author_id={author_id}
//   />
//   {isMessageOpen?.id === id ? (
//     <Comments post_id={id} userId={user.id} />
//   ) : (
//     ""
//   )}
// </div>
// </div>