"use client"

import { useState } from "react"
import {
  SearchIcon,
  User,
  Hash,
  FileText,
  Clock,
  Flame,
  UserPlus,
  UserCheck,
  ImageIcon,
  Video,
  Filter,
} from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock search results
const mockPeopleResults = [
  {
    id: "u1",
    name: "Alex Johnson",
    username: "alexj",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Photographer and travel enthusiast",
    followers: 1243,
    following: true,
  },
  {
    id: "u2",
    name: "Samantha Lee",
    username: "samlee",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Digital artist | UI/UX Designer",
    followers: 5678,
    following: false,
  },
  {
    id: "u3",
    name: "Michael Chen",
    username: "mikechen",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Software engineer and coffee addict",
    followers: 892,
    following: true,
  },
  {
    id: "u4",
    name: "Jessica Williams",
    username: "jesswill",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Food blogger | Recipe developer",
    followers: 3421,
    following: false,
  },
  {
    id: "u5",
    name: "David Kim",
    username: "davidk",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Fitness coach and nutrition expert",
    followers: 7654,
    following: false,
  },
]

const mockPostResults = [
  {
    id: "p1",
    user: {
      id: "u1",
      name: "Alex Johnson",
      username: "alexj",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Just visited the most amazing beach in Bali! The sunset was incredible. #travel #bali #sunset",
    image: "/placeholder.svg?height=200&width=400",
    likes: 342,
    comments: 56,
    time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "p2",
    user: {
      id: "u2",
      name: "Samantha Lee",
      username: "samlee",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Just finished my latest digital art piece! What do you think? #digitalart #illustration",
    image: "/placeholder.svg?height=200&width=400",
    likes: 789,
    comments: 123,
    time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: "p3",
    user: {
      id: "u3",
      name: "Michael Chen",
      username: "mikechen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Just solved the most challenging coding problem! Here's my approach... #coding #algorithms #javascript",
    likes: 156,
    comments: 42,
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
  },
  {
    id: "p4",
    user: {
      id: "u4",
      name: "Jessica Williams",
      username: "jesswill",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Made this delicious homemade pasta today! Recipe in the comments. #food #cooking #homemade",
    image: "/placeholder.svg?height=200&width=400",
    likes: 421,
    comments: 87,
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
  },
]

const mockHashtagResults = [
  {
    id: "h1",
    tag: "photography",
    postCount: 1243567,
    trending: true,
  },
  {
    id: "h2",
    tag: "travel",
    postCount: 9876543,
    trending: true,
  },
  {
    id: "h3",
    tag: "food",
    postCount: 5432198,
    trending: false,
  },
  {
    id: "h4",
    tag: "fitness",
    postCount: 3456789,
    trending: true,
  },
  {
    id: "h5",
    tag: "technology",
    postCount: 2345678,
    trending: false,
  },
  {
    id: "h6",
    tag: "art",
    postCount: 4567890,
    trending: false,
  },
]

// Mock recent searches
const mockRecentSearches = [
  { id: "r1", term: "travel photography", type: "term" },
  { id: "r2", term: "samlee", type: "user" },
  { id: "r3", term: "fitness", type: "hashtag" },
  { id: "r4", term: "coding tutorials", type: "term" },
  { id: "r5", term: "healthy recipes", type: "term" },
]

// Mock trending searches
const mockTrendingSearches = [
  { id: "t1", term: "summer fashion", count: 45678 },
  { id: "t2", term: "world cup", count: 98765 },
  { id: "t3", term: "new music friday", count: 34567 },
  { id: "t4", term: "tech news", count: 23456 },
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [recentSearches, setRecentSearches] = useState(mockRecentSearches)

  const [peopleResults, setPeopleResults] = useState([])
  const [postResults, setPostResults] = useState([])
  const [hashtagResults, setHashtagResults] = useState([])

  const handleSearch = (e) => {
    e.preventDefault()

    if (!searchQuery.trim()) return

    setIsLoading(true)
    setHasSearched(true)

    // Simulate API call
    setTimeout(() => {
      setPeopleResults(
        mockPeopleResults.filter(
          (person) =>
            person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            person.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            person.bio.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )

      setPostResults(
        mockPostResults.filter(
          (post) =>
            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.user.username.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )

      setHashtagResults(mockHashtagResults.filter((tag) => tag.tag.toLowerCase().includes(searchQuery.toLowerCase())))

      // Add to recent searches
      if (!recentSearches.some((search) => search.term === searchQuery)) {
        setRecentSearches((prev) => [
          {
            id: `r${Date.now()}`,
            term: searchQuery,
            type: searchQuery.startsWith("#") ? "hashtag" : searchQuery.startsWith("@") ? "user" : "term",
          },
          ...prev.slice(0, 4),
        ])
      }

      setIsLoading(false)
    }, 1000)
  }

  const clearRecentSearch = (id) => {
    setRecentSearches((prev) => prev.filter((search) => search.id !== id))
  }

  const clearAllRecentSearches = () => {
    setRecentSearches([])
  }

  const handleRecentSearchClick = (term) => {
    setSearchQuery(term)
    // Trigger search immediately
    const event = { preventDefault: () => {} }
    handleSearch(event)
  }

  const toggleFollow = (userId) => {
    setPeopleResults((prev) =>
      prev.map((person) => (person.id === userId ? { ...person, following: !person.following } : person)),
    )
  }

  const getTotalResultsCount = () => {
    return peopleResults.length + postResults.length + hashtagResults.length
  }

  return (
    <div className="container max-w-4xl py-6">
      <div className="mb-6">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search people, posts, hashtags..."
              className="pl-10 pr-20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
              disabled={!searchQuery.trim() || isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>
      </div>

      {!hasSearched ? (
        <div className="space-y-8">
          {recentSearches.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Recent Searches</h2>
                <Button variant="ghost" size="sm" onClick={clearAllRecentSearches}>
                  Clear All
                </Button>
              </div>

              <div className="space-y-2">
                {recentSearches.map((search) => (
                  <div
                    key={search.id}
                    className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                    onClick={() => handleRecentSearchClick(search.term)}
                  >
                    <div className="flex items-center gap-3">
                      {search.type === "user" ? (
                        <User className="h-4 w-4 text-muted-foreground" />
                      ) : search.type === "hashtag" ? (
                        <Hash className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{search.term}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        clearRecentSearch(search.id)
                      }}
                    >
                      <span className="sr-only">Remove</span>×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium">Trending Searches</h2>
              <Flame className="h-4 w-4 text-orange-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockTrendingSearches.map((trend) => (
                <Card
                  key={trend.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRecentSearchClick(trend.term)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{trend.term}</p>
                        <p className="text-xs text-muted-foreground">{trend.count.toLocaleString()} searches</p>
                      </div>
                      <Flame className="h-4 w-4 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="animate-spin">
            <SearchIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Searching for "{searchQuery}"...</p>
        </div>
      ) : getTotalResultsCount() > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium">Results for "{searchQuery}"</h2>
            <Badge variant="secondary">{getTotalResultsCount()}</Badge>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <SearchIcon className="h-4 w-4" />
                <span>All</span>
              </TabsTrigger>
              <TabsTrigger value="people" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>People</span>
                <Badge variant="secondary" className="ml-1">
                  {peopleResults.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="posts" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Posts</span>
                <Badge variant="secondary" className="ml-1">
                  {postResults.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="hashtags" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                <span>Hashtags</span>
                <Badge variant="secondary" className="ml-1">
                  {hashtagResults.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-8">
              {peopleResults.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-medium">People</h3>
                    {peopleResults.length > 3 && (
                      <Button variant="link" size="sm" onClick={() => setActiveTab("people")}>
                        See all
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {peopleResults.slice(0, 3).map((person) => (
                      <Card key={person.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10">
                                <img src={person.avatar || "/placeholder.svg"} alt={person.name} />
                              </Avatar>
                              <div>
                                <p className="font-medium">{person.name}</p>
                                <p className="text-xs text-muted-foreground">@{person.username}</p>
                                <p className="text-sm mt-1">{person.bio}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {person.followers.toLocaleString()} followers
                                </p>
                              </div>
                            </div>
                            <Button
                              variant={person.following ? "outline" : "default"}
                              size="sm"
                              onClick={() => toggleFollow(person.id)}
                            >
                              {person.following ? (
                                <>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Following
                                </>
                              ) : (
                                <>
                                  <UserPlus className="h-4 w-4 mr-2" />
                                  Follow
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {postResults.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-medium">Posts</h3>
                    {postResults.length > 2 && (
                      <Button variant="link" size="sm" onClick={() => setActiveTab("posts")}>
                        See all
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {postResults.slice(0, 2).map((post) => (
                      <Card key={post.id}>
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <img src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
                              </Avatar>
                              <div>
                                <p className="font-medium">{post.user.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  @{post.user.username} •
                                  {new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
                                    Math.round((post.time - new Date()) / (1000 * 60 * 60 * 24)),
                                    "day",
                                  )}
                                </p>
                              </div>
                            </div>

                            <p>{post.content}</p>

                            {post.image && (
                              <div className="rounded-md overflow-hidden">
                                <img src={post.image || "/placeholder.svg"} alt="Post" className="w-full h-auto" />
                              </div>
                            )}

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{post.likes} likes</span>
                              <span>{post.comments} comments</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {hashtagResults.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-medium">Hashtags</h3>
                    {hashtagResults.length > 4 && (
                      <Button variant="link" size="sm" onClick={() => setActiveTab("hashtags")}>
                        See all
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hashtagResults.slice(0, 4).map((hashtag) => (
                      <Card key={hashtag.id} className="cursor-pointer hover:bg-muted/50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <Hash className="h-5 w-5" />
                                <p className="font-medium">{hashtag.tag}</p>
                                {hashtag.trending && (
                                  <Badge variant="secondary" className="ml-1">
                                    <Flame className="h-3 w-3 mr-1 text-orange-500" />
                                    Trending
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground ml-7">
                                {hashtag.postCount.toLocaleString()} posts
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="people">
              {peopleResults.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Most Followers</DropdownMenuItem>
                        <DropdownMenuItem>Recently Active</DropdownMenuItem>
                        <DropdownMenuItem>Mutual Connections</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-4">
                    {peopleResults.map((person) => (
                      <Card key={person.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-12 w-12">
                                <img src={person.avatar || "/placeholder.svg"} alt={person.name} />
                              </Avatar>
                              <div>
                                <p className="font-medium">{person.name}</p>
                                <p className="text-xs text-muted-foreground">@{person.username}</p>
                                <p className="text-sm mt-1">{person.bio}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {person.followers.toLocaleString()} followers
                                </p>
                              </div>
                            </div>
                            <Button
                              variant={person.following ? "outline" : "default"}
                              size="sm"
                              onClick={() => toggleFollow(person.id)}
                            >
                              {person.following ? (
                                <>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Following
                                </>
                              ) : (
                                <>
                                  <UserPlus className="h-4 w-4 mr-2" />
                                  Follow
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <User className="h-12 w-12 text-muted-foreground" />
                  <p className="text-xl font-medium">No people found</p>
                  <p className="text-muted-foreground text-center max-w-md">
                    We couldn't find any people matching "{searchQuery}". Try a different search term.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="posts">
              {postResults.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Most Recent</DropdownMenuItem>
                        <DropdownMenuItem>Most Liked</DropdownMenuItem>
                        <DropdownMenuItem>Most Commented</DropdownMenuItem>
                        <DropdownMenuItem>
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Photos Only
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Video className="h-4 w-4 mr-2" />
                          Videos Only
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-4">
                    {postResults.map((post) => (
                      <Card key={post.id}>
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <img src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
                              </Avatar>
                              <div>
                                <p className="font-medium">{post.user.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  @{post.user.username} •
                                  {new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
                                    Math.round((post.time - new Date()) / (1000 * 60 * 60 * 24)),
                                    "day",
                                  )}
                                </p>
                              </div>
                            </div>

                            <p>{post.content}</p>

                            {post.image && (
                              <div className="rounded-md overflow-hidden">
                                <img src={post.image || "/placeholder.svg"} alt="Post" className="w-full h-auto" />
                              </div>
                            )}

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{post.likes} likes</span>
                              <span>{post.comments} comments</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                  <p className="text-xl font-medium">No posts found</p>
                  <p className="text-muted-foreground text-center max-w-md">
                    We couldn't find any posts matching "{searchQuery}". Try a different search term.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="hashtags">
              {hashtagResults.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Sort
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Most Popular</DropdownMenuItem>
                        <DropdownMenuItem>Trending Now</DropdownMenuItem>
                        <DropdownMenuItem>Alphabetical</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hashtagResults.map((hashtag) => (
                      <Card key={hashtag.id} className="cursor-pointer hover:bg-muted/50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <Hash className="h-5 w-5" />
                                <p className="font-medium">{hashtag.tag}</p>
                                {hashtag.trending && (
                                  <Badge variant="secondary" className="ml-1">
                                    <Flame className="h-3 w-3 mr-1 text-orange-500" />
                                    Trending
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground ml-7">
                                {hashtag.postCount.toLocaleString()} posts
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Hash className="h-12 w-12 text-muted-foreground" />
                  <p className="text-xl font-medium">No hashtags found</p>
                  <p className="text-muted-foreground text-center max-w-md">
                    We couldn't find any hashtags matching "{searchQuery}". Try a different search term.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <SearchIcon className="h-12 w-12 text-muted-foreground" />
          <p className="text-xl font-medium">No results found</p>
          <p className="text-muted-foreground text-center max-w-md">
            We couldn't find anything matching "{searchQuery}". Try different keywords or check your spelling.
          </p>
        </div>
      )}
    </div>
  )
}
