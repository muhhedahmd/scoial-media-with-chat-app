import React, { Dispatch, SetStateAction, useImperativeHandle } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BluredImage from "@/app/_components/ImageWithPlaceholder";
import { decryptMessage } from "@/lib/utils";
import { useGetContactsQuery } from "@/store/api/apiChat";
import { Skeleton } from "@/components/ui/skeleton";
import { Chat, ChatType, MessageStatus } from "@prisma/client";
import { formatDistance } from "date-fns";
import { Contact } from "../page";
import { followerType } from "@/app/api/follow/follower/[id]/route";
import { uniqueId } from "lodash";
import {
  FixedContract,
  UserWithPic,
} from "@/app/api/chat/contacts-users/route";
import { Check, Plus } from "lucide-react";
import { useChoseMemberGroup } from "@/context/ChoseMemberGroupContext";
import { FixedContractGroup } from "@/app/api/chat/start-chat-group/route";

const ContactsList = ({
  setChat,
  setSelectedContact,
  setStartChatWith,
  groupMinaml,
  type,
  setSelectedGroupMembers,
}: {
  setSelectedGroupMembers: Dispatch<SetStateAction< FixedContractGroup | null>>;

  type?: ChatType;
  groupMinaml?: boolean;
  setStartChatWith: Dispatch<SetStateAction<followerType | null>>;
  setChat: Dispatch<SetStateAction<Chat | null>>;
  setSelectedContact: Dispatch<SetStateAction<Contact | null>>;
}) => {
  const { ChoseMemberGroup, setChoseMemberGroup } = useChoseMemberGroup();
  const {
    data: contacts,
    isLoading,
    error,
  } = useGetContactsQuery({
    type,
  });

  console.log({
    contacts,
  });

  if (isLoading)
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-2 w-40" />
        <Skeleton className="h-2 w-20" />
      </div>
    );

  if (groupMinaml) {
    return (
      <>
        {contacts &&
          contacts.map((contact, index) => {
            const status = contact.message.status as MessageStatus;
            const isInChoseMemberGroup =
              ChoseMemberGroup?.findIndex(
                (user) => user.id === contact.reciver?.id
              ) !== -1;

            const profile = contact.reciver?.profile?.profilePictures?.find(
              (img: any) => {
                return img.type === "profile";
              }
            );
            if (contact.chat.type === "PRIVATE")
              return (
                <div
                  key={contact.reciver?.id}
                  className="flex items-center relative gap-3 p-3 transition-all hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer mb-2"
                  onClick={() => {
                    setChoseMemberGroup((prev) => {
                      if (prev && contact.reciver && contact?.reciver) {
                        if (isInChoseMemberGroup) {
                          return prev.filter(
                            (user) => user.id !== contact.reciver?.id
                          );
                        } else {
                          return [...prev, contact.reciver];
                        }
                      } else {
                        return [];
                      }
                    });
                    setStartChatWith(null);
                    // setSelectedContact(contact?.reciver || null );
                    // setChat(contact.chat.id);
                  }}
                >
                  <Avatar className="relative">
                    <AvatarFallback>
                      {contact.reciver?.first_name[0]}
                    </AvatarFallback>

                    <AvatarImage security={profile?.secure_url}></AvatarImage>
                    {isInChoseMemberGroup ? (
                      <div className="p-1 bg-slate-700 rounded-full  absolute bottom-[-.1rem] right-[.2rem] flex justify-center items-center">
                        <Check className="w-3 h-3  text-white" />
                      </div>
                    ) : null}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {contact.reciver?.first_name +
                        " " +
                        contact.reciver?.last_name}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        status === "SENT" ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></span>
                  </div>
                </div>
              );
          })}
      </>
    );
  }
  return (
    <div>
      {contacts &&
        contacts.map((contact, index) => {
          const msg =
            contact.message.encryptedContent &&
            contact.message.iv &&
            decryptMessage(
              contact.message.encryptedContent,
              contact.message.iv
            );
          const status = contact.message.status as MessageStatus;
          const date = contact.message.createdAt
            ? formatDistance(new Date(contact.message.createdAt), new Date())
            : null;

          const profile = contact.reciver?.profile?.profilePictures?.find(
            (img: any) => {
              return img.type === "profile";
            }
          );
          if (contact.chat.type === "PRIVATE")
            return (
              <div
                key={contact.reciver?.id}
                className="flex items-center gap-3 p-3 transition-all hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer mb-2"
                onClick={() => {
                  setStartChatWith(null);
                  setSelectedContact(contact?.reciver || null);
                  setSelectedGroupMembers(null)
                  setChat(contact.chat);
                }}
              >
                <Avatar>
                  <AvatarFallback>
                    {contact.reciver?.first_name[0]}
                  </AvatarFallback>

                  {profile && (
                    <AvatarImage>
                      <BluredImage
                        alt={
                          contact.reciver?.first_name +
                          " " +
                          contact.reciver?.last_name
                        }
                        className="w-10 h-10 rounded-full"
                        imageUrl=""
                        height={profile?.height}
                        quality={40}
                        width={profile?.width}
                        blurhash={profile?.HashBlur}
                      />
                    </AvatarImage>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {contact.reciver?.first_name +
                      " " +
                      contact.reciver?.last_name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {msg || ""}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className="text-xs text-gray-500  dark:text-gray-400">
                    {date}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      status === "SENT" ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></span>
                </div>
              </div>
            );
          else if (contact.chat.type === "GROUP") {
            const MAX_USERS_TO_SHOW = 3;
            const IsAbove =
              contact?.members && contact?.members?.length > MAX_USERS_TO_SHOW;
            return (
              <div
                key={contact.chat.id}
                className="flex items-center gap-3 p-3 transition-all hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer mb-2"
                onClick={() => {
                  setStartChatWith(null);
                  setSelectedGroupMembers(contact as FixedContractGroup)
                  setSelectedContact(null)
                  setChat(contact.chat);
                }}
              >
                <div className="z-0 flex items-center -space-x-2 *:ring *:ring-background">
                  
                  {" "}
                  {contact.members &&
                    contact?.members
                      ?.slice(0, MAX_USERS_TO_SHOW)
                      ?.map((mebmer) => {
                        const memberMsg =
                          mebmer?.profile?.profilePictures?.find(
                            (img: any) => img.type === "profile"
                          );
                        return (
                          <Avatar className="w-8 h-8 " key={mebmer.id}>
                            <AvatarFallback>
                              {" "}
                              {mebmer.first_name[0]}
                            </AvatarFallback>
                            <AvatarImage
                              alt={
                                mebmer.first_name +
                                " " +
                                mebmer.last_name
                              }
                              src={memberMsg?.secure_url || ""}
                            />
                          </Avatar>
                        );
                      })}
                  {IsAbove && (
                    <Avatar className=" w-8 h-8 ">
                      <AvatarFallback
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="bg-slate-600 text-white"
                      >
                        {" "}
                        <Plus className="w-3 h-3" />
                      </AvatarFallback>
                      <AvatarImage
                        alt={"more"}
                        // src={memberMsg?.secure_url || ""}
                      />
                    </Avatar>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="uppercase font-bold truncate">
                    {contact.chat.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {/* {contact.} */}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  {date && (
                    <span className="text-xs text-gray-500  dark:text-gray-400">
                      {date}
                    </span>
                  )}
                  {/* <span
                  className={`w-2 h-2 rounded-full ${
                    status === "SENT" ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></span> */}
                </div>
              </div>
            );
          }
        })}
    </div>
  );
};

export default ContactsList;
