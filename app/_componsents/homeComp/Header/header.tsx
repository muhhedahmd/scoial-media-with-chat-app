"use client"
import { deleteUser } from "@/store/Reducers/mainUser";
import { AppDispatch, RootState } from "@/store/store";
import { User } from "@prisma/client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
const Header = () => {
  const dispatch = useDispatch<AppDispatch>()
  const cachedUser = useSelector((state: RootState) => state.mainUserSlice.user) as User;

  const handleLogout= ()=>{
    signOut({ callbackUrl: '/' })
    dispatch(deleteUser())

  }


  if (cachedUser) {
    return (
      <header className="w-full p-6 flex items-center justify-between">
             <div className="text-2xl font-bold">
        <Link href="/">SocialApp</Link>
      </div>
      <div>
        <span className="mr-4">Welcome, {cachedUser.first_name}!</span>
        <button
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
          onClick={handleLogout}
        >
          Logout
        </button>
        <Link
        href="/timeline"
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
          
        >
          timeLine
        </Link>

      </div>
        </header>
    );
  } 

  return (
    <header className="w-full p-6 flex items-center justify-between">
      <div className="text-2xl font-bold">
        <Link href="/">SocialApp</Link>
      </div>
      <nav>
        <Link href="auth/login" className="mr-4 hover:text-gray-300">
          Login
        </Link>
        <Link
          href="auth/signin"
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
        >
          Sign Up
        </Link>
      </nav>
    </header>
  );
};

export default Header;
