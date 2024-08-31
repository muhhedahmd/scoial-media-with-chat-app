"use client"
import { Toaster } from "@/components/ui/toaster";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default  function Home() {
  return (<>
    <main className=" text-white flex min-h-screen flex-col items-center justify-between p-24">
    <Link
    href="/profile"
    >
    profile
    </Link>
    </main>
      
      </>
  );
}
