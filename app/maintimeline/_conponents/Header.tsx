import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell } from "lucide-react";
import Image from "next/image";
import React from "react";
import NotifcationPopup from "./NotifcationComp/NotifcationPopup";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";

const Header = ({
  user
} :{ 
  user: User
}) => {
  // const { data } = useSession();
  // const user = data?.user as User;

  return (
    <div className="h-12 flex justify-between  w-full   items-start px-6  bg-gray-100 shadow-2xl">
      <div className="flex h-full  gap-4 justify-center items-center">
        <Image src="/logo.svg" width={40} height={40} alt="logo" />
        <Input className="w-60 h-8" />
      </div>

      <div className="flex h-full  gap-4 justify-center items-center">
        
      
      <NotifcationPopup user={user}/>
        <Button variant={"outline"}>Log out</Button>
      </div>
    </div>
  );
};

export default Header;
