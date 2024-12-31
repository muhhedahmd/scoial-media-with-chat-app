"use client";

import React, { memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetChatQuery } from "@/store/api/apiChat";
import { userResponse } from "@/store/Reducers/mainUser";
import { cn, decryptMessage } from "@/lib/utils";
import { Contact } from "../page";
// import { EyeClosed } from 'lucide-react';
import MessagMedia from "./MessagMedia";
import { FixedContractGroup } from "@/app/api/chat/start-chat-group/route";
import {
  Message,
  MessageMedia,
  ProfilePicture,
  VideoChat,
  VideoChatStatus,
} from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { EyeOffIcon } from "lucide-react";
import EyeClosed from "@/app/_components/EyeClose";

interface MessagesOfChatProps {
  chatId: number;
  selectedContact: Contact;
  chatEndRef: React.RefObject<HTMLDivElement>;
  selectedGroupMembers: FixedContractGroup | null;
}

type RegularMessage = Omit<Message, "content"> & {
  messageMedia: MessageMedia[];
  sender: {
    id: number;
    email: string;
    first_name: string;
    user_name: string;
    last_name: string;
    profile: {
      profilePictures: ProfilePicture[] | undefined;
    } | null;
  };
};

type VideoCallMessage = {
  id: number;
  startTime: Date;
  endTime: Date | null;
  createdAt: Date;
  updatedAt: Date;
  receiverId: number | null;
  senderId: number;
  chatId: number;
  status: VideoChatStatus;
  sender: {
    first_name: string;
    last_name: string;
    profile: {
      profilePictures: ProfilePicture[] | undefined;
    };
  };
  receiver: {
    first_name: string;
    last_name: string;
    profile: {
      profilePictures: ProfilePicture[] | undefined;
    };
  };
};

type CombinedMessage =
  | { type: "regular"; message: RegularMessage }
  | { type: "videoCall"; message: VideoCallMessage };

