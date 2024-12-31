"use client";

import Header from "@/app/maintimeline/_conponents/Header";
import ContentPost from "@/app/maintimeline/_conponents/PostContainerComponsnts/postCompoenets/ContentPost";
import { useGetProfileQuery } from "@/store/api/apiProfile";
import { User } from "@prisma/client";
import { Bell, EllipsisIcon, Heart, SendHorizontalIcon, User2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { Home, User as UserIcon, MoreHorizontal } from "lucide-react"; // Import icons
import ReactionReactionOptions from "@/app/maintimeline/_conponents/PostContainerComponsnts/postCompoenets/Reaction&ReactionOptions";
import { useGetSinglePostQuery } from "@/store/api/apiSlice";
import Comments from "@/app/maintimeline/_conponents/PostContainerComponsnts/CommentComp/Comments";
import { Separator } from "@radix-ui/react-separator";
import CommentReactions from "@/app/maintimeline/_conponents/PostContainerComponsnts/CommentComp/CommentReactions";
import { Emoji } from "@/app/maintimeline/_conponents/PostContainerComponsnts/CommentComp/EmojiPicker";
import ReplayItem from "@/app/maintimeline/_conponents/PostContainerComponsnts/CommentComp/replayComp/replayItem";
import { Input } from "@/components/ui/input";
import CommentAddation from "@/app/maintimeline/_conponents/PostContainerComponsnts/CommentComp/CommentAddation";
import HeaderPost from "@/app/maintimeline/_conponents/PostContainerComponsnts/postCompoenets/HeaderPost";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Page = ({
  params,
}: {
  params: {
    id: number;
  };
}) => {

  const user = useSelector((state : RootState)=> state.mainUserSlice.user)
  const {
    isError: ErrorPost,
    data: post,
    isLoading: status,
    isFetching: isFetchingPost,
  } = useGetSinglePostQuery({
    post_id: +params.id,
  });
  console.log(params);
  const {
    data: profile,
    isLoading: statusProfile,
    isSuccess,
    isError,
  } = useGetProfileQuery({ userId: user?.id! });

  if (!user || !profile || !user?.id 
    ||statusProfile

  ) return null; // Return null instead of undefined

  if (!post) return <>
  
  </>;
  return (
    <div className="w-full  h-screen overflow-hidden">
      {/* Header Component */}
      <div className="md:block  hidden shadow-xl">
        <Header user={user} />
      </div>

      <div className="h-12 flex justify-between shadow-xl w-full md:hidden items-center px-6 bg-white">
        <div className="flex h-full gap-4 items-center">
          <Image src="/logo.svg" width={40} height={40} alt="logo" />
        </div>
      </div>

      {/* Layout Container */}
      <div
        className="relative pt-4 md:pt-0 overflow-y-auto gap-3 flex-col md:flex-row items-center justify-start bg-gray-100 px-4 flex "
        style={{
          minHeight: "calc(100vh - 3rem)",
        }}
      >
        {/* Left Section - Post */}
        <div className="lg:w-2/3 w-full  h-[74vh]  overflow-y-auto relative bg-gray-50 shadow-md rounded-lg p-6 mb-4 md:mb-0">
          {/* Post Content */}
          <div className="bg-white p-3 rounded-sm">
            {/* Post Header */}

            {/* Post Body */}
            <ContentPost
              content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum."
              postId={params.id}
            />
          </div>

        </div>

        {/* right Section - Post */}
        <div className="lg:w-1/3 w-full h-[74vh] overflow-auto  flex justify-between items-start flex-col  bg-white shadow-md rounded-lg p-6">
       
          <div className="w-full relative flex justify-between flex-col">
            <div className="py-4 px-2 flex justify-between w-full bg-white z-[100]  sticky top-[-1.6rem] items-center">
              <HeaderPost
              address={post.address}
              content={post.title}
              MainUserProfileId={user.id}
              minmal={false}
              author_id={post.author_id}
              postId={post.id}
              user={user! || undefined}
              created_at={post.created_at}
              share={post.shared? true : false}              
              />
         
              {/* <EllipsisIcon className="cursor-pointer w-6 h-6 " /> */}
            </div>
            <Separator
              orientation="vertical"
              className="bg-[#f9f9f9] w-full h-1"
            />
            <div
              className="comment_replies_Section
            w-full 
            mt-4
            
            "
            >


              <Comments
              author_id={post?.author_id}
              post_id={post?.id}
              userId={user.id}
              hideAddition={true}

              />

            </div>
          </div>

                        <CommentAddation userId={user.id} postId={post.id} />


        </div>
      </div>


      <div className="h-16  md:hidden block bg-gray-100" />
      {/* Mobile Navigation Header */}
      <div className="fixed bottom-0 left-0 w-full pt-4 bg-white shadow-md md:hidden flex justify-around items-center py-2 border-t border-gray-200">
        <button className="text-gray-600">
          <Home className="w-6 h-6" />
        </button>
        <button className="text-gray-600">
          <UserIcon className="w-6 h-6" />
        </button>
        <button className="text-gray-600">
          <Bell className="w-6 h-6" />
        </button>
        <button className="text-gray-600">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Page;
