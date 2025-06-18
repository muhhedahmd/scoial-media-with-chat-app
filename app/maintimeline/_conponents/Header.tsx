"use client"
import { useState } from "react"
import type { User } from "@prisma/client"
import { Bell, Home, Menu, MessageSquare, Search, UserIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "lucide-react"

interface HeaderProps {
  user: User
}

const Header = ({ user }: HeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  if(!user) return null

  return (
    <header className=" px-[3rem] sticky w-full top-0 z-50  border-b bg-white dark:bg-slate-950 dark:border-slate-800 shadow-sm">
      <div className=" flex h-14 items-center">
        <div className="flex items-center justify-between w-full">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col h-full">
                <div className="py-4">
                  <div className="flex items-center space-x-3 px-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt={user.first_name} />
                      <AvatarFallback>{user.first_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{`${user.first_name} ${user.last_name}`}</p>
                      <p className="text-sm text-slate-500">@{user.user_name}</p>
                    </div>
                  </div>
                </div>
                <nav className="space-y-2 px-2">
                  <Link href="/maintimeline" passHref>
                    <Button variant="ghost" className="w-full justify-start">
                      <Home className="h-5 w-5 mr-2 text-emerald-600" />
                      Home
                    </Button>
                  </Link>
                  <Link href="/profile" passHref>
                    <Button variant="ghost" className="w-full justify-start">
                      <UserIcon className="h-5 w-5 mr-2 text-emerald-600" />
                      Profile
                    </Button>
                  </Link>
                  <Link href="/chat" passHref>
                    <Button variant="ghost" className="w-full justify-start">
                      <MessageSquare className="h-5 w-5 mr-2 text-emerald-600" />
                      Messages
                    </Button>
                  </Link>
                  <Link href="/notifications" passHref>
                    <Button variant="ghost" className="w-full justify-start">
                      <Bell className="h-5 w-5 mr-2 text-emerald-600" />
                      Notifications
                    </Button>
                  </Link>
                </nav>
                <div className="mt-auto px-2 pb-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    {theme === "dark" ? (
                      <>
                        <SunIcon className="h-5 w-5 mr-2 text-yellow-500" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <MoonIcon className="h-5 w-5 mr-2 text-slate-700" />
                        Dark Mode
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <div className="flex items-center">
            <Link href="/maintimeline" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <span className="font-bold text-white">S</span>
              </div>
              <span className="font-bold text-xl hidden md:inline-block dark:text-white">Social</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/maintimeline" passHref>
              <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/chat" passHref>
              <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300">
                <MessageSquare className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/notifications" passHref>
              <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300">
                <Bell className="h-5 w-5" />
              </Button>
            </Link>
          </nav>

          {/* Search */}
          <div className={cn("flex items-center", isSearchOpen ? "flex-1 md:flex-none" : "")}>
            {isSearchOpen ? (
              <div className="relative w-full md:w-[300px]">
                <Input type="search" placeholder="Search..." className="pl-10 pr-4 h-9 w-full" autoFocus />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-600 dark:text-slate-300"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-600 dark:text-slate-300 hidden md:flex"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <SunIcon className="h-5 w-5 text-yellow-500" /> : <MoonIcon className="h-5 w-5" />}
            </Button>
            <Link href="/profile" passHref>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.first_name} />
                  <AvatarFallback>{user.first_name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
