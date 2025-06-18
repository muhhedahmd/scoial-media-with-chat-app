"use client"
import { useEffect, useState } from "react"
import PostContainer from "./_conponents/PostContainer"
import { useGetProfileQuery } from "@/store/api/apiProfile"
import { useSelector } from "react-redux"
import { userResponse } from "@/store/Reducers/mainUser"
import { Loader2 } from "lucide-react"

// import { ThemeProvider } from "@/components/theme-provider"

const Page = () => {
  const user = useSelector(userResponse)
  const [mounted, setMounted] = useState(false)

  const { data: profile, isLoading: status } = useGetProfileQuery({ userId: user?.id! })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!user?.id) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-slate-800 dark:text-slate-200">Loading your timeline...</h2>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-slate-800 dark:text-slate-200">Loading profile data...</h2>
        </div>
      </div>
    )
  }

  return (
     <PostContainer isLoadingProfile={status} MainUserProfile={profile} user={user} />
    )
}

export default Page
