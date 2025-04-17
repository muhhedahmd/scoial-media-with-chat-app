"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Pencil,
  User,
  Briefcase,
  Phone,
  Calendar,
  MapPin,
  Globe,
  FileText,
  Trash,
  UserCircle2,
  BookImage,
  Earth,
  Locate,
  User2,
  ImageIcon,
  PlusCircle,
  LocateOffIcon,
  Bean,
  Loader2,
  Edit,
  LocateFixed,
} from "lucide-react"
import { useEditProfileMutation, type UserProfile } from "@/store/api/apiProfile"
import { ProfileSchema } from "@/app/auth/signup/_comsponents/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import type { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

// import BlurredImage from "@/components/"
import { Address, ProfilePicture } from "@prisma/client"
import AutocompleteMultiValue from "@/app/profile/_componsnets/AutocompleteMultivalue"
import AutocompleteSingleValue from "@/app/profile/_componsnets/AutocompleteSinglValus"
import BlurredImage from "@/app/_components/ImageWithPlaceholder"
import { useEffect, useRef, useState } from "react"
import PhotoViewrComp from "@/app/_components/PhotoViewrComp"
import LocationSearch from "@/app/_components/locationComp/locationComp"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import useImageFile from "@/hooks/ImgaeInfo"
import CropperModal from "@/app/_components/crop-model/crop"
import EditableField   from "@/app/_components/EditableField" 
 
interface MainInfoProps {
  profileData: UserProfile | undefined
  onClose: () => void
  userId: number
  blurCover: ProfilePicture | undefined
  blurProfile: ProfilePicture | undefined
}

