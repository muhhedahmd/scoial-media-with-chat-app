"use client"

import { useState, useEffect, type MouseEvent } from "react"
import { useRouter } from "next/navigation"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProfileSchema } from "@/app/auth/signup/_comsponents/schema"
import type { z } from "zod"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDispatch, useSelector } from "react-redux"
import { editUser, userResponse } from "@/store/Reducers/mainUser"
import EditProfileHeader from "./components/edit-profile-header"
import ProfilePictureSection from "./components/profile-picture-section"
import PersonalInfoSection from "./components/personal-info-section"
import SocialLinksSection from "./components/social-links-section"
import PrivacySection from "./components/privacy-section"
import { useEditProfileMutation, useGetProfileQuery, useUpdateUserInfoMutation } from "@/store/api/apiProfile"
import useImageFile from "@/hooks/ImgaeInfo"
import type { AppDispatch } from "@/store/store"
import { useSession } from "next-auth/react"
import UserInfoProfileeEdit from "./components/user-info-profilee-edit"
import { Gender, Role, VideoCallStatus } from "@prisma/client"

export default function EditProfilePage() {
  const router = useRouter()
  const CachedUser = useSelector(userResponse)!
  const [activeTab, setActiveTab] = useState("personal")
  const {
    data: profileData,
    isLoading,
    isFetching,
  } = useGetProfileQuery({ userId: CachedUser?.id }, { skip: !CachedUser?.id })

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      gender: "MALE",
      role: "user",
      first_name: "",
      last_name: "",
      user_name: "",
      Email: "",
      removeProfilePic: "keep",
      removeCoverPic: "keep",
      title: "",
      PhoneNumber: "",
      bio: "",
      birthdate: new Date(),
      cover_picture: null,
      location: "",
      profile_picture: null,
      website: {} as any,
    },
  })

  // Update form values when profile data is loaded
  useEffect(() => {
    if (profileData) {
      form.reset({
        first_name: CachedUser?.first_name || "",
        last_name: CachedUser?.last_name || "",
        user_name: CachedUser?.user_name || "",
        Email: CachedUser?.email || "",
        gender: CachedUser?.gender || "MALE",
        role: CachedUser?.role || "user",
        removeProfilePic: "keep",
        removeCoverPic: "keep",
        title: profileData.title || "",
        PhoneNumber: profileData.PhoneNumber?.toString() || "",
        bio: profileData.bio || "",
        birthdate: profileData.birthdate ? new Date(profileData.birthdate) : new Date(),
        cover_picture: null,
        location: profileData.location || "",
        profile_picture: null,
        website: (profileData.website as object) || {},
      })
    }
  }, [profileData, form, CachedUser])
  const [editProfile, { isLoading: editStatus }] = useEditProfileMutation()
  const [updateUser, { isLoading: updateUserStatus }] = useUpdateUserInfoMutation()
  const dispatch = useDispatch<AppDispatch>()

  // Watch for changes to the profile_picture field
  const profilePicture = form.watch("profile_picture")
  const {
    dimensions: DimantionNewProfile,
    error: errorProfile,
    isLoading: isLoadingProfile,
    url: urlProfilenew,
    blurHash: blurHashProfileNew,
  } = useImageFile(profilePicture)

  // Watch for changes to the cover_picture field
  const coverPicture = form.watch("cover_picture")
  const {
    dimensions: DimantionNewCover,
    error: errorCover,
    isLoading: isLoadingCoverNew,
    url: urlCoverNew,
    blurHash: blurHashCoverNew,
  } = useImageFile(coverPicture)

  const [editUserStatus, setEditUserStatus] = useState(false)

  const { update: updateSession, data: session } = useSession()
  const onSubmit = async (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    console.log(form.getValues())

    if (await form.trigger()) {
      const updatedProfile = form.getValues()
      const formData = new FormData()

      Object.keys(updatedProfile).forEach((k) => {
        const key = k as keyof typeof updatedProfile
        if (
          key === "Email" ||
          key === "user_name" ||
          key === "first_name" ||
          key === "last_name" ||
          key === "gender" ||
          key === "role"
        ) {
          return
        }

        if (
          typeof updatedProfile[key] === "object" &&
          k !== "cover_picture" &&
          k !== "birthdate" &&
          k !== "profile_picture"
        ) {
          formData.append(k, JSON.stringify(updatedProfile[key]))
        } else if (updatedProfile[key] instanceof File) {
          formData.append(k, updatedProfile[key])
        } else if (updatedProfile[key] !== null && updatedProfile[key] !== undefined) {
          formData.append(k, String(updatedProfile[key]).trim())
        }
      })
      formData.append("DimantionNewProfile", JSON.stringify(DimantionNewProfile))
      formData.append("blurHashProfileNew", blurHashProfileNew || "")
      formData.append("DimantionNewCover", JSON.stringify(DimantionNewCover))
      formData.append("blurHashCoverNew", blurHashCoverNew || "")

      editProfile({ userId: CachedUser.id, profileData: formData })
        .then((data) => {

          // if (CachedUser) {
          //   console.log(CachedUser);
          //   const user = {
          //     first_name: upData?.first_name,
          //     last_name: upData?.last_name,
          //     id: CachedUser.id,
          //     email: upData?.email!,
          //     user_name: upData?.user_name!,
          //     // created_at: upData?.created_at || new Date(),
          //     // updated_at: upData?.updated_at || new Date(),
          //     role: upData?.role,
          //     Gender: upData?.gender,
          //     profile: {
          //       ...profileData
          //     },
          //     user: {
          //       id: CachedUser.id
          //     }

          //   }
          //   dispatch(editUser(user))

          // }

          //           {
          //   "email": "admin_3@gmail.com",
          //   "sub": "2",
          //   "first_name": "ali",
          //   "id": 2,
          //   "last_name": "ahmed",
          //   "role": "user",
          //   "user_name": "admin_3",
          //   "iat": 1746957561
          // }
          // updateSession({
          //   ...session?.user,
          //   "email": upData?.email,

          //   "first_name": upData?.first_name,

          //   "last_name": upData?.last_name,

          //   "user_name": upData?.user_name,

          // }).then(() => {
          //   console.log("Session Updated");
          // })

          // Toast({
          //   variant: "success",
          //   title: "Profile Updated",
          //   // description: "Your profile has been updated successfully."
          // })
          // Router.push("/maintimeline")
        })

        .catch((err) => {
          // Toast({
          //   title: "Error",
          //   // description: "There was an error updating your profile.",
          //   variant: "destructive",
          // })
        })
      // Router.push("/maintimeline")

      // console.log(status);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const blurProfile = profileData?.profilePictures?.find((pic) => pic.type === "profile")
  const blurCover = profileData?.profilePictures?.find((pic) => pic.type === "cover")

  const saveUserInfo = async (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {

    e.preventDefault()
    setEditUserStatus(true)
    try {
      if (
        form.getValues("Email") === "" &&
        form.getValues("user_name") === "" &&
        form.getValues("first_name") === "" &&
        form.getValues("last_name") === "" &&
        form.getValues("gender") === CachedUser.gender &&
        form.getValues("role") === CachedUser.role

      ) {
        setEditUserStatus(false)
        return

      }
      else {

        const formData = new FormData()
        formData.append("email", form.getValues("Email") || "")
        formData.append("user_name", form.getValues("user_name") || "")
        formData.append("first_name", form.getValues("first_name") || "")
        formData.append("last_name", form.getValues("last_name") || "")
        formData.append("gender", form.getValues("gender") || "")
        formData.append("role", form.getValues("role") || "")
        updateUser(
          formData
        ).then((data) => {

          const upData = data.data

          if (CachedUser) {
            type CachedUserT = {
              id: number;
              created_at: Date | null;
              updated_at: Date | null;
              email: string;
              first_name: string;
              role: Role;
              password: string;
              last_name: string;
              user_name: string;
              gender: Gender;
              expiresAt: Date;
              isPrivate: boolean;
              videoCallStatus: VideoCallStatus;
            }
            const Cuser = CachedUser!
            const user = {
              first_name: upData?.first_name,
              last_name: upData?.last_name,
              id: CachedUser.id,
              email: upData?.email!,
              user_name: upData?.user_name!,
              role: upData?.role,
              Gender: upData?.gender,
              created_at: CachedUser.created_at,
              updated_at: CachedUser.updated_at,
              expiresAt: CachedUser.expiresAt,
              isPrivate: CachedUser.isPrivate,
              videoCallStatus: CachedUser.videoCallStatus
            }
            dispatch(editUser({
              ...user
            }))

          }


          updateSession({
            ...session?.user,
            "email": upData?.email,

            "first_name": upData?.first_name,

            "last_name": upData?.last_name,

            "user_name": upData?.user_name,

          }).then(() => {
            console.log("Session Updated");
          })



        })
      }

    } catch (error) {

    }


    setEditUserStatus(false)
  }

  const noChangesMade =
    form.watch("Email")?.trim() === (CachedUser?.email || "") &&
    form.watch("user_name")?.trim() === (CachedUser?.user_name || "") &&
    form.watch("first_name")?.trim() === (CachedUser?.first_name || "") &&
    form.watch("last_name")?.trim() === (CachedUser?.last_name || "") &&
    form.watch("gender")?.trim() === (CachedUser?.gender || "MALE") &&
    form.watch("role")?.trim() === (CachedUser?.role || "user")

  return (
    <div className="container    max-w-4xl py-6 space-y-6">
      <EditProfileHeader onBack={() => router.push("/profilee")} />

      <FormProvider {...form}>
        <form className="space-y-6">
          <ProfilePictureSection
            selectiveBlurProfile={{
              dimensions: DimantionNewProfile,
              isLoading: isLoadingProfile,
              url: urlProfilenew,
              blurHash: blurHashProfileNew,
            }}
            selectiveBlurCover={{
              dimensions: DimantionNewCover,
              isLoading: isLoadingCoverNew,
              url: urlCoverNew,
              blurHash: blurHashCoverNew,
            }}
            blurProfile={blurProfile}
            blurCover={blurCover}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="social">Social Links</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="userInf">user information</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and how others see you on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <PersonalInfoSection />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                  <CardDescription>Connect your social profiles and websites</CardDescription>
                </CardHeader>
                <CardContent>
                  <SocialLinksSection />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control who can see your profile information</CardDescription>
                </CardHeader>
                <CardContent>
                  <PrivacySection />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="userInf" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>user information</CardTitle>
                  <CardDescription>Control your senstive information</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserInfoProfileeEdit />

                  {/* <PrivacySection /> */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/profilee")}>
              Cancel
            </Button>
            {
              activeTab === "userInf" ?
                <Button
                  disabled={noChangesMade || editUserStatus}
                  onClick={(e) => saveUserInfo(e)}
                  type="button"
                  className="hover:bg-rose-950 bg-rose-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button> :

                <Button
                  type="submit"
                  className="gap-2"
                  onClick={(e: any) => onSubmit(e)}
                  disabled={
                    !form.formState.isDirty ||
                    form.formState.isSubmitting ||
                    editStatus ||
                    isLoadingProfile ||
                    isLoadingCoverNew
                  }
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
            }
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
