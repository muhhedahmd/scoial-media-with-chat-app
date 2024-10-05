"use client"
import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { MessageOpenProvider } from "@/context/comment";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen w-full">
      <SessionProvider>
    {children}
      </SessionProvider>
    </div>
  );
};

export default Layout;