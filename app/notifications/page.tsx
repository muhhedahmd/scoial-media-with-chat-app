"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Heart, MessageCircle, UserPlus, AtSign, Filter } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Header from "../maintimeline/_conponents/Header"
import { useSelector } from "react-redux"
import { userResponse } from "@/store/Reducers/mainUser"

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    type: "like",
    user: {
      id: "u1",
      name: "Alex Johnson",
      username: "alexj",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "liked your post",
    postId: "p1",
    postPreview: "Just had an amazing day at the beach! #summer",
    time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
  },
  {
    id: 2,
    type: "comment",
    user: {
      id: "u2",
      name: "Samantha Lee",
      username: "samlee",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "commented on your post",
    comment: "This looks amazing! Where is this beach?",
    postId: "p1",
    time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
  },
  {
    id: 3,
    type: "follow",
    user: {
      id: "u3",
      name: "Michael Chen",
      username: "mikechen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "started following you",
    time: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: true,
  },
  {
    id: 4,
    type: "mention",
    user: {
      id: "u4",
      name: "Jessica Williams",
      username: "jesswill",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "mentioned you in a comment",
    comment: "I think @username would love this place too!",
    postId: "p2",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: false,
  },
  {
    id: 5,
    type: "like",
    user: {
      id: "u5",
      name: "David Kim",
      username: "davidk",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "liked your comment",
    comment: "That's a great perspective!",
    postId: "p3",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    read: true,
  },
  {
    id: 6,
    type: "comment",
    user: {
      id: "u6",
      name: "Emily Davis",
      username: "emilyd",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "replied to your comment",
    comment: "I completely agree with you!",
    postId: "p3",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    read: true,
  },
  {
    id: 7,
    type: "mention",
    user: {
      id: "u7",
      name: "Ryan Martinez",
      username: "ryanm",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "mentioned you in a post",
    postPreview: "Hanging out with @username at the concert!",
    postId: "p4",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    read: true,
  },
  {
    id: 8,
    type: "follow",
    user: {
      id: "u8",
      name: "Olivia Brown",
      username: "oliviab",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "started following you",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    read: true,
  },
]

// Helper function to group notifications by date
const groupNotificationsByDate = (notifications : any) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const thisWeekStart = new Date(today)
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay())

  return {
    today: notifications.filter((n) => n.time >= today),
    yesterday: notifications.filter((n) => n.time >= yesterday && n.time < today),
    thisWeek: notifications.filter((n) => n.time >= thisWeekStart && n.time < yesterday),
    earlier: notifications.filter((n) => n.time < thisWeekStart),
  }
}

// Notification icon component
const NotificationIcon = ({ type }:{
  type: string
}) => {
  switch (type) {
    case "like":
      return <Heart className="h-4 w-4 text-red-500" />
    case "comment":
      return <MessageCircle className="h-4 w-4 text-blue-500" />
    case "follow":
      return <UserPlus className="h-4 w-4 text-green-500" />
    case "mention":
      return <AtSign className="h-4 w-4 text-purple-500" />
    default:
      return <Bell className="h-4 w-4 text-gray-500" />
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const cachedUser = useSelector(userResponse)!



  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])
  if(!cachedUser){
    return null
  }

  const groupedNotifications = groupNotificationsByDate(
    activeTab === "all" ? notifications : notifications.filter((n) => n.type === activeTab),
  )

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const renderNotificationGroup = (title, notificationsList) => {
    if (notificationsList.length === 0) return null

    return (
      <div className="space-y-4 mb-8">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {notificationsList.map((notification) => (
          <Card key={notification.id} className={`p-4 ${!notification.read ? "bg-muted/30" : ""}`}>
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <img src={notification.user.avatar || "/placeholder.svg"} alt={notification.user.name} />
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{notification.user.name}</p>
                  <Badge variant="outline" className="h-5 px-1.5">
                    <NotificationIcon type={notification.type} />
                    <span className="ml-1 text-xs">{notification.type}</span>
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {notification.content}
                  {notification.comment && <span className="block mt-1 italic text-xs">"{notification.comment}"</span>}
                  {notification.postPreview && (
                    <span className="block mt-1 italic text-xs">"{notification.postPreview}"</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
                    Math.round((notification.time - new Date()) / (1000 * 60 * 60 * 24)),
                    "day",
                  )}
                </p>
              </div>
              {!notification.read && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => markAsRead(notification.id)}>
                  <Check className="h-4 w-4" />
                  <span className="sr-only">Mark as read</span>
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
<Header 
user={cachedUser}
/>
    <div className="container max-w-4xl py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setActiveTab("all")}>All notifications</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("like")}>Likes only</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("comment")}>Comments only</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("follow")}>Follows only</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("mention")}>Mentions only</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="animate-spin">
            <Bell className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Loading notifications...</p>
        </div>
      ) : (
        <>
          {unreadCount > 0 && (
            <div className="mb-4">
              <Badge variant="secondary" className="mb-2">
                {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
              </Badge>
            </div>
          )}

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="like">Likes</TabsTrigger>
              <TabsTrigger value="comment">Comments</TabsTrigger>
              <TabsTrigger value="follow">Follows</TabsTrigger>
              <TabsTrigger value="mention">Mentions</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              {Object.keys(groupedNotifications).every((key) => groupedNotifications[key].length === 0) ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Bell className="h-12 w-12 text-muted-foreground" />
                  <p className="text-xl font-medium">No notifications</p>
                  <p className="text-muted-foreground text-center max-w-md">
                    You don't have any {activeTab !== "all" ? activeTab : ""} notifications yet. When you get
                    notifications, they'll appear here.
                  </p>
                </div>
              ) : (
                <>
                  {renderNotificationGroup("Today", groupedNotifications.today)}
                  {renderNotificationGroup("Yesterday", groupedNotifications.yesterday)}
                  {renderNotificationGroup("This Week", groupedNotifications.thisWeek)}
                  {renderNotificationGroup("Earlier", groupedNotifications.earlier)}
                </>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
    </>

  )
}
