


"use client"
import { UserWithPic } from "@/app/api/chat/contacts-users/route";
import { createContext, useState, useContext, Dispatch, SetStateAction } from "react";

interface ChoseMemberGroupType {
    ChoseMemberGroup : |  UserWithPic[] | null | undefined | [] 
    setChoseMemberGroup: Dispatch<SetStateAction<UserWithPic[] | [] | null | undefined>>
} 

const ChoseMemberGroupContext = createContext<ChoseMemberGroupType | undefined >(undefined);

const useChoseMemberGroup = () => {
  const context = useContext(ChoseMemberGroupContext);
  if (!context) {
    throw new Error("useChoseMemberGroup must be used within a ChoseMemberGroupProvider");
  }
  return context;
};

const ChoseMemberGroupProvider = ({ children }: { children: React.ReactNode }) => {
    const [ChoseMemberGroup, setChoseMemberGroup] = useState<
    UserWithPic[] | null | undefined | []
  >([]);


  return (
    <ChoseMemberGroupContext.Provider value={{ ChoseMemberGroup , setChoseMemberGroup }}>
      {children}
    </ChoseMemberGroupContext.Provider>
  );
};

export { ChoseMemberGroupContext, useChoseMemberGroup, ChoseMemberGroupProvider };