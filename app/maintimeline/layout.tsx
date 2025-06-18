"use client"
import {  useEffect, useState } from "react"
import SidebarRight from "./_conponents/SidebarRight"
import SidebarLeft from "./_conponents/SidebarLeft"
import { useGetProfileQuery } from "@/store/api/apiProfile"
import Header from "./_conponents/Header"
import { useSelector } from "react-redux"
import { userResponse } from "@/store/Reducers/mainUser"
import { Loader2 } from "lucide-react"
import { ProfileWithPic } from "@/Types"
// import { ThemeProvider } from "@/components/theme-provider"

const Layout = ({
  children
} : {
  children: React.ReactNode

}) => {
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

  return <div className="h-screen w-full">
     <div className="min-h-screen   dark:bg-slate-950">
        <Header user={user} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Left sidebar */}
            <div className="hidden md:block md:col-span-1">
              <div className="sticky top-20">
                <SidebarLeft isLoading={status} profile={profile as any as ProfileWithPic} user={user} />
              </div>
            </div>

            {/* Main content - Posts */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2">
              {
                children
              }
            </div>

            {/* Right sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-20">
                <SidebarRight user={user} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
  </div>
}

export default Layout
