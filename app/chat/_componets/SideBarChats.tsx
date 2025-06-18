
import {

  LucideMessagesSquare,

  Search,

  X,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { followerType } from "@/app/api/follow/follower/[id]/route";
import { Button } from "@/components/ui/button";


import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Chat, ChatType } from "@prisma/client";
import {
  useChoseMemberGroup,
} from "@/context/ChoseMemberGroupContext";
import { useDebounce } from "@uidotdev/usehooks";
import { useSelector } from "react-redux";
import { userResponse } from "@/store/Reducers/mainUser";
import { Contact } from "../page";
import { useEffect, useRef, useState } from "react";
import { FixedContract, UserWithPic } from "@/app/api/chat/contacts-users/route";
import ContactsList from "./Contacts";
import SuggestionContacts from "./SuggestionContacts";
import BluredImage from "@/app/_components/ImageWithPlaceholder";
import SearchcontactListUsers from "./SearchcontactListUsers";
import MainUserSide from "./MainUserSide";
import CereateDialogGroup from "./CereateDialogGroup";
import { FixedContractGroup } from "@/app/api/chat/start-chat-group/route";


// Menu items.

gsap.registerPlugin(ScrollTrigger);

export default function AppSidebarContent({
  setSelectedContact,
  setStartChatWith,
  setChat,
  setSelectedGroupMembers
}: {
  setSelectedGroupMembers :React.Dispatch<React.SetStateAction<FixedContractGroup | null>>;
  setStartChatWith: React.Dispatch<React.SetStateAction<followerType | null>>;
  setSelectedContact: React.Dispatch<React.SetStateAction<Contact | null>>;
  setChat: React.Dispatch<React.SetStateAction<Chat | null>>;
}) {
  const CachedUser = useSelector(userResponse)!;
  
  const [isGroupMode, setIsGroupMode] = useState(false);
  const { ChoseMemberGroup, setChoseMemberGroup } = useChoseMemberGroup();
  const [IsCreateGroup, setIsCreateGroup] = useState(false);
  const mainSectionRef = useRef<HTMLDivElement>(null);
  const groupSectionRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mainSection = mainSectionRef.current;
    const groupSection = groupSectionRef.current;
    const sidebar = sidebarRef.current;

    if (!mainSection || !groupSection || !sidebar) return;

    const tl = gsap.timeline({ paused: true });

    tl.to(mainSection, {
      display: "block",
      autoAlpha: 0,
      x: "-100%",
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
    })
      .to(
        groupSection,
        {
          display: "block",
          x: "0%",
          opacity: 1,
          duration: 0.5,
          ease: "power2.inOut",
          autoAlpha: 1,
        },
        "-=0.3"
      )
      .to(
        sidebar,
        {
          backgroundColor: "rgba(0, 0, 0, 0.05)",
          duration: 0.3,
          ease: "power2.inOut",
        },
        "-=0.5"
      );

    if (isGroupMode) {
      tl.play();
    } else {
      gsap.to(mainSection, {
        x: "0",
        opacity: 1,
        duration: 0.5,
        autoAlpha: 1,
        ease: "power2.inOut",
      });
      gsap.to(groupSection, {
        x: "-100%",
        opacity: 0,
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }

    // Set up ScrollTrigger for each contact item
    const contactItems = mainSection.querySelectorAll(".contact-item");
    contactItems.forEach((item, index) => {
      gsap.from(item, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        scrollTrigger: {
          trigger: item,
          start: "top bottom-=50",
          toggleActions: "play none none reverse",
        },
        delay: index * 0.1,
      });
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isGroupMode]);
  const handleRemoveMember = (contractId: number) => {
    const filtered = ChoseMemberGroup?.filter(
      (user: UserWithPic) => user.id !== contractId
    );
    setChoseMemberGroup(filtered);
  };
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const [cerateDialog, setCerateDialog] = useState(false);
  return (
    <>
      <Sidebar ref={sidebarRef} className=" bg-background transition-colors  duration-300">
        <SidebarHeader className="">
          <div className="flex flex-row justify-start gap-2">
            <h2>Chat</h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Contacts</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <AnimatePresence>
                  <motion.div className="w-full flex flex-col justify-between h-[90vh]">
                    <motion.div
                      className="flex-1 h-[70vh] relative overflow-hidden"
                      initial={{ x: -300, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -300, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="p-3 flex justify-start items-center gap-2 md:p-4">
                        <div className="relative mb-4 flex-grow">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 " />
                          <Input
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                            placeholder="Search..."
                            className="pl-10 py-1 text-sm  border-none focus:ring-2 focus:ring-purple-300 w-full"
                          />
                        </div>
                        <Button
                          className={cn(
                            "w-fit px-2 mb-4",
                            isGroupMode &&
                              "bg-slate-800 text-white hover:bg-slate-600 hover:text-white"
                          )}
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsGroupMode((prev) => !prev)}
                        >
                          <LucideMessagesSquare className="w-4 h-4" />
                        </Button>
                      </div>
                      <ScrollArea
                        ref={mainSectionRef}
                        className="flex-1
                      w-full px-2 main-section"
                      >
                        <ContactsList
                          setSelectedGroupMembers={setSelectedGroupMembers}
                          setStartChatWith={setStartChatWith}
                          setSelectedContact={setSelectedContact}
                          setChat={setChat}
                        />

                        <SuggestionContacts
                          setStartChatWith={setStartChatWith}
                          CachedUser={CachedUser}
                          setSelectedContact={setSelectedContact}
                        />
                      </ScrollArea>

                      <ScrollArea
                        ref={groupSectionRef}
                        className="flex-1 px-2 group-section absolute  w-full inset-0"
                        style={{
                          transform: "translateX(100%)",
                          opacity: 0,
                          position: "absolute",
                          top: "10%",
                        }}
                      >
                        <div className="mb-2 flex justify-start items-center gap-2 w-full create-group ">
                          <Button
                            onClick={() =>
                              setIsCreateGroup((prev) => {
                                if (prev) {
                                  setChoseMemberGroup([]);
                                  return false;
                                } else {
                                  return true;
                                }
                              })
                            }
                            className={cn(
                              " bg-white hover:bg-white w-full h-fit py-1  border-2 border-slate-600 text-slate-600 ",
                              IsCreateGroup &&
                                "hover:text-red-400 hover:border-red-400 bg-white hover:bg-white border-2 border-destructive  text-destructive hover:text-destructive"
                              // "rounded-md py-2 px-4 text-sm font-medium",
                            )}
                            variant={"ghost"}
                          >
                            {IsCreateGroup ? "Cancel" : "init Group"}
                          </Button>

                          {IsCreateGroup && (
                            <Button
                              disabled={
                                !(
                                  ChoseMemberGroup &&
                                  ChoseMemberGroup?.length &&
                                  ChoseMemberGroup.length >= 1
                                )
                              }
                              variant={"ghost"}
                              className="
                        bg-white hover:bg-white
                        hover:text-emerald-600
                        hover:border-emerald-600
                        

                        text-emerald-500 border-2 border-emerald-500 py-1 min-h-fit max-h-fit h-fit"
                              onClick={() => {
                                setCerateDialog(true);
                              }}
                            >
                              Cerate
                            </Button>
                          )}
                        </div>

                        <div
                          className={cn(
                            "w-full  h-0 transition-all duration-400 overflow-auto  flex flex-row justify-start items-start gap-2 flex-wrap ",
                            IsCreateGroup &&
                              " border-2 p-2 border-stone-950 rounded-md  text-slate-900 h-[10rem] max-h-auto   "
                            // "bg-white text-slate-800 hover:bg-slate-100 hover:text-slate-"
                          )}
                        >
                          {ChoseMemberGroup &&
                            [...ChoseMemberGroup].map((contract) => {
                              const profile =
                                contract.profile?.profilePictures?.find(
                                  (ty) => ty.type === "profile"
                                );
                              return (
                                <div
                                  key={contract.id}
                                  className=" w-fit flex relative  h-max  justify-center items-center flex-col gap-1"
                                >
                                  {profile ? (
                                    <div className="flex shadow-md rounded-full justify-center items-center relative ">
                                      <BluredImage
                                        width={profile?.width! || 0}
                                        height={profile?.height! || 0}
                                        blurhash={profile?.HashBlur || ""}
                                        imageUrl={profile?.secure_url || ""}
                                        alt="profile_pictre"
                                        quality={100}
                                        className="w-10 h-10 rounded-full"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-10 h-10  bg-slate-100 shadow-md rounded-full flex justify-center items-center text-lg">
                                      {contract?.first_name[0].toUpperCase()}
                                    </div>
                                  )}
                                  <div
                                    onClick={() => {
                                      handleRemoveMember(contract.id);
                                    }}
                                    className="p-1 bg-destructive rounded-full transition-all cursor-pointer  hover:bg-red-400  absolute bottom-[-.1rem] right-[.2rem] flex justify-center items-center"
                                  >
                                    <X className="w-3 h-3  text-white" />
                                  </div>
                                </div>
                              );
                            })}
                        </div>

                        {IsCreateGroup && CachedUser ? (
                          <>
                            {!searchTerm ? (
                              <>
                                <div className="w-full">
                                  <h3> last chat with </h3>
                                  <ContactsList
                                                              setSelectedGroupMembers={setSelectedGroupMembers}

                                   type="PRIVATE"
                                    groupMinaml={true}
                                    setStartChatWith={setStartChatWith}
                                    setSelectedContact={setSelectedContact}
                                    setChat={setChat}
                                  />
                                </div>
                                <SuggestionContacts
                                  groupMinaml={true}
                                  setStartChatWith={setStartChatWith}
                                  CachedUser={CachedUser}
                                  setSelectedContact={setSelectedContact}
                                />
                              </>
                            ) : (
                              <>
                                <SearchcontactListUsers
                                  debouncedSearchTerm={debouncedSearchTerm}
                                  userId={CachedUser.id}
                                />
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <ContactsList
                            setSelectedGroupMembers={setSelectedGroupMembers}
                              type={"GROUP" as ChatType}
                              setStartChatWith={setStartChatWith}
                              setSelectedContact={setSelectedContact}
                              setChat={setChat}
                            />
                          </>
                        )}
                      </ScrollArea>
                    </motion.div>

                    {CachedUser ? (
                      <motion.div className="flex w-full">
                        <MainUserSide CachedUser={CachedUser} />
                      </motion.div>
                    ) : (
                      <motion.div className="flex w-full p-2 justify-center items-center gap-2">
                        <div>
                          <Skeleton className="flex-1 w-10 h-10 rounded-xl bg-gray-300" />
                        </div>
                        <div className="flex h-[10] gap-2 justify-between flex-col">
                          <Skeleton className="w-28 h-2 bg-gray-300" />
                          <Skeleton className="w-24 h-2 bg-gray-300" />
                        </div>
                        <Skeleton className="w-5 h-5 rounded-xl bg-gray-300" />
                        <Skeleton className="flex-1" />
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <CereateDialogGroup
      setSelectedGroupMembers={setSelectedGroupMembers}
       setSelectedContact={setSelectedContact}
      setChat={setChat}
      setChoseMemberGroup={setChoseMemberGroup}
      setIsCreateGroup={setIsCreateGroup}
        ChoseMemberGroup={ChoseMemberGroup}
        IsCreateGroup={IsCreateGroup}
        cerateDialog={cerateDialog}
        handleRemoveMember={handleRemoveMember}
        setCerateDialog={setCerateDialog}
      />
    </>
  );
}
