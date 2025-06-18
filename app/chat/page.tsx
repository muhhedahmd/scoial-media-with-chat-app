"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";

import dynamic from "next/dynamic";


const Chatpage = dynamic(
  () => import("./_componets/Chatpage"),
  {
    ssr: false,
  }
);

import { useSelector } from "react-redux";
import { userResponse } from "@/store/Reducers/mainUser";
import { usePresence } from "@/context/PresenceContext";

import { followerType } from "../api/follow/follower/[id]/route";

import { useCreateChatMutation } from "@/store/api/apiChat";

import { Chat, ProfilePicture, VideoChat } from "@prisma/client";
import { FixedContractGroup } from "../api/chat/start-chat-group/route";

import {  VideoCallProvider } from "@/context/CallContext";
import Header from "../maintimeline/_conponents/Header";

export type Contact = {
  id: number;
  email: string;
  first_name: string;
  user_name: string;
  last_name: string;
  profile: {
    profilePictures: ProfilePicture[] | undefined;
  } | null;
};

export default function ChatApp() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedGroupMembers, setSelectedGroupMembers] =
    useState<FixedContractGroup | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [startChatWith, setStartChatWith] = useState<followerType | null>(null);
  const {
    onlineUsers,
    subscribeToChatPresence,
    unsubscribeFromChatPresence,
    subscribeToGlobalPresence,
    unsubscribeFromGlobalPresence,
  } = usePresence();

  useEffect(() => {
    if (chat) subscribeToChatPresence(chat.id);
    return () => {
      if (chat) unsubscribeFromChatPresence(chat.id);
    };
  }, [chat, subscribeToChatPresence, unsubscribeFromChatPresence]);

  useEffect(() => {
    subscribeToGlobalPresence();
    return () => {
      unsubscribeFromGlobalPresence();
    };
  }, [subscribeToGlobalPresence, unsubscribeFromGlobalPresence]);



  const [contactSheet, setContactSheet] = useState(false);
  const [add, { isLoading, data }] = useCreateChatMutation();
  const CachedUser = useSelector(userResponse)!;

  const AddChat = () => {
    if (CachedUser.id && startChatWith?.user.id) {
      add({
        creatorId: CachedUser.id,
        receiverId: startChatWith?.user?.id,
      }).then((res) => {
        if (res.data && data && data?.reciver) {
          const _contact = data?.reciver as Contact;
          setSelectedContact(_contact);
          setStartChatWith(null);
        }
      });
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchParams = params.get("calling");
  
    if (searchParams) {
      // Delete the "calling" parameter from the URLSearchParams
      params.delete("calling");
  
      // Update the browser's URL without the "calling" parameter
      const newUrl = window.location.pathname 
      window.history.replaceState({}, document.title, newUrl);  // Updates the URL without reloading the page
    }
  }, []);
  


  return (
    

    <VideoCallProvider 
    chat={chat}
    currentUser={CachedUser}
    >
      <div className="w-full h-full flex justify-start items-start flex-col">

      
 <Header
        user={CachedUser }
        />

    <Chatpage
    AddChat={AddChat}
    
    chat={chat}
    // chatEndRef={chatEndRef}
    isLoading={isLoading}
    selectedContact={selectedContact}
    setContactSheet={setContactSheet}
    startChatWith={startChatWith}
    selectedGroupMembers={selectedGroupMembers}
    contactSheet={contactSheet}
    setChat={setChat}
    setSelectedContact={setSelectedContact}
    setSelectedGroupMembers={setSelectedGroupMembers}
    setStartChatWith={setStartChatWith}

    />
    </div>
    </VideoCallProvider>
    
  );
}
