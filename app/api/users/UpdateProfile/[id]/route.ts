import prisma from "@/lib/prisma";
import {
  CloudinaryUploadResponse,
  deleteCloudinaryAsset,
  generateBlurhash,
  Upload_coludnairy,
} from "@/utils";
import { ProfilePictureType } from "@prisma/client";
import { NextResponse } from "next/server";

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const formData = await req.formData();

  // Extract form data
  const bio = formData.get("bio") as string;
  const birthdate = formData.get("birthdate") as string;
  const cover_picture = formData.get("cover_picture") as File;
  const location = formData.get("location") as string;
  const PhoneNumber = Number(formData.get("PhoneNumber"));
  const profile_picture = formData.get("profile_picture") as File;
  const websiteValue = formData.get("website") as string;
  const title = formData.get("title") as string;

  // Find user and profile in parallel
  const [selectUser, findUserProfile] = await Promise.all([
    prisma.user.findFirst({ where: { id: +params.id } }),
    prisma.profile.findUnique({ where: { user_id: +params.id } }),
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
  const existingProfilePictures = await prisma.profilePicture.findMany({
    where: {
      profile: {
        user_id: +params.id,
      },
    },
  });

  // Prepare variables for new URLs

  let coverPictureRes;
  let profilePictureRes;

  // Update cover picture if it exists and a new one is provided
  const existingCoverPic = existingProfilePictures.find(
    (e) => e.type === "cover"
  );

  const existingProfilePic = existingProfilePictures.find(
    (e) => e.type === "profile"
  );

  if(existingCoverPic && cover_picture) {
    await deleteCloudinaryAsset(existingCoverPic.public_id);
    coverPictureRes = await uploadImage(
      cover_picture,
      selectUser.user_name
    );
  }else {
    coverPictureRes = await uploadImage(cover_picture, selectUser.user_name+"Profile");

  }

  if(existingProfilePic && cover_picture) {
    await deleteCloudinaryAsset(existingProfilePic.public_id);
    profilePictureRes = await uploadImage(
      profile_picture,
      selectUser.user_name
    );
  }else {
    profilePictureRes = await uploadImage(profile_picture, selectUser.user_name+"Profile");
  }
  


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
      user_id: +params.id,
      location: location || findUserProfile?.location || "",
      PhoneNumber: PhoneNumber || findUserProfile?.PhoneNumber || 0,
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
      where: { user_id: +params.id },
      update: profileData,
      create: { ...profileData, isCompleteProfile: true },
    });

    // Function to save profile pictures
    const saveProfilePicture = async (
      imageRes: CloudinaryUploadResponse,
      type: ProfilePictureType,
      updateProfileId: number
    ) => {
      const blurhash = await generateBlurhash(
        imageRes.eager[0].url,
        imageRes.eager[0].width,
        imageRes.eager[0].height
      );

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

    // Save profile and cover pictures if they exist
    if (profilePictureRes?.data && updateProfile && coverPictureRes?.data) {
      await Promise.all([
        profile_picture
          ? saveProfilePicture(
              profilePictureRes?.data,
              "profile",
              updateProfile.id
            )
          : Promise.resolve(),
        cover_picture
          ? saveProfilePicture(coverPictureRes.data, "cover", updateProfile.id)
          : Promise.resolve(),
      ]);
    }
    return NextResponse.json(
      updateProfile,
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
