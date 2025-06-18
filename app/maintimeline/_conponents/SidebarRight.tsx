"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { User } from "@prisma/client"
import Suggestions from "./userInfoComponents/Suggestions"

interface SidebarRightProps {
  user: User
}

const SidebarRight = ({ user }: SidebarRightProps) => {
  // Trending topics (mock data)
  const trendingTopics = [
    { tag: "#Photography", posts: 2345 },
    { tag: "#Travel", posts: 1892 },
    { tag: "#FoodLovers", posts: 1567 },
    { tag: "#TechNews", posts: 1243 },
    { tag: "#FitnessGoals", posts: 987 },
  ]

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardContent className="p-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </div>
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Trending Topics</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
                    {topic.tag}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{topic.posts.toLocaleString()} posts</p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Suggestions user={user} />
    </div>
  )
}

export default SidebarRight