const MainInfo: React.FC<MainInfoProps> = ({ onClose, userId, profileData: profile,
  blurCover,
  blurProfile

}) => {






  const [blurProfileToUpdate, setBlurProfileToUpdate] = useState<ProfilePicture | null>(null)
  const [blurCoverToUpdate, setblurCoverToUpdate] = useState<ProfilePicture | null>(null)

  const [copyOfData, setCopyOfData] = useState<any>()

  useEffect(() => {
    setCopyOfData({
      title: profile?.title || "",
      PhoneNumber: profile?.PhoneNumber?.toString() || "",
      bio: profile?.bio || "",
      birthdate: profile?.birthdate ? new Date(profile.birthdate) : new Date(),
      cover_picture: null,
      location: profile?.location || null,
      profile_picture: null,
      website: profile?.website as object || {} || undefined
    })
    setblurCoverToUpdate(blurCover || null)
    setBlurProfileToUpdate(blurProfile || null)
  }, [])


  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      removeProfilePic: "keep",
      removeCoverPic: "keep",
      title: profile?.title || "",
      PhoneNumber: profile?.PhoneNumber?.toString() || "",
      bio: profile?.bio || "",
      birthdate: profile?.birthdate ? new Date(profile.birthdate) : new Date(),
      cover_picture: null,
      location: profile?.location ? profile?.location : "",
      profile_picture: null,
      website: profile?.website as object || {} || undefined,

    },
  })

  const [editProfile, { isLoading: editStatus }] = useEditProfileMutation()
  const [activeLocation, setActiveLocation] = useState<number | null>(null)

  const { dimensions: CoverDimantionNew,
    error: errorProfile,
    isLoading: isLoadingProfile,
    url: urlProfilenew,
    blurHash: blurHashProfileNew
  } = useImageFile(form.getValues("profile_picture"))

  const { dimensions: CoverDimantionNewCover,
    error: errorCover,
    isLoading: isLoadingCoverNew,
    url: urlCoverNew,
    blurHash: blurHashCoverNew
  } = useImageFile(form.getValues("cover_picture"))


  const ProfilePicInputRef = useRef<HTMLInputElement>(null);

  const ProfileButtonClick = () => {
    ProfilePicInputRef.current?.click();
  };
  const CoverPicInputRef = useRef<HTMLInputElement>(null);

  const CoverButtonClick = () => {
    CoverPicInputRef.current?.click();
  };



  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    

    e.preventDefault();


    if (await form.trigger()) {
      const updatedProfile = form.getValues();
      const formData = new FormData();

      Object.keys(updatedProfile).forEach((k) => {
        let key = k as keyof typeof updatedProfile;

        if (typeof updatedProfile[key] === "object" && k !== "cover_picture" && k !== "birthdate" && k !== "profile_picture") {
          formData.append(k, JSON.stringify(updatedProfile[key]));
        } else if (updatedProfile[key] instanceof File) {
          formData.append(k, updatedProfile[key]);
        } else if (updatedProfile[key] !== null && updatedProfile[key] !== undefined) {
          formData.append(k, String(updatedProfile[key]));
        }
      })
      
      console.log(form.getValues())

      // editProfile({ userId: userId, profileData: formData }).then(() => {

      //   toast({
      //     title: "Profile Updated",
      //     description: "Your profile has been updated successfully.",
      //     variant: "success",

      //   })
      //   // Router.push("/maintimeline")

      // }
      // ).catch((err) => {
      //   toast({
      //     title: "Error",
      //     description: "There was an error updating your profile.",
      //     variant: "destructive",

      //   })
      // })
      // Router.push("/maintimeline")

      // console.log(status);
    }
  };

  const [openDilogCropProfile, SetopenDilogCropProfile] = useState<boolean>(false)
  const [croppedImageProfile, setCroppedImageProfile] = useState<File | null>(null)

  const [openDilogCropCover, SetopenDilogCropCover] = useState<boolean>(false)
  const [croppedImageCover, setCroppedImageCover] = useState<File | null>(null)


  if (!profile) {

    return <div>Loading...</div>
  }

  return (

    <>



      <Form {...form}>
        <form
          onSubmit={(e) => onSubmit(e)}
          className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col w-full justify-start items-start gap-2 md:gap-1">
              <div className="flex justify-start font-medium items-center gap-2">
                <UserCircle2 size={18} className="" />
                <p className="text-sm font-[500]  flex items-center gap-2">Profile picture</p>
              </div>
              <div className="relative w-full flex justify-start items-center gap-4">

                {
                  form.getValues("profile_picture") ?
                    isLoadingProfile ?
                      <Loader2 className="animate-spin w-4 h-4 " />
                      :
                      <PhotoViewrComp
                        className="w-20 rounded-full shadow-md h-20 bg-gray-400"

                        height={CoverDimantionNew?.height || 80}
                        imageUrl={urlProfilenew || "/placeholder.svg"}
                        width={CoverDimantionNew?.width || 80}
                        alt="Profile Picture"
                        blurhash={blurHashProfileNew || ""}

                      />

                    : blurProfileToUpdate ?
                      <PhotoViewrComp
                        className="w-20 rounded-full shadow-md h-20 bg-gray-400"

                        height={blurProfileToUpdate?.height || 80}

                        imageUrl={blurProfileToUpdate?.secure_url || "/placeholder.svg"}
                        width={blurProfileToUpdate?.width || 80}
                        alt="Profile Picture"
                        blurhash={blurProfileToUpdate?.HashBlur || ""}

                      />
                      :
                      <div className="w-20 h-20 flex justify-center items-center shadow-sm border-2 border-gray-300 bg-gray-200 rounded-full">
                        <User2 className="w-8 h-8 text-muted-foreground" />
                      </div>
                }

                <Input
                  type="file"
                  disabled={editStatus}
                  className="hidden"
                  id="profilePic"
                  ref={ProfilePicInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      form.setValue("profile_picture", file);
                      SetopenDilogCropProfile(true)

                      // setCroppedImageProfile(file) 
                    }
                  }}
                />
                <Button 
                disabled={editStatus}
                size="icon" variant="outline" onClick={ProfileButtonClick}>
                  {blurProfileToUpdate ? (
                    <Pencil className="w-5 h-5 text-green-600" />
                  ) : (
                    <PlusCircle className="w-6 h-6 text-blue-600" />
                  )}
                </Button>

                {
                  form.getValues("profile_picture") ?
                    <Button
                    disabled={editStatus}
                      onClick={() => SetopenDilogCropProfile(true)}
                      variant={"outline"}
                    >
                      <Edit
                        className="
                    w-6 h-6 text-amber-600
                    "
                      />
                    </Button> : null
                }





                <Button 
                disabled={editStatus}
                size="icon"
                  onClick={() => {
                    form.setValue("profile_picture", null)
                    form.setValue("removeProfilePic", "remove")
                    setBlurProfileToUpdate(null)
                  }}
                  variant="outline">
                  <Trash className="w-5 h-5 text-red-700" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col w-full justify-start items-start gap-2 md:gap-1">
              <div className="font-[500]  flex justify-start items-center gap-2">
                <BookImage size={18} className="" />
                <p className="text-sm font-medium  flex items-center gap-2">Cover picture</p>
              </div>
              <div className="relative w-full flex justify-start items-center gap-4">
                {
                  form.getValues("cover_picture") ?
                    isLoadingCoverNew ?
                      <Loader2 className="animate-spin w-4 h-4 " />
                      :
                      <PhotoViewrComp
                        className="w-60 rounded-md shadow-md h-20 bg-gray-400"
                        height={CoverDimantionNew?.height || 80}
                        imageUrl={urlCoverNew || "/placeholder.svg"}
                        width={CoverDimantionNew?.width || 80}
                        alt="Profile Picture"
                        blurhash={blurHashCoverNew || ""}
                      />
                    :
                    blurCoverToUpdate ?

                      <PhotoViewrComp
                        className="w-60 rounded-md shadow-md h-20 bg-gray-400"
                        height={blurCoverToUpdate?.height || 80}
                        imageUrl={blurCoverToUpdate?.secure_url || "/placeholder.svg"}
                        width={blurCoverToUpdate?.width || 80}
                        alt="Profile Picture"
                        blurhash={blurCoverToUpdate?.HashBlur || ""}

                      /> :
                      <div className=" w-60 h-20 flex justify-center items-center shadow-sm border-2 border-gray-300 bg-gray-200 rounded-md">
                        <ImageIcon
                          // className="w-10 h-10 text-muted-foreground"
                          className="w-12 h-12 rounded-xl cursor-pointer text-muted-foreground"

                        />
                      </div>
                }

                <Input
                disabled={editStatus}
                  type="file"
                  className="hidden"
                  id="profilePic"
                  ref={CoverPicInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      form.setValue("cover_picture", file);
                      SetopenDilogCropCover(true)
                    }
                  }}
                />
                <Button  
                disabled={editStatus}
                size="icon" variant="outline" onClick={CoverButtonClick}>
                  {blurCoverToUpdate ? (
                    <Pencil className="w-5 h-5 text-green-600" />
                  ) : (
                    <PlusCircle className="w-6 h-6 text-blue-600" />
                  )}
                </Button>
                {
                  form.getValues("cover_picture") ?
                    <Button
                      onClick={() => SetopenDilogCropCover(true)}
                      variant={"outline"}
                    >
                      <Edit
                        className="
                    w-6 h-6 text-amber-600
                    "
                      />
                    </Button> : null
                }
                <Button
                disabled={editStatus}
                  onClick={() => {
                    form.setValue("cover_picture", null)
                    form.setValue("removeCoverPic", "remove")
                    setblurCoverToUpdate(null)

                  }}
                  size="icon" variant="outline">
                  <Trash className="w-5 h-5 text-red-700" />
                </Button>
              </div>
            </div>


            <EditableField  editStatus={editStatus} control={form.control}    name="title" icon={<Briefcase size={18} />} label="Title" placeholder={profile.title || ""} />
            <EditableField  editStatus={editStatus} control={form.control}
               name="PhoneNumber"
              icon={<Phone size={18} />}
              label="Phone Number"
              placeholder={profile.PhoneNumber?.toString() || ""}
            />
            <EditableField  editStatus={editStatus} control={form.control}   name="birthdate" icon={<Calendar size={18} />} label="Birthday" type="date" placeholder="" />

            <div className="flex">
              <div className="flex flex-col justify-start items-start w-full">

                <div

                  className="flex justify-start items-center gap-2"
                >
                  <LocateFixed size={18} />

                  <Label htmlFor="location" className="text-right text-base">
                    Location
                  </Label>
                </div>
                {profile.location_id || activeLocation ? (

                  <div className="flex justify-center items-center gap-2">
                    <FormField
                    disabled={editStatus}
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <div
                            className="flex justify-start items-center gap-2"
                          >


                          </div>
                          <FormControl>
                            <Controller
                            disabled={editStatus}
                              name="location"
                              control={form.control}
                              render={({ field }) => (
                                <LocationSearch
                                  activeLocation={activeLocation || null}
                                  isEditing={true}
                                  setActiveLocation={setActiveLocation}
                                  fullSelected={form.getValues().location}
                                  // setActiveLocation={setEditedPost}
                                  onChange={field.onChange}
                                />
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                    disabled={editStatus}
                      onClick={() => {
                        setActiveLocation(prev => null)
                        form.setValue("location", null)
                      }}
                      variant={"ghost"}
                    >
                      <LocateOffIcon className="w-5 h-5" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <div
                            className="flex justify-start items-center gap-2"
                          >


                          </div>
                          <FormControl>
                            <Controller
                              name="location"
                              control={form.control}
                              render={({ field }) => (
                                <LocationSearch
                                  activeLocation={activeLocation || null}
                                  isEditing={true}
                                  setActiveLocation={setActiveLocation}
                                  fullSelected={form.getValues().location}
                                  // setActiveLocation={setEditedPost}
                                  onChange={field.onChange}
                                />
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  </>
                )}
              </div>
              {


              }

            </div>
            <FormField
              control={form.control}
              disabled={editStatus}
              name="website"
              render={({ field }) => (
                <FormItem className="w-full">
                  <div
                    className="flex justify-start items-center gap-2"
                  >

                    <Earth size={18} />
                    <FormLabel>Websites</FormLabel>
                  </div>
                  <FormControl>
                    <Controller
                      disabled={editStatus}

                      name="website"
                      control={form.control}
                      render={({ field }) => (
                        <AutocompleteMultiValue

                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <EditableField  editStatus={editStatus} control={form.control}  
            name="bio"
            icon={<FileText size={18} />}
            label="Bio"
            type="textarea"
            placeholder={profile.bio || ""}
          />
          <div className="flex justify-end space-x-4 pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={editStatus || JSON.stringify(form.getValues()) === JSON.stringify(profile)}>
              {editStatus ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form >

      <CropperModal

        imageFile={ProfilePicInputRef.current?.files?.[0] || null}
        profile={true}
        openDialog={openDilogCropProfile}
        setOpenDialog={SetopenDilogCropProfile}
        croppedImage={croppedImageProfile}
        setCroppedImage={setCroppedImageProfile}
        onCropComplete={(file) => {
          form.setValue("profile_picture", file)
        }}

      />

      <CropperModal
        cover={true}
        imageFile={CoverPicInputRef.current?.files?.[0] || null}
        openDialog={openDilogCropCover}
        setOpenDialog={SetopenDilogCropCover}
        croppedImage={croppedImageCover}
        setCroppedImage={setCroppedImageCover}
        onCropComplete={(file) => {
          form.setValue("cover_picture", file)

        }}
      />
      {/* </div> */}
    </>
  )
}

export default MainInfo

