// PresenceContext.tsx
"use client";
import supabase from "@/lib/Supabase";
import { Gender, Role, User } from "@prisma/client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export type UserStatus = {
  onlineAt: string;
  id: number;
  email: string;
  first_name: string;
  user_name: string;
  last_name: string;
  role: Role;
  gender: Gender;
  expiresAt: Date;
  isPrivate: boolean;
};

export type ChatPresenceState = {
  [chatId: number]: User[]; // Chat-specific online users
};

interface PresenceContextType {
  onlineUsers: User[]; // Global online users (server-wide presence)
  chatOnlineUsers: ChatPresenceState; // Chat-specific online users
  subscribeToGlobalPresence: () => void; // Subscribe to global presence
  unsubscribeFromGlobalPresence: () => void; // Unsubscribe from global presence
  subscribeToChatPresence: (chatId: number) => void; // Subscribe to chat-specific presence
  unsubscribeFromChatPresence: (chatId: number) => void; // Unsubscribe from chat-specific presence
}

const PresenceContext = createContext<PresenceContextType | undefined>(
  undefined
);

interface PresenceProviderProps {
  authenticatedUser: User;
  children: React.ReactNode;
}

const roomChannels: { [key: string]: ReturnType<typeof supabase.channel> } = {}; // For managing channels

export const PresenceProvider: React.FC<PresenceProviderProps> = ({
  authenticatedUser,
  children,
}) => {
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]); // Global online users state
  const [chatOnlineUsers, setChatOnlineUsers] = useState<ChatPresenceState>({}); // Chat-specific online users state

  const subscribeToGlobalPresence = useCallback(() => {
    // Global channel for tracking all users' online status (server presence)
    const globalChannel = supabase.channel("server_presence");

    const userStatus: UserStatus = {
      ...authenticatedUser,

      onlineAt: new Date().toISOString(),
    };

    globalChannel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await globalChannel.track(userStatus);
      }
    });

    globalChannel.on("presence", { event: "sync" }, () => {
      const presenceState = globalChannel.presenceState();
      const globalUsers = Object.values(presenceState)
        .flatMap((userArray: any) => userArray)
        .map((user: any) => user as User);

      setOnlineUsers(globalUsers); // Update global online users
    });

    roomChannels["server_presence"] = globalChannel;
  }, [authenticatedUser]);

  const unsubscribeFromGlobalPresence = useCallback(() => {
    const globalChannel = roomChannels["server_presence"];
    if (globalChannel) {
      globalChannel.unsubscribe();
      setOnlineUsers([]); // Clear global online users
      delete roomChannels["server_presence"];
    }
  }, []);

  const subscribeToChatPresence = useCallback(
    (chatId: number) => {
      // Chat-specific channel for tracking users' online status in a specific chat
      const chatChannel = supabase.channel(`chat_${chatId}`);

      const userStatus: UserStatus = {
        ...authenticatedUser,
        onlineAt: new Date().toISOString(),
      };

      chatChannel.subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await chatChannel.track(userStatus);
        }
      });

      chatChannel.on("presence", { event: "sync" }, () => {
        const presenceState = chatChannel.presenceState();
        const chatUsers = Object.values(presenceState)
          .flatMap((userArray: any) => userArray)
          .map((user: any) => user as User);

        setChatOnlineUsers((prev) => ({
          ...prev,
          [chatId]: chatUsers, // Update the online users for this specific chat
        }));
      });

      roomChannels[`chat_${chatId}`] = chatChannel;
    },
    [authenticatedUser]
  );

  const unsubscribeFromChatPresence = useCallback((chatId: number) => {
    const chatChannel = roomChannels[`chat_${chatId}`];
    if (chatChannel) {
      chatChannel.unsubscribe();
      setChatOnlineUsers((prev) => {
        const newState = { ...prev };
        delete newState[chatId]; // Remove chat-specific users on unsubscribe
        return newState;
      });
      delete roomChannels[`chat_${chatId}`];
    }
  }, []);

  useEffect(() => {
    subscribeToGlobalPresence(); // Subscribe to global presence on mount

    return () => {
      unsubscribeFromGlobalPresence(); // Unsubscribe from global presence on unmount
    };
  }, [subscribeToGlobalPresence, unsubscribeFromGlobalPresence]);

  return (
    <PresenceContext.Provider
      value={{
        onlineUsers,
        chatOnlineUsers,
        subscribeToGlobalPresence,
        unsubscribeFromGlobalPresence,
        subscribeToChatPresence,
        unsubscribeFromChatPresence,
      }}
    >
      {children}
    </PresenceContext.Provider>
  );
};

export const usePresence = (): PresenceContextType => {
  const context = useContext(PresenceContext);
  if (!context) {
    throw new Error("usePresence must be used within a PresenceProvider");
  }
  return context;
};
