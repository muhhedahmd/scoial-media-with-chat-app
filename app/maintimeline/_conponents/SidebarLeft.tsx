"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Home, Users, Bookmark, Settings, Bell, MessageSquare } from "lucide-react"
import Link from "next/link"
import type { Profile, User } from "@prisma/client"
import MinmalFollowerSection from "./userInfoComponents/MinmalFollowerSection"
import { ProfileWithPic } from "@/Types"
import BlurredImage from "@/app/_components/ImageWithPlaceholder"

interface SidebarLeftProps {
  isLoading: boolean
  profile: ProfileWithPic
  user: User
}

const SidebarLeft = ({ isLoading, profile, user }: SidebarLeftProps) => {
console.log({profile})

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4 mb-6">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const navItems = [
    { icon: <Home className="h-5 w-5" />, label: "Home", href: "/maintimeline" },
    { icon: <Users className="h-5 w-5" />, label: "Friends", href: "/friends" },
    { icon: <MessageSquare className="h-5 w-5" />, label: "Messages", href: "/chat" },
    { icon: <Bell className="h-5 w-5" />, label: "Notifications", href: "/notifications" },
    { icon: <Bookmark className="h-5 w-5" />, label: "Saved", href: "/saved" },
    { icon: <Settings className="h-5 w-5" />, label: "Settings", href: "/settings" },
  ]

  const pPic = profile?.profilePictures.find((item)=>item.type === "profile")

 {profile?.profilePictures.find((item)=>item.type === "profile") ? (
              <BlurredImage
                imageUrl={pPic?.secure_url ||""}
                alt={`${user.first_name} ${user.last_name}`}
                width={40}
                height={40}
                blurhash={pPic?.HashBlur || ""}
                quality={100}
                className="rounded-full h-10 w-10 object-cover"
              />
            ) : (
              <Avatar className="h-10 w-10">
                <AvatarFallback>{user.first_name?.charAt(0)}</AvatarFallback>
              </Avatar>
            )}


  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        {/* User Profile Section */}
        <div className="flex items-center space-x-3 mb-6">
       {profile?.profilePictures.find((item)=>item.type === "profile") ? (
              <BlurredImage

                imageUrl={pPic?.secure_url ||""}
                alt={`${user.first_name} ${user.last_name}`}
                width={40}
                height={40}
                blurhash={pPic?.HashBlur || ""}
                quality={100}
                className="rounded-full h-12 w-12 object-cover"
              />
            ) : (
              <Avatar className="h-12 w-12">
                <AvatarFallback>{user.first_name?.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
          <div>
            <h3 className="font-medium text-slate-900 dark:text-white">
              {user.first_name} {user.last_name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">@{user.user_name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">{profile.title}</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-6">
          <MinmalFollowerSection userId={user.id} />
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Button>
            </Link>
          ))}
        </nav>
      </CardContent>
    </Card>
  )
}

export default SidebarLeft
