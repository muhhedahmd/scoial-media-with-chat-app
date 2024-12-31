"use client";

import CoatumModel from "@/app/test/_comp/CoatumModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import gsap from "gsap";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Image,
  Link2,
  Phone,
  Plus,
  Search,
  Video,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Contact } from "../page";
import { MessageLinks, MessageMedia, User } from "@prisma/client";
import TabChatMedia from "./TabChatMedia";
import { ChatMediaTabsType } from "@/app/api/chat/chat-media-tabs/route";
import { FixedContractGroup } from "@/app/api/chat/start-chat-group/route";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InfiniteScroll } from "@/app/_components/InfintyScroll";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Skeleton } from "@nextui-org/react";
import { useVideoCall } from "@/context/CallContext";
import CallDialog from "./callDialog";
import { useSelector } from "react-redux";
import { userResponse } from "@/store/Reducers/mainUser";
import supabase from "@/lib/Supabase";
import { useToast } from "@/components/ui/use-toast";

const EnhancedContactProfile = ({
  selectedGroupMembers,
  selectedContact,
  isSelectedUserOnline,
  chatId,
}: // chat
{
  selectedGroupMembers: FixedContractGroup | null;
  chatId: number;
  isSelectedUserOnline: User | undefined;
  selectedContact: Contact | null;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<ChatMediaTabsType>("video&image");
  // const [animated, setAnimated] = useState(false);

  const [openCostumModel, setopenCostumModel] = useState<{
    media?: MessageMedia;
    medias: MessageMedia[] | MessageLinks[] | [];
    activeIdx: number;
    x: number;
    y: number;
    amimate: boolean;
  } | null>(null);

  const {toast} = useToast()
  const ProfilePic = selectedContact?.profile?.profilePictures?.[0]?.secure_url;
  const MAX_USERS_TO_SHOW = 3;
  const IsAbove =
    selectedGroupMembers?.members &&
    selectedGroupMembers?.members?.length > MAX_USERS_TO_SHOW;
  const toggleExpand = () => {
    if (isExpanded) {
      collapse();
    } else {
      expand();
    }
  };

  const expand = () => {
    if (!containerRef.current) return;
    setIsExpanded(true);

    const tl = gsap.timeline();

    tl.to(containerRef.current, {
      height: "calc(100vh - 5rem)",
      duration: 0.5,
      ease: "power2.inOut",
    })
      .to(
        ".avatar-container",
        {
          scale: 0.5,
          y: -15,
          x: "-186%",
          duration: 0.5,
          ease: "power2.inOut",
        },
        "<"
      )
      .to(
        ".user-name",
        {
          fontSize: "1rem",
          x: "-32%",
          y: "-240%",
          duration: 0.5,
          ease: "power2.inOut",
          stagger: 0.01,
        },
        "<"
      )
      .to(
        ".collapsible",
        {
          opacity: 0,
          height: 0,
          duration: 0.5,
          ease: "power2.inOut",
          autoAlpha: 0,
        },
        "<"
      )
      .to(".ToUp", { y: -115 }, "<")
      .to(".SearchInput", { autoAlpha: 1, height: "auto" }, "<")
      .to(".starter-container", { autoAlpha: 0, height: 0, duration: 0.3 }, "<")
      .to(".animted-container", { autoAlpha: 1, duration: 0.5 }, "<")
      .from(
        ".media-item",
        {
          opacity: 0,
          y: 20,
          duration: 0.5,
          stagger: 0.03,
          ease: "power2.out",
        },
        "-=0.3"
      );
  };

  const collapse = () => {
    if (!containerRef.current) return;
    const tl = gsap.timeline();

    tl.to(".media-item", {
      opacity: 0,
      y: 20,
      duration: 0.3,
      stagger: 0.02,
      ease: "power2.in",
    })
      .to(
        ".animted-container",
        { autoAlpha: 0, duration: 0.2, onComplete: () => setIsExpanded(false) },
        "<"
      )
      .to(
        ".avatar-container",
        {
          scale: 1,
          y: 0,
          x: 0,
          duration: 0.5,
          ease: "power2.inOut",
        },
        "<"
      )
      .to(
        ".user-name",
        {
          fontSize: "1.5rem",
          y: 0,
          x: 0,
          duration: 0.5,
          ease: "power2.inOut",
        },
        "<"
      )
      .to(
        ".collapsible",
        {
          opacity: 1,
          height: "auto",
          duration: 0.5,
          ease: "power2.inOut",
          autoAlpha: 1,
        },
        "<"
      )
      .to(".ToUp", { y: 0 }, "<")
      .to(".SearchInput", { autoAlpha: 0, height: 0 }, "<")
      .to(
        ".starter-container",
        { autoAlpha: 1, height: "auto", duration: 0.2 },
        "<"
      );
  };

  useEffect(() => {
    if (isExpanded) {
      gsap.from(".media-item", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.03,
        ease: "power2.out",
      });
    }
  }, [activeTab, isExpanded]);

  const [OpenMemberDialog, setOpenMemberDialog] = useState(false);

  const router = useRouter();

  const {
    activeCall,
    handleJoin ,
    handleStartCall,
    room,
setOpenCallDialog
  } = useVideoCall();


  // Rest of the component remains unchanged
  return (
    <>
      <div className="border-none h-full bg-background w-full">
        <div className="p-0">
          <ScrollArea className="h-[calc(100vh)] px-4" ref={containerRef}>
            {/* Avatar and name section */}
            {selectedContact ? (
              <div className="flex flex-col w-full justify-center  items-center mb-6 pt-4">
                <div className="avatar-container">
                  <Avatar className="w-24 h-24 ">
                    <AvatarImage
                      src={ProfilePic || ""}
                      alt={`${selectedContact?.first_name} profile`}
                    />
                    <AvatarFallback>
                      {selectedContact?.first_name[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h2 className="user-name text-2xl font-bold">
                  {selectedContact?.first_name +
                    " " +
                    selectedContact?.last_name}
                </h2>
              </div>
            ) : selectedGroupMembers ? (
              <>
                <div className="flex w-full justify-center items-center flex-col  gap-3 mb-6 pt-4">
                  <div className="z-0 flex items-center -space-x-2 *:ring *:ring-background">
                    {selectedGroupMembers.members &&
                      selectedGroupMembers?.members
                        ?.slice(0, MAX_USERS_TO_SHOW)
                        ?.map((mebmer) => {
                          const memberMsg =
                            mebmer?.profile?.profilePictures?.find(
                              (img: any) => img.type === "profile"
                            );
                          return (
                            <Avatar className="w-14 h-14 " key={mebmer.id}>
                              <AvatarFallback>
                                {" "}
                                {mebmer.first_name[0]}
                              </AvatarFallback>
                              <AvatarImage
                                alt={mebmer.first_name + " " + mebmer.last_name}
                                src={memberMsg?.secure_url || ""}
                              />
                            </Avatar>
                          );
                        })}
                    {IsAbove && (
                      <Avatar className=" w-14 h-14">
                        <AvatarFallback
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpenMemberDialog((prev) => !prev);
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
                  <div className="flex w-full justify-center items-center  flex-col">
                    <p className="uppercase text-xl  font-bold truncate">
                      {selectedGroupMembers.chat.name}
                    </p>
                    <p className="text-md text-gray-500 dark:text-gray-400 truncate">
                      {selectedGroupMembers.chat.description}
                      {/* {contact.} */}
                    </p>
                  </div>
                </div>
              </>
            ) : null}

            <div className="space-y-6">
              <div className="collapsible flex justify-around">
                <Button
                  variant="ghost"
                  onClick={async () => {
                    if(room && selectedContact?.id) {
                        if(!activeCall)

                        {

                          await handleStartCall(selectedContact?.id).then((res)=>{
                            toast({
                              title : "call is started" 


                            })
                            setOpenCallDialog(prev=>!prev)
                            router.push(`?calling=${room}`);
                          })
                        }
                        else if(activeCall && activeCall?.status === "PENDING" && activeCall.senderId !== selectedContact.id  )
                         {
                          await handleJoin().then((res)=>{
                     
                            setOpenCallDialog(prev=>!prev)
                            router.push(`?calling=${room}`);
                          })
                        }
                          if(activeCall && activeCall?.status === "PENDING" && activeCall.senderId === selectedContact.id ){
                            router.push(`?calling=${room}`);
                          }
                          setOpenCallDialog(true)
                          router.push(`?calling=${room}`);

                          await handleJoin().then((res)=>{
                            console.log({
                              resx :res
                            })
                   
                          }
                        )
                                      
                                          
     }
                    // }
                  }}
                  className="flex flex-col items-center"
                >
                  <Phone className="h-6 w-6 mb-1" />
                  <span className="text-xs">
                    {activeCall?.status === "ONGOING" ? "join again" : "call"}
                  </span>
                </Button>
                <Button
                  disabled={!!activeCall}
                  variant="ghost"
                  className=" py-1 flex flex-col items-center"
                >
                  <Video className="h-6 w-6 " />
                  <span className="text-xs">Video</span>
                </Button>
                <Button variant="ghost" className="flex flex-col items-center">
                  <Search className="h-6 w-6 " />
                  <span className="text-xs">Search</span>
                </Button>
              </div>

              <div className="collapsible">
                <h3 className="font-semibold mb-2">Notifications</h3>
                <div className="flex items-center justify-between">
                  <span>Mute notifications</span>
                  <Switch />
                </div>
              </div>

              {/* Shared Media section */}
              <div className="ToUp bg-white">
                <Button
                  variant="ghost"
                  className="w-full px-0 h-max flex items-center justify-between"
                  onClick={toggleExpand}
                >
                  <h3 className="font-semibold">Shared Media</h3>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </Button>

                {isExpanded ? (
                  <>
                    <Input className="w-full pl-3 p-1 SearchInput" />
                    <Tabs
                      value={activeTab}
                      onValueChange={(value) => {
                        const val = value as unknown as ChatMediaTabsType;
                        setActiveTab(val);
                      }}
                      className="w-full mt-4"
                    >
                      <TabsList className=" h-auto grid w-full grid-cols-3">
                        <TabsTrigger value="video&image">
                          images&video
                        </TabsTrigger>
                        <TabsTrigger value={"image" as ChatMediaTabsType}>
                          Images
                        </TabsTrigger>
                        <TabsTrigger value={"video" as ChatMediaTabsType}>
                          videos
                        </TabsTrigger>
                        <TabsTrigger value={"others" as ChatMediaTabsType}>
                          Docs
                        </TabsTrigger>
                        <TabsTrigger value={"link" as ChatMediaTabsType}>
                          Links
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent
                        value={activeTab}
                        className="animted-container mt-4"
                      >
                        <TabChatMedia
                          chatId={chatId}
                          setOpenCustomModel={setopenCostumModel}
                          type={activeTab}
                        />
                      </TabsContent>
                    </Tabs>
                  </>
                ) : (
                  <div className="starter-container  mt-2">
                    <TabChatMedia
                      chatId={chatId}
                      setOpenCustomModel={setopenCostumModel}
                      type={"video&image"}
                    />
                  </div>
                )}
              </div>

              <div className="collapsible">
                <h3 className="font-semibold mb-2">Shared Files</h3>
                <div className="space-y-2">
                  <TabChatMedia
                    chatId={chatId}
                    setOpenCustomModel={setopenCostumModel}
                    type={"others"}
                  />
                </div>
              </div>

              <div className="collapsible">
                <h3 className="font-semibold mb-2">Shared Links</h3>
                <div className="space-y-2">
                  <TabChatMedia
                    chatId={chatId}
                    setOpenCustomModel={setopenCostumModel}
                    type={"link"}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      <CoatumModel
        openCostumModel={openCostumModel}
        setopenCostumModel={setopenCostumModel}
      />

      <Dialog onOpenChange={setOpenMemberDialog} open={OpenMemberDialog}>
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <DialogContent>
          <ScrollArea>
            {selectedGroupMembers?.members &&
              selectedGroupMembers?.members.map((member) => {
                return (
                  <div
                    className="flex justify-start items-center gap-2"
                    key={member.id}
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{member.first_name[0]}</AvatarFallback>
                      <AvatarImage
                        src={
                          member.profile?.profilePictures?.find(
                            (im) => im.type === "profile"
                          )?.secure_url
                        }
                      ></AvatarImage>
                    </Avatar>
                    <div>
                      <p>
                        {member.first_name + " "} {member.last_name}
                      </p>
                      <Badge variant={"outline"}>{member?.role}</Badge>
                    </div>
                  </div>
                );
              })}
          </ScrollArea>
        </DialogContent>
      </Dialog>

  
    </>
  );
};

export default EnhancedContactProfile;
