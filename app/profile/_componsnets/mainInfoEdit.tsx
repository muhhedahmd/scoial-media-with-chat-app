import CropperModal from '@/app/_components/crop-model/crop';
import PhotoViewrComp from '@/app/_components/PhotoViewrComp';
import { ProfileSchema } from '@/app/auth/signup/_comsponents/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useImageFile from '@/hooks/ImgaeInfo';
import { zodResolver } from '@hookform/resolvers/zod';
import { Profile, ProfilePicture } from '@prisma/client';
import { BookImage, Edit, ImageIcon, Loader2, Pencil, PlusCircle, Trash, User2, UserCircle2, UserPenIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import {  useFormContext } from 'react-hook-form';
import EditableField   from "@/app/_components/EditableField" 
import { useSelector } from 'react-redux';
import { userResponse } from '@/store/Reducers/mainUser';

const MainInfoEdit = ({
    // profile , 
    blurCover,
    blurProfile,
    editStatus

} : {
    // editStatus
editStatus: boolean
    blurCover : ProfilePicture | null ,

blurProfile :ProfilePicture | null
    // profile: Profile
}) => {

    const { register, formState: { errors }   ,control ,  setValue ,getValues} = useFormContext<typeof ProfileSchema._type>();

    const CachedUser = useSelector(userResponse)!


      const [blurProfileToUpdate, setBlurProfileToUpdate] = useState<ProfilePicture | null>(null)
      const [blurCoverToUpdate, setblurCoverToUpdate] = useState<ProfilePicture | null>(null)
    
        const [openDilogCropProfile, SetopenDilogCropProfile] = useState<boolean>(false)
        const [croppedImageProfile, setCroppedImageProfile] = useState<File | null>(null)
      
        const [openDilogCropCover, SetopenDilogCropCover] = useState<boolean>(false)
        const [croppedImageCover, setCroppedImageCover] = useState<File | null>(null)
      
      
    
      useEffect(() => {

        setblurCoverToUpdate(blurCover || null)
        setBlurProfileToUpdate(blurProfile || null)
      }, [])
    
// register('profile_picture' , undefined)
    //  const form = useForm<z.infer<typeof ProfileSchema>>({
    //     resolver: zodResolver(ProfileSchema),
    //     defaultValues: {
    //       removeProfilePic: "keep",
    //       removeCoverPic: "keep",
    //       cover_picture: null,
    //       profile_picture: null,
    //     //   title: profile?.title || "",
    //     //   PhoneNumber: profile?.PhoneNumber?.toString() || "",
    //     //   bio: profile?.bio || "",
    //     //   birthdate: profile?.birthdate ? new Date(profile.birthdate) : new Date(),
    //     //   location: profile?.location ? profile?.location : "",
    //     //   website: profile?.website as object || {} || undefined,
    
    //     },
    //   })
    
    const { dimensions: CoverDimantionNew,
        error: errorProfile,
        isLoading: isLoadingProfile,
        url: urlProfilenew,
        blurHash: blurHashProfileNew
      } = useImageFile(getValues("profile_picture"))
    
      const { dimensions: CoverDimantionNewCover,
        error: errorCover,
        isLoading: isLoadingCoverNew,
        url: urlCoverNew,
        blurHash: blurHashCoverNew
      } = useImageFile(getValues("cover_picture"))
    
    
      const ProfilePicInputRef = useRef<HTMLInputElement>(null);
    
      const ProfileButtonClick = () => {
        ProfilePicInputRef.current?.click();
      };
      const CoverPicInputRef = useRef<HTMLInputElement>(null);
    
      const CoverButtonClick = () => {
        CoverPicInputRef.current?.click();
      };
    
    
  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">




    <div className="flex flex-col w-full justify-start items-start gap-2 md:gap-1">

        <div className="flex justify-start font-medium items-center gap-2">
            <UserCircle2 size={18} className="" />
            <p className="text-sm font-[500]  flex items-center gap-2">Profile picture</p>
        </div>
        <div className="relative w-full flex justify-start items-center gap-4">

            {
                getValues("profile_picture") ?
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
                // disabled={editStatus}
                className="hidden"
                id="profilePic"
                ref={ProfilePicInputRef}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        setValue("profile_picture", file);
                        SetopenDilogCropProfile(true)

                        // setCroppedImageProfile(file) 
                    }
                }}
            />
            <Button
                // disabled={editStatus}
                size="icon" variant="outline" onClick={ProfileButtonClick}>
                {blurProfileToUpdate ? (
                    <Pencil className="w-5 h-5 text-green-600" />
                ) : (
                    <PlusCircle className="w-6 h-6 text-blue-600" />
                )}
            </Button>

            {
                getValues("profile_picture") ?
                    <Button
                        // disabled={editStatus}
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
                // disabled={editStatus}
                size="icon"
                onClick={() => {
                    setValue("profile_picture", null)
                    setValue("removeProfilePic", "remove")
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
                getValues("cover_picture") ?
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
                // disabled={editStatus}
                type="file"
                className="hidden"
                id="profilePic"
                ref={CoverPicInputRef}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        setValue("cover_picture", file);
                        SetopenDilogCropCover(true)
                    }
                }}
            />
            <Button
                // disabled={editStatus}
                size="icon" variant="outline" onClick={CoverButtonClick}>
                {blurCoverToUpdate ? (
                    <Pencil className="w-5 h-5 text-green-600" />
                ) : (
                    <PlusCircle className="w-6 h-6 text-blue-600" />
                )}
            </Button>
            {
                getValues("cover_picture") ?
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
                // disabled={editStatus}
                onClick={() => {
                    setValue("cover_picture", null)
                    setValue("removeCoverPic", "remove")
                    setblurCoverToUpdate(null)

                }}
                size="icon" variant="outline">
                <Trash className="w-5 h-5 text-red-700" />
            </Button>
        </div>
    </div>
    <EditableField  editStatus={editStatus} control={control}    name="first_name" icon={<UserPenIcon size={18} />} label="First name" placeholder={CachedUser.first_name|| ""} />
    <EditableField  editStatus={editStatus} control={control}    name="last_name" icon={<UserPenIcon size={18} />} label="Last name" placeholder={CachedUser.last_name || ""} />
   
    <EditableField  editStatus={editStatus} control={control}    name="user_name" icon={<span  className='font-bold text-[1.1rem] pb-1'  >
        @
    </span>} label="User name" placeholder={CachedUser.user_name || ""} />

    <CropperModal

        imageFile={ProfilePicInputRef.current?.files?.[0] || null}
        profile={true}
        openDialog={openDilogCropProfile}
        setOpenDialog={SetopenDilogCropProfile}
        croppedImage={croppedImageProfile}
        setCroppedImage={setCroppedImageProfile}
        onCropComplete={(file) => {
            setValue("profile_picture", file)
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
            setValue("cover_picture", file)

        }}
    />

</div>
  )
}

export default MainInfoEdit