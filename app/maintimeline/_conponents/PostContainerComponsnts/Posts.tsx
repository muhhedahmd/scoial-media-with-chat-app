import React from "react";
import {  Profile, User } from "@prisma/client";
import {
  ContentPostLoader,
  HeaderPostLoader,
  InteractionButtonsLoader,
  InteractionsLoader,
} from "./postCompoenets/Loaderes";

import { useMessageOpen } from "@/context/comment";
import Renderposts from "./Renderposts";
import { shapeOfPostsRes } from "@/app/api/posts/route";
import { cn } from "@/lib/utils";

const Posts = ({
  postsContainerRef ,
  user,
  MainUserProfile,
  isLoadingFetch ,
  FetchPostData,
  isScrolled ,
}: {
  isScrolled: boolean
  isLoadingFetch: boolean,
  FetchPostData : {
    posts: shapeOfPostsRes[];
    hasMore: boolean;
} | undefined
  user: User;
  MainUserProfile: Profile;
  postsContainerRef: React.RefObject<HTMLDivElement>
}) => {




  const { isMessageOpen } = useMessageOpen();


  if (isLoadingFetch) {
    return (
      <div className="h-4/5 w-full scrollbar-hide gap-3 flex flex-col justify-start items-start overflow-y-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="p-3 w-full shadow-sm bg-white flex flex-col justify-start items-start"
          >
            <HeaderPostLoader />
            <ContentPostLoader />
            <InteractionsLoader />
            <InteractionButtonsLoader />
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div
        ref={postsContainerRef}
        className={cn(isScrolled ? "h-auto" : " h-4/5" ,  " w-full gap-3 flex flex-col justify-start items-start overflow-y-auto")}
      >
        <Renderposts
          user={user}
          isMessageOpen={isMessageOpen}
          MainUserProfile={MainUserProfile as unknown as any}
          posts={FetchPostData?.posts}
        />
      </div>
    );
  }
};

export default Posts;