export default memo(function MessagesOfChat({
  chatEndRef,
  selectedContact,
  chatId,
  selectedGroupMembers,
}: MessagesOfChatProps) {
  const authenticatedUser = useSelector(userResponse)!;

  const { isLoading, isFetching, data } = useGetChatQuery({
    chatId: chatId,
    skip: 0,
    take: 50,
  });

  const [combinedMessages, setCombinedMessages] = useState<CombinedMessage[]>(
    []
  );

  useEffect(() => {
    if (data && data?.messages) {
      const combined: CombinedMessage[] = [
        ...data.messages.map((msg) => ({
          type: "regular" as const,
          message: msg,
        })),
        ...data.VideoChat?.map((call) => ({
          type: "videoCall" as const,
          message: call,
        })),
      ] as any

      // Sort the combined array based on the createdAt timestamp
      combined.sort((a, b) => {
        const dateA = new Date(
          a.type === "regular" ? a.message.createdAt : a.message.startTime
        );
        const dateB = new Date(
          b.type === "regular" ? b.message.createdAt : b.message.startTime
        );
        return dateA.getTime() - dateB.getTime();
      });

      setCombinedMessages(combined);
    }
  }, [data]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatEndRef, data]);

  function formatMessageTime(createdAt: string | Date): string | null {
    const messageDate = new Date(createdAt);
    if (isNaN(messageDate.getTime())) {
      return null;
    }
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(messageDate);
  }

  if (isLoading || isFetching || !authenticatedUser.id) {
    return (
      <div className="w-full p-4 space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-start space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-16 w-3/4 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const renderMessage = (item: CombinedMessage, index: number) => {
    if (item.type === "regular") {
      const message = item.message;
      const isAuthUserSender = message.senderId !== authenticatedUser.id;
      const messageContact =
        ((isAuthUserSender ? selectedContact : authenticatedUser) as Contact) ||
        null;

      return (
        <div
          key={message.id}
          className={`flex ${
            !isAuthUserSender ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`flex ${
              !isAuthUserSender ? "flex-row-reverse" : "flex-row"
            } items-end gap-2 max-w-[70%]`}
          >
            <Avatar

              className={`w-8 h-8 ${
                isAuthUserSender
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              <AvatarImage
                src={
                  message.sender.profile?.profilePictures?.[0]?.secure_url || ""
                }
                alt={`${message.sender.first_name} ${message.sender.last_name}`}
              />
              <AvatarFallback
                className={`${
                  isAuthUserSender
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {message.sender.first_name[0]}
              </AvatarFallback>
            </Avatar>

            <MessagMedia
              media={message.messageMedia}

              msg_id={message.id}
              isAuthUserSender={isAuthUserSender}
              MessageContent={
                <>
                  <p className="text-sm mt-2">
                    {decryptMessage(
                      message.encryptedContent as string,
                      message.iv as string
                    )}
                  </p>
                  <div className=" flex justify-between w-full flex-row-reverse items-center">

                  <p
                    className={`text-xs mt-1 ${
                      isAuthUserSender
                        ? "text-primary-foreground/70"
                        : "text-secondary-foreground/70"
                    }`}
                  >
                    {formatMessageTime(message.createdAt)}
                  </p>
                  <p className=" ">
                    {
                      message?.status === "SENT" ? 
                        <EyeClosed  className="w-4 h-4 text-gray-600"/>
                        : message?.status === "DELIVERED" ?
                        <span className="text-xs text-primary-foreground/70">Delivered</span>
                        : message?.status === "READ" ?
                        <span className="text-xs text-primary-foreground/70">Read</span> 
                        : null
                      }
                  </p>
                      </div>
                </>
              }
            />
          </div>
        </div>
      );
    } else {
      const isAuthUserSender = item.message.senderId !== authenticatedUser.id;
      const profilePic = item?.message 
      && item.message?.sender 
      && item.message?.sender.profile?.profilePictures?.[0] 
      ?.secure_url ||  selectedContact && selectedContact?.profile
      && selectedContact
      .profile?.profilePictures && selectedContact.profile?.profilePictures?.[0]?.secure_url

      // Render video call item
      return (
        <div className="flex w-full justify-center items-center ">
          <div
            key={`video-${index}`}
            className={cn(
              "flex items-end gap-2 max-w-[70%] ",
   
              !isAuthUserSender ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div
              className={cn(`flex ${
                !isAuthUserSender ? "flex-row-reverse" : "flex-row"
              } items-end gap-2 max-w-[100%]` , 
          
            )}
            >
              <div className={cn(`p-2 bg-neutral-200 before:w-full before:h-full
              rounded-xl`, 
                item.message.status === "ONGOING"&& `
              before:absolute 
               before:bg-gradient-to-r  before:from-neutral-200 
                before:via-emerald-500
                before:to-neutral-200
                 before:rounded-xl relative
               before:top-0 overflow-hidden before:animate-indeterminate-bar 
               before:repeat-infinite before:left-0 before:z-[1]
                `
                  
              ) }>
                <div className="flex gap-2  justify-center items-center">
                  <Avatar

                    className={`w-8 h-8 shadow-sm  relative z-20 ${
                      isAuthUserSender
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <AvatarImage
                      src={
                        profilePic || ""
                      }
                      // alt={`${item.message.sender} ${.sender.last_name}`}
                    />
                    <AvatarFallback
                      className={`${
                        isAuthUserSender
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {item?.message?.sender &&item?.message?.sender?.first_name[0] || "W"}
                    </AvatarFallback>
                  </Avatar>
                  <Badge
                  className={  
                    cn(
                      "cursor-default relative z-20" ,
                      item.message.status === "PENDING" && "bg-emerald-500 text-white",
                      item.message.status === "MISSED" && "bg-red-500 text-white",
                      item.message.status === "ONGOING" && "bg-teal-500 text-white",
                      item.message.status === "ENDED" && " text-white bg-stone-700 "
                    )
                  }
                  >{item.message.status}</Badge>
                </div>
                <div className="relative z-20 flex justify-start items-center gap-2">
                  <p>Video call</p>
                  <p className="text-sm text-muted-foreground">
                    {formatMessageTime(item.message.startTime)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div
      className="flex flex-col space-y-4 p-4 
      bg-gradient-to-r from-slate-300 to-slate-500"
    >
      {combinedMessages.map((item, index) => renderMessage(item, index))}
      <div ref={chatEndRef} />
    </div>
  );
});
