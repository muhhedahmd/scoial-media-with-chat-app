


import BlurredImage from '@/app/_components/ImageWithPlaceholder'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ProfilePicture } from '@prisma/client'
import { Camera, ImageIcon, Loader2, Trash2, Upload } from 'lucide-react'
import React from 'react'
import { useFormContext } from 'react-hook-form'

interface ProfilePictureSectionProps {
    blurProfile: ProfilePicture | undefined
    blurCover: ProfilePicture | undefined

    selectiveBlurProfile: {
        blurHash: string | null
        dimensions: {
            width: number,
            height: number
        } | null,
        isLoading: boolean,
        url: string | null,

    }
    selectiveBlurCover: {
        blurHash: string | null
        dimensions: {
            width: number,
            height: number
        } | null,
        isLoading: boolean,
        url: string | null,
    }
}

const Pics = ({
    blurProfile,
    blurCover,

    selectiveBlurProfile,
    selectiveBlurCover,

}: ProfilePictureSectionProps) => {


    const { register, setValue, watch } = useFormContext()
    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setValue("profile_picture", file)
            const reader = new FileReader()

            reader.readAsDataURL(file)
        }
    }

    const handleCoverPictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setValue("cover_picture", file)
            const reader = new FileReader()

            reader.readAsDataURL(file)
        }
    }

    return (
        <div className="  relative">
            {/* Cover Photo */}

            <div className="relative w-full h-[31rem]  rounded-xl overflow-hidden    border-1">
                {
                    selectiveBlurCover.isLoading ? (
                        <div className=" h-full w-full flex items-center justify-center">

                            <Loader2
                                className="w-5 h-5 animate-spin "

                            />
                        </div>
                    ) : ((blurCover?.secure_url || selectiveBlurCover.url) && !selectiveBlurCover.isLoading) ? (

                        <BlurredImage
                            imageUrl={selectiveBlurCover.url ? selectiveBlurCover.url : blurCover?.secure_url || "/placeholder.svg"}
                            height={
                                selectiveBlurCover.dimensions?.height ? selectiveBlurCover.dimensions?.height :
                                    blurCover?.height
                                    || 90}
                            width={
                                selectiveBlurCover.dimensions?.width ? selectiveBlurCover.dimensions?.width :
                                    blurCover?.width || 90
                            }
                            blurhash={
                                selectiveBlurCover.blurHash ? selectiveBlurCover.blurHash :
                                    blurCover?.HashBlur || ""
                            }
                            quality={100}
                            alt="Cover photo"
                            className="object-cover h-full  w-full "

                        />

                    ) : (

                        <div className="w-full h-full flex items-center justify-center bg">
                            <span className="text-primary">No cover photo</span>
                        </div>
                    )}

                <div className="absolute bottom-4 right-4">

                    <div className="flex gap-2">
                     
                        <Button
                            type="button"
                            size="sm"
                            variant={"ghost"}
                            className=""
                            onClick={() => document.getElementById("cover-upload")?.click()}
                        >
                            <Upload className="w-4 h-4" />
                            Upload
                        </Button>
                        <input
                            id="cover-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            {...register("cover_picture")}
                            onChange={handleCoverPictureChange}
                        />
                    </div>
                </div>
            </div>

            {/* Profile Picture */}
            <div className=" absolute flex items-end gap-6  top-[4rem] left-[4rem]
            transform -translate-x-1/2 -translate-y-1/2
            z-10  ">

                <div className="relative">
                    <div className=" w-24 h-24 rounded-md overflow-hidden border-2 border-emerald-100">
                        {
                            selectiveBlurProfile.isLoading ? (
                                <div className=" h-full w-full flex items-center justify-center">

                                    <Loader2
                                        className="w-5 h-5 animate-spin "

                                    />
                                </div>
                            ) : ((blurProfile?.secure_url || selectiveBlurProfile.url) && !selectiveBlurProfile.isLoading) ? (

                                <BlurredImage
                                    alt="profile-pic"
                                    className="object-cover h-full  w-full  rounded-md"
                                    height={
                                        selectiveBlurProfile.dimensions?.height ? selectiveBlurProfile.dimensions?.height :
                                            blurProfile?.height
                                            || 90
                                    }
                                    width={
                                        selectiveBlurProfile.dimensions?.width ? selectiveBlurProfile.dimensions?.width :
                                            blurProfile?.width || 90
                                    }
                                    blurhash={
                                        selectiveBlurProfile.blurHash ? selectiveBlurProfile.blurHash :
                                            blurProfile?.HashBlur || ""
                                    }
                                    quality={100}
                                    imageUrl={selectiveBlurProfile.url ? selectiveBlurProfile.url : blurProfile?.secure_url || "/placeholder.svg"}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center rounded-full">
                                    <span className="text-gray-400">No photo</span>
                                </div>
                            )}
                    </div>

                    <Button
                    variant={"outline"}
                        type="button"
                        size="icon"
                        className="absolute top-[4.5rem] left-[5rem] rounded-full w-8 h-8"
                        onClick={() => document.getElementById("profile-upload")?.click()}
                    >
                        <Camera className="w-4 h-4" />
                    </Button>
                    <input
                        id="profile-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        {...register("profile_picture")}
                        onChange={handleProfilePictureChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default Pics