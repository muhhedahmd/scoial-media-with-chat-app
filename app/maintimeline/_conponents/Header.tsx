import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";
import NotifcationPopup from "./NotifcationComp/NotifcationPopup";
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
        
      
      <div
      
      className="hidden md:block w-fit"
      >

      {/* <NotifcationPopup user={user}/> */}
      </div>

      
        <Button className="hidden md:block" variant={"outline"}>Log out</Button>
      </div>
    </div>
  );
};

export default Header;
