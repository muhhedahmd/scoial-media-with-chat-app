import BluredImage from "@/app/_components/ImageWithPlaceholder";
import { FixedContract, UserWithPic } from "@/app/api/chat/contacts-users/route";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useStartChatGroupMutation } from "@/store/api/apiChat";
import { X } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Contact } from "../page";
import { FixedContractGroup } from "@/app/api/chat/start-chat-group/route";
import { Chat } from "@prisma/client";

const CereateDialogGroup = ({
  setSelectedContact,
  setSelectedGroupMembers,
  setChat,
  setChoseMemberGroup,
  setIsCreateGroup,
  setCerateDialog,
  ChoseMemberGroup,
  cerateDialog,
  IsCreateGroup,
  handleRemoveMember,
}: {
  setSelectedGroupMembers: Dispatch<SetStateAction< FixedContractGroup | null>>;
  setSelectedContact: Dispatch<SetStateAction<Contact | null>>;
  setChat: Dispatch<SetStateAction<Chat | null>>;
  setChoseMemberGroup: Dispatch<
    SetStateAction<[] | UserWithPic[] | null | undefined>
  >;
  setIsCreateGroup: Dispatch<SetStateAction<boolean>>;
  handleRemoveMember: (id: number) => void;
  IsCreateGroup: boolean;
  cerateDialog: boolean;
  setCerateDialog: React.Dispatch<React.SetStateAction<boolean>>;
  ChoseMemberGroup: [] | UserWithPic[] | null | undefined;
}) => {
  const [TilteAndDescription, setTilteAndDescription] = useState({
    Tilte: "",
    Description: "",
  });
  const { toast } = useToast();

  const [cearte, { isLoading }] = useStartChatGroupMutation();
  const cearteGroup = () => {
    if (ChoseMemberGroup && ChoseMemberGroup.length >= 1) {
      const newGroup = {
        name: TilteAndDescription.Tilte,
        description: TilteAndDescription.Description,
        memberIds: ChoseMemberGroup.map((user) => user.id),
      };
      cearte({
        ...newGroup,
      })
        .unwrap()
        .then((res) => {
          toast({
            title: "Group created successfully",
            variant: "success",
          });
          // setSelectedContact(
          //   res.members as UserWithPic[]
          // )
          setChat(res.chat);
          setChoseMemberGroup([]);
          setIsCreateGroup(false);
          setCerateDialog(false);
          setSelectedContact(null);
          setSelectedGroupMembers(res );
        })
        .catch((err) => {
          toast({ title: "Error creating group", variant: "destructive" });
        });
    }
  };

  return (
    <Dialog onOpenChange={setCerateDialog} open={cerateDialog}>
      <DialogContent aria-describedby={"description"}>
        <DialogHeader>
          <DialogTitle>Cerate Dialog</DialogTitle>
        </DialogHeader>

        <Input
          value={TilteAndDescription.Tilte}
          onChange={(e) =>
            setTilteAndDescription((prev) => ({
              ...prev,
              Tilte: e.target.value,
            }))
          }
          placeholder="title..."
        />
        <Input
          value={TilteAndDescription.Description}
          onChange={(e) =>
            setTilteAndDescription((prev) => ({
              ...prev,
              Description: e.target.value,
            }))
          }
          placeholder="description..."
        />

        <div
          className={cn(
            "w-full  h-0 transition-all duration-400 overflow-auto  flex flex-row justify-start items-start gap-2 flex-wrap ",
            IsCreateGroup &&
              " border-2 p-2 border-stone-500 rounded-lg  text-slate-900 h-[10rem] max-h-auto   "
            // "bg-white text-slate-800 hover:bg-slate-100 hover:text-slate-"
          )}
        >
          {ChoseMemberGroup &&
            [...ChoseMemberGroup].map((contract) => {
              const profile = contract.profile?.profilePictures?.find(
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
        <div className="flex gap-3 justify-end items-center w-full">
          <Button onClick={cearteGroup}>Cerate</Button>
          <DialogClose>
            <Button
              disabled={isLoading}
              variant={"ghost"}
              className="bg-destructive hover:bg-destructive/90  text-white hover:text-white "
            >
              close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CereateDialogGroup;
