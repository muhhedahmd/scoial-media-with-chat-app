import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { CustomSession, typeProfileWithPic, userWithProfile } from "@/Types";
import {
    CloudinaryUploadResponse,
    deleteCloudinaryAsset,
    generateBlurhash,
    Upload_coludnairy,
} from "@/utils";
import { Address, ProfilePictureType, User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const PUT = async (
    req: Request,
) => {


    const session = (await getServerSession(authOptions
    )) as CustomSession;
    const userId = session?.user?.id;

    if (!session || !userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const formData = await req.formData();


    // Extract form data
    const bio = formData.get("bio") as string;
    const birthdate = formData.get("birthdate") as string;
    const cover_picture = formData.get("cover_picture") as File;
    const location = formData.get("location") as string ? JSON.parse(formData.get("location") as string) as {
        street: string,
        city: string,
        state: string,
        zip: string,
        country: string,
    } : undefined
    const PhoneNumber = formData.get("PhoneNumber")
    const profile_picture = formData.get("profile_picture") as File;
    const websiteValue = formData.get("website") as string;
    const title = formData.get("title") as string;

    //   const location 
    //   const removeProfilePic = formData.get("removeProfilePic") as "update" | "keep" | "remove" | undefined;
    //   const removeCoverPic = formData.get("removeCoverPic") as "update" | "keep" | "remove" | undefined;

    const DimantionNewCover = formData.get("DimantionNewCover")
    const DimantionNewProfile = formData.get("DimantionNewProfile")
    const blurHashProfileNew = formData.get("blurHashProfileNew") as string
    const blurHashCoverNew = formData.get("blurHashCoverNew") as string






    // Find user and profile in parallel
    const [selectUser, findUserProfile] = await Promise.all([
        prisma.user.findFirst({ where: { id: +userId } }),
        prisma.profile.findUnique({ where: { user_id: +userId } }),
    ]);

    // Check if user exists
    if (!selectUser) {
        return NextResponse.json(
            { message: "This user does not exist" },
            { status: 400 }
        );
    }

    const uploadImage = async (file: File, username: string) => {
        if (!file) return { status: 200, data: null };
        try {
            const data = await Upload_coludnairy(file, username);
            return { status: 200, data: data as CloudinaryUploadResponse };
        } catch (error) {
            console.error("Image upload failed:", error);
            return { status: 500, data: null };
        }
    };

    // Check for existing profile pictures


    // Prepare variables for new URLs

    let coverPictureRes;
    let profilePictureRes;



    if (cover_picture) {
        coverPictureRes = await uploadImage(cover_picture, selectUser.user_name + "Profile");

    }
    if (profile_picture) {
        profilePictureRes = await uploadImage(profile_picture, selectUser.user_name + "Profile");

    }

    //   if (removeProfilePic === "remove" && existingProfilePic) {

    //     await deleteCloudinaryAsset(existingProfilePic.public_id);
    //     profilePictureRes = await uploadImage(
    //       profile_picture,
    //       selectUser.user_name
    //     );
    //   } else {
    //   }



    try {
        // Prepare profile data
        const profileData = {
            bio: bio || findUserProfile?.bio || "",
            birthdate: birthdate
                ? new Date(birthdate).toISOString()
                : findUserProfile?.birthdate || "",
            cover_picture:
                coverPictureRes?.data?.secure_url ||
                findUserProfile?.cover_picture ||
                "",
            user_id: +userId,

            // location_id: location || findUserProfile?.location_id,
            PhoneNumber: PhoneNumber as string || findUserProfile?.PhoneNumber || "",
            profile_picture:
                profilePictureRes?.data?.secure_url ||
                findUserProfile?.profile_picture ||
                "",
            website: websiteValue
                ? JSON.parse(websiteValue)
                : findUserProfile?.website || {},
            title: title || findUserProfile?.title || "",
            isCompleteProfile: true,
        };

        // Upsert profile data
        const updateProfile = await prisma.profile.upsert({
            where: { user_id: +userId },
            update: { ...profileData, },
            // location_id  : 1
            create: { ...profileData, isCompleteProfile: true },
            select: {
                user: {
                    select: {
                        id: true,
                        user_name: true,
                        first_name: true,
                        last_name: true,
                        gender: true,
                        email: true,
                        role: true,
                        profile: {
                            select: {
                                isCompleteProfile: true,
                                location_id: true,
                                user_id: true,
                                id: true,
                                birthdate: true,
                                PhoneNumber: true,
                                bio: true,
                                created_at: true,
                                updated_at: true,
                                title: true,
                                location: true,
                                website: true,
                                cover_picture: true,
                                profile_picture: true,
                                profilePictures: true
                            }
                        }
                    }
                }
            },
        })
        let loc;

        if (location) {

            const findProfile = await prisma.profile.findUnique({
                where: {
                    user_id: +userId
                },
                select: {
                    id: true,
                    location_id: true
                }
            })

            if (findProfile?.location_id) {

                loc = await prisma.address.update({
                    where: {
                        id: +findProfile.location_id
                    },
                    data: {

                        street: location.street,
                        city: location.city,
                        state: location.state,
                        zip: location.zip,
                        country: location.country,

                    }
                })
            }
            else {

                loc = await prisma.address.create({
                    data: {
                        profile: {
                            connect: {
                                id: findProfile?.id
                            }
                        },
                        street: location.street,
                        city: location.city,
                        state: location.state,
                        zip: location.zip,
                        country: location.country,
                    },

                })
            }

        }


        // Function to save profile pictures
        const saveProfilePicture = async (

            imageRes: CloudinaryUploadResponse,
            type: ProfilePictureType,
            updateProfileId: number
        ) => {
            let blurhash: string;
            if (
                type === "cover" &&
                DimantionNewCover &&
                blurHashCoverNew
            ) {
                blurhash = blurHashCoverNew

            } else if (
                type === "profile" &&
                DimantionNewProfile &&
                blurHashProfileNew
            ) {
                blurhash = blurHashProfileNew

            } else {
                blurhash = await generateBlurhash(
                    imageRes.eager[0].url,
                    imageRes.eager[0].width,
                    imageRes.eager[0].height
                );

            }
            // Check if the profile picture already exists
            const existingProfilePicture = await prisma.profilePicture.findUnique({
                where: {
                    type_profileId: {
                        profileId: updateProfileId,
                        type,
                    },
                },
            });

            const data = {
                profileId: updateProfileId,
                type: type,
                format: imageRes.type,
                public_url: imageRes.secure_url,
                public_id: imageRes.public_id,
                display_name: imageRes.display_name,
                asset_folder: imageRes.asset_folder,
                secure_url: imageRes.secure_url,
                tags: imageRes.tags,
                asset_id: imageRes.public_id,
                height: imageRes.height,
                width: imageRes.width,
                url: imageRes.secure_url,
                HashBlur: blurhash,
            };

            if (existingProfilePicture) {
                // Update existing profile picture
                await prisma.profilePicture.update({
                    where: {
                        id: existingProfilePicture.id,
                    },
                    data,
                });
            } else {
                // Create a new profile picture
                await prisma.profilePicture.create({
                    data,
                });
            }
        };

        const fixed = {
            // id: updateProfile.user.id,
            // user_name: updateProfile.user.user_name,
            // first_name: updateProfile.user.first_name,
            // last_name: updateProfile.user.last_name,
            // gender: updateProfile.user.gender,
            // email: updateProfile.user.email,
            // role: updateProfile.user.role,
            // profile: {
            isCompleteProfile: updateProfile.user?.profile?.isCompleteProfile,
            location_id: updateProfile.user?.profile?.location_id,
            user_id: updateProfile.user?.profile?.user_id,
            id: updateProfile.user?.profile?.id,
            birthdate: updateProfile.user?.profile?.birthdate,
            PhoneNumber: updateProfile.user?.profile?.PhoneNumber,
            bio: updateProfile.user?.profile?.bio,
            created_at: updateProfile.user?.profile?.created_at,
            updated_at: updateProfile.user?.profile?.updated_at,
            title: updateProfile.user?.profile?.title,
            // location: updateProfile.user?.profile?.location,
            location: loc as Address | undefined,
            website: updateProfile.user?.profile?.website,
            cover_picture: updateProfile.user?.profile?.cover_picture,
            profile_picture: updateProfile.user?.profile?.profile_picture,
            // profilePictures: updateProfile.user?.profile?.profilePictures,
            // }
        } as typeProfileWithPic


        if (profilePictureRes?.data && updateProfile && coverPictureRes?.data) {
            await Promise.all([
                profile_picture
                    ? saveProfilePicture(
                        profilePictureRes?.data,
                        "profile",
                        fixed?.id!
                    )
                    : Promise.resolve(),
                cover_picture
                    ? saveProfilePicture(coverPictureRes.data, "cover", fixed?.id!)
                    : Promise.resolve(),
            ]);
        }
        return NextResponse.json(
            fixed,
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to update profile:", error);
        return NextResponse.json(
            { message: "Failed to update profile", formData },
            { status: 500 }
        );
    }
};
