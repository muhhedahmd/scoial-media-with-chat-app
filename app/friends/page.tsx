"use client"

import { useState, useEffect } from "react"
import { UserPlus, UserCheck, MessageSquare, Search, Filter, Check, X, Clock, Users, UserCircle } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock friends data
const mockFriends = [
  {
    id: "f1",
    name: "Alex Johnson",
    username: "alexj",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFriends: 12,
    online: true,
    lastActive: new Date(),
  },
  {
    id: "f2",
    name: "Samantha Lee",
    username: "samlee",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFriends: 8,
    online: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: "f3",
    name: "Michael Chen",
    username: "mikechen",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFriends: 5,
    online: true,
    lastActive: new Date(),
  },
  {
    id: "f4",
    name: "Jessica Williams",
    username: "jesswill",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFriends: 3,
    online: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "f5",
    name: "David Kim",
    username: "davidk",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFriends: 15,
    online: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: "f6",
    name: "Emily Davis",
    username: "emilyd",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFriends: 7,
    online: true,
    lastActive: new Date(),
  },
  {
    id: "f7",
    name: "Ryan Martinez",
    username: "ryanm",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFriends: 4,
    online: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  },
  {
    id: "f8",
    name: "Olivia Brown",
    username: "oliviab",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFriends: 9,
    online: true,
    lastActive: new Date(),
  },
]

// Mock friend requests
const mockFriendRequests = [
  {
    id: "r1",
    name: "Taylor Wilson",
    username: "taylorw",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFriends: 3,
    requestTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "r2",
    name: "Jordan Smith",
    username: "jordans",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFriends: 5,
    requestTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: "r3",
    name: "Casey Parker",
    username: "caseyp",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFriends: 1,
    requestTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
  },
]

// Mock suggested friends
const mockSuggestedFriends = [
  {
    id: "s1",
    name: "Morgan Lee",
    username: "morganl",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFriends: 8,
    reason: "8 mutual friends",
  },
  {
    id: "s2",
    name: "Jamie Rodriguez",
    username: "jamier",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFriends: 6,
    reason: "Followed by Alex Johnson and 5 others",
  },
  {
    id: "s3",
    name: "Riley Thompson",
    username: "rileyt",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFriends: 4,
    reason: "Based on your interests",
  },
  {
    id: "s4",
    name: "Avery Garcia",
    username: "averyg",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFriends: 3,
    reason: "From your contacts",
  },
  {
    id: "s5",
    name: "Cameron Wright",
    username: "cameronw",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFriends: 7,
    reason: "7 mutual friends",
  },
]

export default function FriendsPage() {
  const [friends, setFriends] = useState(mockFriends)
  const [friendRequests, setFriendRequests] = useState(mockFriendRequests)
  const [suggestedFriends, setSuggestedFriends] = useState(mockSuggestedFriends)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const onlineFriends = filteredFriends.filter((friend) => friend.online)

  const acceptFriendRequest = (id) => {
    const request = friendRequests.find((req) => req.id === id)
    if (request) {
      setFriends((prev) => [
        ...prev,
        {
          id: request.id,
          name: request.name,
          username: request.username,
          avatar: request.avatar,
          mutualFriends: request.mutualFriends,
          online: false,
          lastActive: new Date(),
        },
      ])

      setFriendRequests((prev) => prev.filter((req) => req.id !== id))
    }
  }

  const rejectFriendRequest = (id) => {
    setFriendRequests((prev) => prev.filter((req) => req.id !== id))
  }

  const addFriend = (id) => {
    setSuggestedFriends((prev) => prev.filter((friend) => friend.id !== id))
    // In a real app, you would send a friend request here
  }

  const removeFriend = (id) => {
    setFriends((prev) => prev.filter((friend) => friend.id !== id))
  }

  const renderFriendItem = (friend) => (
    <div key={friend.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-md">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <img src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
          </Avatar>
          {friend.online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
          )}
        </div>
        <div>
          <p className="font-medium">{friend.name}</p>
          <p className="text-xs text-muted-foreground">@{friend.username}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <MessageSquare className="h-4 w-4" />
          <span className="sr-only">Message</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Add to Close Friends</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => removeFriend(friend.id)}>
              Remove Friend
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )

  return (
    <div className="container max-w-4xl py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Friends</h1>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Friend
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search friends..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>All Friends</span>
            <Badge variant="secondary" className="ml-1">
              {friends.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="online" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            <span>Online</span>
            <Badge variant="secondary" className="ml-1">
              {onlineFriends.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Requests</span>
            <Badge variant="secondary" className="ml-1">
              {friendRequests.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="animate-spin">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Loading friends...</p>
            </div>
          ) : filteredFriends.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px] p-4">
                  <div className="space-y-1">{filteredFriends.map(renderFriendItem)}</div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <UserCircle className="h-12 w-12 text-muted-foreground" />
              <p className="text-xl font-medium">No friends found</p>
              <p className="text-muted-foreground text-center max-w-md">
                {searchQuery
                  ? `No friends match "${searchQuery}"`
                  : "You don't have any friends yet. Check out the suggestions below."}
              </p>
            </div>
          )}

          {!searchQuery && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Suggested Friends</h2>
                <Button variant="link" size="sm">
                  See All
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestedFriends.slice(0, 4).map((suggestion) => (
                  <Card key={suggestion.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <img src={suggestion.avatar || "/placeholder.svg"} alt={suggestion.name} />
                          </Avatar>
                          <div>
                            <p className="font-medium">{suggestion.name}</p>
                            <p className="text-xs text-muted-foreground">@{suggestion.username}</p>
                            <p className="text-xs text-muted-foreground mt-1">{suggestion.reason}</p>
                          </div>
                        </div>
                        <Button size="sm" onClick={() => addFriend(suggestion.id)}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="online">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="animate-spin">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Loading online friends...</p>
            </div>
          ) : onlineFriends.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px] p-4">
                  <div className="space-y-1">{onlineFriends.map(renderFriendItem)}</div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <UserCheck className="h-12 w-12 text-muted-foreground" />
              <p className="text-xl font-medium">No friends online</p>
              <p className="text-muted-foreground text-center max-w-md">
                None of your friends are currently online. Check back later!
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="animate-spin">
                <UserPlus className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Loading friend requests...</p>
            </div>
          ) : friendRequests.length > 0 ? (
            <div className="space-y-4">
              {friendRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <img src={request.avatar || "/placeholder.svg"} alt={request.name} />
                        </Avatar>
                        <div>
                          <p className="font-medium">{request.name}</p>
                          <p className="text-xs text-muted-foreground">@{request.username}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <p className="text-xs text-muted-foreground">{request.mutualFriends} mutual friends</p>
                            <span className="text-xs text-muted-foreground">•</span>
                            <p className="text-xs text-muted-foreground">
                              <Clock className="inline h-3 w-3 mr-1" />
                              {new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
                                Math.round((request.requestTime - new Date()) / (1000 * 60 * 60 * 24)),
                                "day",
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => acceptFriendRequest(request.id)}>
                          <Check className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => rejectFriendRequest(request.id)}>
                          <X className="h-4 w-4 mr-2" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <UserPlus className="h-12 w-12 text-muted-foreground" />
              <p className="text-xl font-medium">No friend requests</p>
              <p className="text-muted-foreground text-center max-w-md">
                You don't have any pending friend requests at the moment.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
