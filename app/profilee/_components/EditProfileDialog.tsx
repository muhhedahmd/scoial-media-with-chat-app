"use client"

import type React from "react"

import { useState } from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Pencil } from "lucide-react"
import type { UserProfile } from "@/store/api/apiProfile"
import type { ProfilePicture } from "@prisma/client"
import PhotoViewrComp from "@/app/_components/PhotoViewrComp"
import MainInfo from "@/app/profile/_componsnets/MainInfo"
import { FormProvider, useForm } from "react-hook-form"
import { ProfileSchema } from "@/app/auth/signup/_comsponents/schema"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { TabsInfo } from "@/app/profile/_componsnets/TapsInfo"

const EditProfileDrawer = ({
  blurCover,
  blurProfile,
  profileData,
  isLoading,
  isFetching,
  userId,
}: {
  blurCover: ProfilePicture | undefined
  blurProfile: ProfilePicture | undefined
  profileData: UserProfile | undefined
  isLoading: boolean
  isFetching: boolean
  userId: number
}) => {
  const [open, setOpen] = useState(false)

  // const handleDrawerClose = (e: React.MouseEvent) => {
  //   // Only close the drawer if the click is directly on the overlay
  //   if (e.target === e.currentTarget) {
  //     setOpen(false)
  //   }
  // }
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      removeProfilePic: "keep",
      removeCoverPic: "keep",
      title: profileData?.title || "",
      PhoneNumber: profileData?.PhoneNumber?.toString() || "",
      bio: profileData?.bio || "",
      birthdate: profileData?.birthdate ? new Date(profileData.birthdate) : new Date(),
      cover_picture: null,
      location: profileData?.location ? profileData?.location : "",
      profile_picture: null,
      website: profileData?.website as object || {} || undefined,

    },
  })


  return (
    <Drawer open={open} modal={false} autoFocus={false} 
    onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className="flex justify-start items-center gap-2 hover:bg-neutral-50 transition-all absolute top-4 right-4 px-4 py-1 shadow-sm bg-white text-black rounded-full">
          <Pencil className="mr-2 h-4 w-4" />
          Edit Profile
        </button>
      </DrawerTrigger>
      <DrawerContent className="h-[95vh] top-0 mt-0 max-h-[95vh]" >
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-bold">Edit Profile</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto p-8 pb-2">
          {isLoading ? (
            <div>Loading profile data...</div>
          ) : (
            <FormProvider
            {...form}
            
            >
              <form onSubmit={(e)=>{
                e.stopPropagation()
                e.preventDefault()
              }}>
              <TabsInfo 
                blurCover={blurCover || null}
                blurProfile={blurProfile|| null}

              
              />

            {/* <MainInfo
              profileData={profileData}
              blurCover={blurCover}
              blurProfile={blurProfile}
              onClose={() => setOpen(false)}
              userId={userId}
              /> */}
              </form>
            </FormProvider>

          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default EditProfileDrawer

