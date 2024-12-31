import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ImageIcon,
  LoaderCircle,
  MoreVertical,
  Plus,
  User2,
} from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef } from "react";
import { Contact } from "../page";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessagesOfChat from "./MessagesOfChat";
import SendMsg from "./SendMsg";
import BluredImage from "@/app/_components/ImageWithPlaceholder";
import { cn } from "@/lib/utils";
import { followerType } from "@/app/api/follow/follower/[id]/route";
import { usePresence } from "@/context/PresenceContext";
import { FixedContractGroup } from "@/app/api/chat/start-chat-group/route";
import { UserWithPic } from "@/app/api/chat/contacts-users/route";
import { Chat } from "@prisma/client";

const ChatHeader = ({
  selectedContact,
  setContactSheet,
  startChatWith,
  isLoading,
  AddChat,
  chat,
  selectedGroupMembers,
}: {
  selectedGroupMembers: null | FixedContractGroup;
  selectedContact: Contact | null;
  setContactSheet: Dispatch<SetStateAction<boolean>>;
  startChatWith: followerType | null;
  isLoading: boolean;
  AddChat: () => void;
  chat: Chat | null;
  // chatEndRef: React.RefObject<HTMLDivElement>;
}) => {
  const profilePicOFSatrtChatwith = useMemo(
    () => startChatWith?.profilePicture.find((img) => img.type === "profile"),
    [startChatWith?.profilePicture]
  );
  const CoverPicOFSatrtChatwith = useMemo(
    () => startChatWith?.profilePicture.find((img) => img.type === "cover"),
    [startChatWith?.profilePicture]
  );
  const { onlineUsers } = usePresence();
  const MAX_USERS_TO_SHOW = 3;
  const IsAbove =
    selectedGroupMembers?.members &&
    selectedGroupMembers?.members?.length > MAX_USERS_TO_SHOW;
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);
  return (
    <div className="flex-1 flex flex-col min-w-[30vw] bg-slate-200  shadow-xl ">
      {(selectedContact as Contact) ? (
        <>
          <header className="h-14 px-4 shadow-md   bg-white flex items-center justify-between">
            <div className="flex items-center gap-3 ml-10">
              {selectedContact && (
                <>
                  <Avatar className="w-8 h-8 ring-2 ring-white">
                    <AvatarImage
                      src={
                        selectedContact.profile?.profilePictures?.[0]
                          ?.secure_url
                      }
                    />
                    <AvatarFallback className="bg-gray-300 text-gray-800">
                      {selectedContact.first_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-medium text-sm text-black">{`${selectedContact.first_name} ${selectedContact.last_name}`}</h2>
                    <p className="text-xs text-gray-800">
                      {onlineUsers.find((u) => u.id === selectedContact.id)
                        ? "Online"
                        : "Offline"}
                    </p>
                  </div>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setContactSheet((prev) => !prev)}
              className="text-black"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </header>

          <ScrollArea className="flex-1 p-4     bg-gradient-to-r from-slate-300 to-slate-500">
            {chat && (
              <MessagesOfChat
              
                selectedGroupMembers={selectedGroupMembers}
                chatEndRef={chatEndRef}
                selectedContact={selectedContact!}
                chatId={chat.id}
              />
            )}
            <div ref={chatEndRef} />
          </ScrollArea>

          <footer className="p-3 bg-white border-t border-gray-100">
            <SendMsg chatId={chat!.id!} receiverId={selectedContact?.id!} />
          </footer>
        </>
      ) : selectedGroupMembers ? (
        <>
          <header className="h-14 px-4 shadow-md   bg-white flex items-center justify-between">
            <div
            className="flex justify-start gap-3 w-max  items-center ml-5"
            >
                      <div className="flex-1 min-w-0">
                
                <p className="uppercase font-bold truncate">
                  {selectedGroupMembers.chat.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {selectedGroupMembers.chat.description}
                </p>
              </div>
              <div className="flex flex-col items-end gap-3"></div>
              <div className="z-0 flex items-center -space-x-2 *:ring *:ring-background">
                {selectedGroupMembers && selectedGroupMembers.members && (
                  <>
                    {selectedGroupMembers.members.map((member) => {
                      const profile = member.profile?.profilePictures?.find((e)=>e.type === "profile")
                      return (
                        <Avatar className="w-9 h-9 " key={member.id}>
                          <AvatarFallback>
                            {" "}
                            {member.first_name[0]}
                          </AvatarFallback>
                          <AvatarImage
                            alt={member.first_name + " " + member.last_name}
                            src={profile?.secure_url|| ""}
                          />
                        </Avatar>
                      );
                    })}

                    <>
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
                    </>
                  </>
                )}
              </div>
      
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setContactSheet((prev) => !prev)}
              className="text-black"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </header>

          <ScrollArea className="flex-1 p-4     bg-gradient-to-r from-slate-300 to-slate-500">
            {chat && (
              <MessagesOfChat
                selectedGroupMembers={selectedGroupMembers}
                chatEndRef={chatEndRef}
                selectedContact={selectedContact!}
                chatId={selectedGroupMembers.chat.id}
              />
            )}
            <div ref={chatEndRef} />
          </ScrollArea>

          <footer className="p-3 bg-white border-t border-gray-100">
            <SendMsg chatId={selectedGroupMembers.chat.id} receiverId={selectedContact?.id!} />
          </footer>
        </>
      ) : startChatWith ? (
        <>
          <header className="h-14 px-4 shadow-md   bg-white  flex items-center justify-between">
            <div className="flex items-center justify-start  gap-3 ml-10 min-h-[48rem] ">
              {startChatWith && (
                <>
                  <Avatar className="w-8 h-8 ring-2 ring-white">
                    <AvatarImage src={profilePicOFSatrtChatwith?.secure_url} />
                    <AvatarFallback className="bg-gray-300 text-gray-800">
                      {startChatWith.user.first_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-medium text-sm text-black">{`${startChatWith.user.first_name} ${startChatWith.user.last_name}`}</h2>
                    <p className="text-xs text-gray-800">
                      {onlineUsers.find((u) => u.id === startChatWith.user.id)
                        ? "Online"
                        : "Offline"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </header>
          <div className="h-screen w-full  flex justify-center items-center">
            <div className="w-3/4  shadow-lg  rounded-md bg-white p-3 flex justify-start flex-col items-center">
              <div className="relative p-4 w-full">
                {CoverPicOFSatrtChatwith ? (
                  <div className="bg-gray-500 h-48 w-full rounded-lg flex justify-center items-center">
                    <BluredImage
                      blurhash={CoverPicOFSatrtChatwith?.HashBlur || ""}
                      alt={
                        "cover_picture " +
                        startChatWith.user.first_name +
                        " " +
                        startChatWith.user.last_name
                      }
                      width={CoverPicOFSatrtChatwith?.width!}
                      height={CoverPicOFSatrtChatwith?.height!}
                      quality={75}
                      imageUrl={CoverPicOFSatrtChatwith?.secure_url || ""}
                      className="  h-48  w-full object-cover rounded-md"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-200 h-40 rounded-lg flex justify-center items-center">
                    <ImageIcon className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}

                {profilePicOFSatrtChatwith ? (
                  <div className="absolute top-[80%] left-[50%] -translate-x-[50%] -translate-y-[50%]   w-24 h-24 flex justify-center items-center shadow-sm border-2 border-gray-300 bg-gray-200 rounded-full">
                    <BluredImage
                      width={profilePicOFSatrtChatwith?.width!}
                      height={profilePicOFSatrtChatwith?.height!}
                      blurhash={profilePicOFSatrtChatwith?.HashBlur || ""}
                      imageUrl={profilePicOFSatrtChatwith?.secure_url || ""}
                      alt="profile_pictre"
                      quality={100}
                      className={cn(
                        "rounded-full   h-[5.5rem] w-[5.5rem]  object-cover"
                      )}
                    />
                  </div>
                ) : (
                  <div className="absolute -bottom-10 left-4 w-24 h-24 flex justify-center items-center shadow-sm border-2 border-gray-300 bg-gray-200 rounded-full">
                    <User2 className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4 justify-start items-center flex-col">
                <h2 className="text-xl">
                  Start Chat with
                  <span className="font-bold">
                    {" " +
                      startChatWith.user.first_name +
                      " " +
                      startChatWith.user.last_name}
                  </span>
                </h2>
                <p>be the cerator of this chat!</p>
                <Button disabled={isLoading} onClick={AddChat}>
                  {isLoading ? (
                    <LoaderCircle className="animate-spin w-4 h-4 text-white " />
                  ) : (
                    "Chat"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold text-gray-600">
              Select a contact to Chat
            </h1>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatHeader;
