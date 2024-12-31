"use client";
import React, { useEffect, useRef, useState } from "react";
import ProfileInfo from "./profileInfo";
import { AnimatePresence } from "framer-motion";
import ChatHeader from "./ChatHeader";
import { ChoseMemberGroupProvider } from "@/context/ChoseMemberGroupContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebarContent from "./SideBarChats";
import { FixedContractGroup } from "@/app/api/chat/start-chat-group/route";
import { followerType } from "@/app/api/follow/follower/[id]/route";
import { Contact } from "../page";
import { Chat } from "@prisma/client";
import { useVideoCall } from "@/context/CallContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import CallDialog from "./callDialog";
import supabase from "@/lib/Supabase";
import { useSelector } from "react-redux";
import { userResponse } from "@/store/Reducers/mainUser";

const Chatpage = ({
  setSelectedGroupMembers,
  setStartChatWith,
  setSelectedContact,
  setChat,
  AddChat,
  chat,
  // chatEndRef,
  isLoading,
  selectedContact,
  setContactSheet,
  startChatWith,
  selectedGroupMembers,
  contactSheet,
}: {
  setSelectedGroupMembers: React.Dispatch<
    React.SetStateAction<FixedContractGroup | null>
  >;
  setStartChatWith: React.Dispatch<React.SetStateAction<followerType | null>>;
  setSelectedContact: React.Dispatch<React.SetStateAction<Contact | null>>;
  setChat: React.Dispatch<React.SetStateAction<Chat | null>>;
  AddChat: () => void;
  chat: Chat | null;
  // chatEndRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  selectedContact: Contact | null;
  setContactSheet: React.Dispatch<React.SetStateAction<boolean>>;
  startChatWith: followerType | null;
  selectedGroupMembers: FixedContractGroup | null;
  contactSheet: boolean;
}) => {
  const profilePic =
    selectedContact?.profile?.profilePictures &&
    selectedContact?.profile?.profilePictures.find(
      (pic) => pic.type === "profile"
    );
  const { 
    activeCall  , 
    handleJoin ,
    handleEndCall ,
    isCallStarted   ,
    isCalling  ,
    setisDialogOpen ,
    OpenCallDialog ,
    setOpenCallDialog
  } = useVideoCall(
    
  );
  const cachedUser = useSelector(userResponse)!

  // useEffect(()=>{
  //   if(!activeCall) return
  //   // setisDialogOpen(OpenCallDialog)
  // if(OpenCallDialog && cachedUser.id !== activeCall.senderId){


  // }

  // } ,[OpenCallDialog, activeCall, cachedUser.id, cachedUser.user_name])

  return (
    <>
    <div className=" relative h-screen w-full">
      {isCalling && !isCallStarted   && (

        <div className="flex justify-start gap-2 p-2  shadow-md z-30 bg-slate-50 absolute top-1 left-2 rounded-xl">
          <div className="flex justify-start items-center gap-2">
            <Avatar 
            className="bg-white "
            >
              <AvatarImage src={profilePic?.secure_url}></AvatarImage>
              <AvatarFallback 
              className="bg-white"
              >
                {selectedContact?.first_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <p>

              {selectedContact?.first_name + " " + selectedContact?.last_name}
            </p>
          </div>
          <div

          className="flex justify-start items-center gap-2"
          >

          <Button
          onClick={()=>{ 

            setOpenCallDialog(true)
            handleJoin()
          
          }}
            variant={"ghost"}
            size={"icon"}
            className="bg-transparent hover:bg-transparent text-emerald-500 hover:text-emerald-600"
          >
            <Phone className="animate-accordion-up w-4 h-4" />

          </Button>

          <Button
            onClick={()=>handleEndCall()}
            variant={"ghost"}
            size={"icon"}
            className="bg-transparent hover:bg-transparent text-red-500 hover:text-red-600"
          >
            <PhoneOff className="w-4 h-4" />
            
          </Button>
            </div>
        
        </div>

      )}

      <div className="flex h-screen bg-gradient-to-br   from-purple-100 to-blue-100">

        <div className="flex flex-col h-screen w-fit bg-white  shadow-md relative">
          <ChoseMemberGroupProvider>
            <SidebarProvider>
              <AppSidebarContent
                setSelectedGroupMembers={setSelectedGroupMembers}
                setStartChatWith={setStartChatWith}
                setSelectedContact={setSelectedContact}
                setChat={setChat}
              />

              <SidebarTrigger className=" absolute top-3  left-full text-white bg-black" />
            </SidebarProvider>
          </ChoseMemberGroupProvider>
        </div>
        {/* Main Chat Area */}

        <ChatHeader
          AddChat={AddChat}
          chat={chat}
          // chatEndRef={chatEndRef}
          isLoading={isLoading}
          selectedContact={selectedContact}
          setContactSheet={setContactSheet}
          startChatWith={startChatWith}
          selectedGroupMembers={selectedGroupMembers}
        />

        {/* Profile Sidebar */}
        <AnimatePresence>
          <ProfileInfo
            chat={chat}
            selectedContact={selectedContact}
            contactSheet={contactSheet}
            setContactSheet={setContactSheet}
            selectedGroupMembers={selectedGroupMembers}
          />
        </AnimatePresence>
      </div>
      <div />


    

    </div>

     
   
    <CallDialog
    roomId={chat?.roomId || 0 }
    token=""
    username={selectedContact?.first_name || ""}
         openCallDialog={OpenCallDialog}
    setOpenCallDialog={setOpenCallDialog}
         />
    </>

  );
};

export default Chatpage;
