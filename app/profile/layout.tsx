"use client";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import Image from "next/image";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
        <Toaster />
      <div className="h-12 flex justify-start items-center pl-3 w-full shadow-lg border-2 border-b-orange-400">
        <Image
        src={"./next.svg"}
        alt="logo"
        width={50}
        height={50}
/>
      </div>
      <SessionProvider>{children}</SessionProvider>
    </div>
  );
};

export default layout;
