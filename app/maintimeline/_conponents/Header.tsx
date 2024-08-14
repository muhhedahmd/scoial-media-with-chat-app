import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell } from "lucide-react";
import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <div className="h-12 flex justify-between  w-full   items-start px-6  bg-gray-100">
      <div className="flex h-full  gap-4 justify-center items-center">
        <Image src="./logo.svg" width={40} height={40} alt="logo" />
        <Input className="w-60 h-8" />
      </div>

      <div className="flex h-full  gap-4 justify-center items-center">
        <Button  variant={"link"} size={"icon"}><Bell className="w-4 h-4"/></Button>
       
        <Button variant={"outline"}>Log out</Button>
      </div>
    </div>
  );
};

export default Header;
