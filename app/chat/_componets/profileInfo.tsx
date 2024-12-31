"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePresence } from "@/context/PresenceContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Bell,
  ChevronLeft,
  FileText,
  Link,
  Phone,
  Search,
  Video,
} from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Contact } from "../page";
import EnhancedContactProfile from "./ProfileInfoContent";
import { FixedContractGroup } from "@/app/api/chat/start-chat-group/route";
import { Chat } from "@prisma/client";

interface ProfileInfoProps {
  selectedContact: Contact | null;
  chat: Chat | null;
  contactSheet: boolean;
  setContactSheet: React.Dispatch<React.SetStateAction<boolean>>;
  selectedGroupMembers: FixedContractGroup | null;
}

const ProfileInfo = ({
  selectedGroupMembers,
  selectedContact,
  contactSheet,
  setContactSheet,
  chat,
}: ProfileInfoProps) => {
  const { onlineUsers } = usePresence();
  const isSelectedUserOnline = onlineUsers?.find(
    (e) => e.id === selectedContact?.id
  );


  
  return (
    <>
      <Sheet open={contactSheet} onOpenChange={setContactSheet}>
        <SheetContent
          side="right"
          className="p-0 sm:max-w-md min-w-[30vw] w-screen"
        >
          <SheetHeader className="p-3 flex flex-row items-center justify-between">
            <SheetTitle>Chat Info</SheetTitle>
          </SheetHeader>
          {chat && (
            <EnhancedContactProfile
            selectedGroupMembers={selectedGroupMembers}
              chatId={chat.id}
              isSelectedUserOnline={isSelectedUserOnline}
              selectedContact={selectedContact}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ProfileInfo;
