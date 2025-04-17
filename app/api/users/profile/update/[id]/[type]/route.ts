import prisma from "@/lib/prisma";
import {
  CloudinaryUploadResponse,
  deleteCloudinaryAsset,
  generateBlurhash,
  Upload_coludnairy,
} from "@/utils";
import { ProfilePictureType, User } from "@prisma/client";
import { NextResponse } from "next/server";

export const PUT = async (
  req: Request,
  { params }: { params: { id: string; type: string } }
) => {
  try {
    const formData = await req.formData();
    const bio = formData.get("bio") as string;
    const birthdate = formData.get("birthdate") as string;
    const coverPicture = formData.get("cover_picture") as File;
    const location = formData.get("location") as string;
    const phoneNumber = Number(formData.get("PhoneNumber"));
    const profilePicture = formData.get("profile_picture") as File;
    const websiteValue = formData.get("website") as string;
    const title = formData.get("title") as string;

    const [selectUser, findUserProfile] = await Promise.all([
      prisma.user.findFirst({ where: { id: +params.id } }),
      prisma.profile.findUnique({ where: { user_id: +params.id } }),
    ]);

    if (!selectUser) {
      return NextResponse.json(
        { message: "This user does not exist" },
        { status: 400 }
      );
    }

    // Validate the input based on the update type
    const updateFunctions: Record<string, Function> = {
      bio: () => updateBio(bio, findUserProfile),
      birthdate: () => updateBirthdate(birthdate, findUserProfile),
      "cover-picture": () => {
        if (!coverPicture) {
          throw new Error("No cover picture provided");
        }
        return updateCoverPicture(coverPicture, selectUser , findUserProfile?.id );
      },
      location: () => updateLocation(location, findUserProfile),
      "phone-number": () => updatePhoneNumber(phoneNumber, findUserProfile),
      "profile-picture": () => {
        if (!profilePicture) {
          throw new Error("No profile picture provided");
        }
        return updateProfilePicture(profilePicture, selectUser, findUserProfile?.id);
      },
      website: () => updateWebsite(websiteValue, findUserProfile),
      title: () => updateTitle(title, findUserProfile),
    };

    const updateFunction = updateFunctions[params.type];
    if (updateFunction) {
      return await updateFunction();
    } else {
      return NextResponse.json(
        { message: "Invalid update type" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: error || "An unexpected error occurred", error },
      { status: 500 }
    );
  }
};

// Define update functions
const updateBio = async (bio: string, profile: any) => {

  try {
    const profileRes = await prisma.$transaction(async (tx) => {
      // Update the bio first
      await tx.profile.update({
        where: { id: profile.id },
        data: { bio },
      });

      // Then fetch the updated profile including the related profilePictures
      return await tx.profile.findUnique({
        where: { id: profile.id },
        include: { profilePictures: true },
      });
    });

    return NextResponse.json(profileRes, { status: 200 });
  } catch (error) {
    throw new Error("Error updating bio");
  }
};



const updateBirthdate = async (birthdate: string, profile: any) => {
  try {
    const [updatedProfile] = await prisma.$transaction([
      prisma.profile.update({
        where: { id: profile.id },
        data: { birthdate },
      }),
      prisma.profile.findUnique({
        where: { id: profile.id },
        include: { profilePictures: true }
      })
    ]);
    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    throw new Error("Error updating birthdate");
  }

  //  const update =  await prisma.profile.update({
//     where: { id: profile.id },
//     data: { birthdate: new Date(birthdate).toISOString() },
//     include:{
//       profilePictures:true
//     }
//   });
//   return NextResponse.json(update , {
//     status:200
//   })
};

const updateLocation = async (location: string, profile: any) => {

  try {
    const [updatedProfile] = await prisma.$transaction([
      prisma.profile.update({
        where: { id: profile.id },
        data: { location },
      }),
      prisma.profile.findUnique({
        where: { id: profile.id },
        include: { profilePictures: true }
      })
    ]);
    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    throw new Error("Error updating location");
  }

};
const updatePhoneNumber = async (phoneNumber: number, profile: any) => {
  try {
    const [updatedProfile] = await prisma.$transaction([
      prisma.profile.update({
        where: { id: profile.id },
        data: {PhoneNumber: phoneNumber  },
      }),
      prisma.profile.findUnique({
        where: { id: profile.id },
        include: { profilePictures: true }
      })
    ]);
    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    throw new Error("Error updating phoneNumber");
  }

  
};
const updateCoverPicture = async (coverPicture: File, user: any , profileId?: number )  => {


  try {
    const coverPictureRes = await uploadImage(coverPicture, user.user_name);
    const updated = await saveProfilePicture(coverPictureRes, "cover", profileId!);
    

  

  const [updatedProfile] = await prisma.$transaction([
     prisma.profile.update({
      where: { user_id: user.id },
      data: { cover_picture: coverPictureRes.data?.secure_url },
      include:{
        profilePictures:true
      }
    }),
    prisma.profile.findUnique({
      where: { id:profileId},
      include: { profilePictures: true }
    })
  ]);
  return NextResponse.json(updatedProfile, { status: 200 });
} catch (error) {
  throw new Error("Error updating cover picture");
    
}
};



const updateProfilePicture = async (
  profilePicture: File,
  user: User,
  profileId?: number
) => {
  const profilePictureRes = await uploadImage(profilePicture, user.user_name);
  const updated = await saveProfilePicture(profilePictureRes, "profile", profileId!);



  const [updatedProfile ] = await prisma.$transaction([
    prisma.profile.update({
      where: { user_id: user.id },
      data: { profile_picture: profilePictureRes.data?.secure_url },
      include:{
  profilePictures:true
      }
    }),
   prisma.profile.findUnique({
     where: { id:profileId},
     include: { profilePictures: true }
   })
 ]);
 return NextResponse.json(updatedProfile, { status: 200 });
  // return NextResponse.json(
  //   {
  //     ...update,
  //   },
  //   {
  //     status: 200,
  //   }
  // );
};

const updateWebsite = async (websiteValue: string, profile: any) => {
  try {
    const [updatedProfile] = await prisma.$transaction([
      prisma.profile.update({
        where: { id: profile.id },
        data: { website :JSON.parse(websiteValue) },
      }),
      prisma.profile.findUnique({
        where: { id: profile.id },
        include: { profilePictures: true }
      })
    ]);
    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    throw new Error("Error updating website");
  }

};

const updateTitle = async (title: string, profile: any) => {
  try {
    const [updatedProfile] = await prisma.$transaction([
      prisma.profile.update({
        where: { id: profile.id },
        data: { title },
      }),
      prisma.profile.findUnique({
        where: { id: profile.id },
        include: { profilePictures: true }
      })
    ]);
    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    throw new Error("Error updating title");
  }

};

const uploadImage = async (file: File, username: string) => {
  if (!file) return { status: 400, data: null };

  try {
    const data = await Upload_coludnairy(file, username);
    return { status: 200, data: data as CloudinaryUploadResponse };
  } catch (error) {
    throw new Error("Image upload failed");
  }
};

const saveProfilePicture = async (

  dataUpload: { status: number; data: CloudinaryUploadResponse | null },
  type: ProfilePictureType,
  updateProfileId: number
) => {
  if (!dataUpload || !dataUpload.data) throw new Error("No image data to save");

  const blurhash = await generateBlurhash(
    dataUpload.data.eager[0].url,
    dataUpload.data.eager[0].width,
    dataUpload.data.eager[0].height
  );

  let existingProfilePicture;
  if (updateProfileId) {
    existingProfilePicture = await prisma.profilePicture.findUnique({
      where: {
        type_profileId: {
          profileId: updateProfileId,
          type,
        },
      },
    });
  }

  const data = {
    profileId: updateProfileId,
    type: type,
    format: dataUpload.data.type,
    public_url: dataUpload.data.secure_url,
    public_id: dataUpload.data.public_id,
    display_name: dataUpload.data.display_name,
    asset_folder: dataUpload.data.asset_folder,
    secure_url: dataUpload.data.secure_url,
    tags: dataUpload.data.tags,
    asset_id: dataUpload.data.public_id,
    height: dataUpload.data.height,
    width: dataUpload.data.width,
    url: dataUpload.data.secure_url,
    HashBlur: blurhash,
  };

  if (existingProfilePicture) {
    await deleteCloudinaryAsset(existingProfilePicture.public_id);
    await prisma.profilePicture.update({
      where: { id: existingProfilePicture.id },
      data,
    });
    return { message: "Profile picture updated successfully", data };
  } else {
    await prisma.profilePicture.create({ data });
    return { message: "Profile picture created successfully", data };
  }
};


// import prisma from "@/lib/prisma"
// import { type CloudinaryUploadResponse, deleteCloudinaryAsset, generateBlurhash, Upload_coludnairy } from "@/utils"
// import type { ProfilePictureType, User } from "@prisma/client"
// import { NextResponse } from "next/server"

// const uploadImage = async (file: File, userName: string) => {
//   const uploadResponse = await Upload_coludnairy(file, userName)
//   return uploadResponse
// }

// const saveProfilePicture = async (
//   dataUpload: { status: number; data: CloudinaryUploadResponse | null },
//   type: ProfilePictureType,
//   updateProfileId: number,
// ) => {
//   if (!dataUpload || !dataUpload.data) throw new Error("No image data to save")

//   const blurhash = await generateBlurhash(
//     dataUpload.data.eager[0].url,
//     dataUpload.data.eager[0].width,
//     dataUpload.data.eager[0].height,
//   )

//   let existingProfilePicture
//   if (updateProfileId) {
//     existingProfilePicture = await prisma.profilePicture.findUnique({
//       where: {
//         type_profileId: {
//           profileId: updateProfileId,
//           type,
//         },
//       },
//     })
//   }

//   const data = {
//     profileId: updateProfileId,
//     type: type,
//     format: dataUpload.data.type,
//     public_url: dataUpload.data.secure_url,
//     public_id: dataUpload.data.public_id,
//     display_name: dataUpload.data.display_name,
//     asset_folder: dataUpload.data.asset_folder,
//     secure_url: dataUpload.data.secure_url,
//     tags: dataUpload.data.tags,
//     asset_id: dataUpload.data.public_id,
//     height: dataUpload.data.height,
//     width: dataUpload.data.width,
//     url: dataUpload.data.secure_url,
//     HashBlur: blurhash,
//   }

//   if (existingProfilePicture) {
//     await deleteCloudinaryAsset(existingProfilePicture.public_id)
//     await prisma.profilePicture.update({
//       where: { id: existingProfilePicture.id },
//       data,
//     })
//     return { message: "Profile picture updated successfully", data }
//   } else {
//     await prisma.profilePicture.create({ data })
//     return { message: "Profile picture created successfully", data }
//   }
// }

// export const PUT = async (req: Request, { params }: { params: { id: string; type: string } }) => {
//   try {
//     const formData = await req.formData()
//     const bio = formData.get("bio") as string
//     const birthdate = formData.get("birthdate") as string
//     const coverPicture = formData.get("cover_picture") as File
//     const location = formData.get("location") as string
//     const phoneNumber = Number(formData.get("PhoneNumber"))
//     const profilePicture = formData.get("profile_picture") as File
//     const websiteValue = formData.get("website") as string
//     const title = formData.get("title") as string

//     const [selectUser, findUserProfile] = await Promise.all([
//       prisma.user.findFirst({ where: { id: +params.id } }),
//       prisma.profile.findUnique({ where: { user_id: +params.id } }),
//     ])

//     if (!selectUser || !findUserProfile) {
//       return NextResponse.json({ message: "This user or profile does not exist" }, { status: 400 })
//     }

//     // Validate the input based on the update type
//     const updateFunctions: Record<string, Function> = {
//       bio: () => updateBio(bio, findUserProfile.id),
//       birthdate: () => updateBirthdate(birthdate, findUserProfile.id),
//       "cover-picture": () => {
//         if (!coverPicture) {
//           throw new Error("No cover picture provided")
//         }
//         return updateCoverPicture(coverPicture, selectUser, findUserProfile.id)
//       },
//       location: () => updateLocation(location, findUserProfile.id),
//       "phone-number": () => updatePhoneNumber(phoneNumber, findUserProfile.id),
//       "profile-picture": () => {
//         if (!profilePicture) {
//           throw new Error("No profile picture provided")
//         }
//         return updateProfilePicture(profilePicture, selectUser, findUserProfile.id)
//       },
//       website: () => updateWebsite(websiteValue, findUserProfile.id),
//       title: () => updateTitle(title, findUserProfile.id),
//     }

//     const updateFunction = updateFunctions[params.type]
//     if (updateFunction) {
//       return await updateFunction()
//     } else {
//       return NextResponse.json({ message: "Invalid update type" }, { status: 400 })
//     }
//   } catch (error) {
//     return NextResponse.json({ message: error || "An unexpected error occurred", error }, { status: 500 })
//   }
// }

// // Helper function to get updated profile
// const getUpdatedProfile = async (profileId: number) => {
//   return await prisma.profile.findUnique({
//     where: { id: profileId },
//     include: { profilePictures: true },
//   })
// }

// // Update functions
// const updateBio = async (bio: string, profileId: number) => {
//   await prisma.profile.update({
//     where: { id: profileId },
//     data: { bio },
//   })
//   const updatedProfile = await getUpdatedProfile(profileId)
//   return NextResponse.json(updatedProfile, { status: 200 })
// }

// const updateBirthdate = async (birthdate: string, profileId: number) => {
//   await prisma.profile.update({
//     where: { id: profileId },
//     data: { birthdate },
//   })
//   const updatedProfile = await getUpdatedProfile(profileId)
//   return NextResponse.json(updatedProfile, { status: 200 })
// }

// const updateLocation = async (location: string, profileId: number) => {
//   await prisma.profile.update({
//     where: { id: profileId },
//     data: { location },
//   })
//   const updatedProfile = await getUpdatedProfile(profileId)
//   return NextResponse.json(updatedProfile, { status: 200 })
// }

// const updatePhoneNumber = async (phoneNumber: number, profileId: number) => {
//   await prisma.profile.update({
//     where: { id: profileId },
//     data: { PhoneNumber: phoneNumber },
//   })
//   const updatedProfile = await getUpdatedProfile(profileId)
//   return NextResponse.json(updatedProfile, { status: 200 })
// }

// const updateWebsite = async (websiteValue: string, profileId: number) => {
//   await prisma.profile.update({
//     where: { id: profileId },
//     data: { website: JSON.parse(websiteValue) },
//   })
//   const updatedProfile = await getUpdatedProfile(profileId)
//   return NextResponse.json(updatedProfile, { status: 200 })
// }

// const updateTitle = async (title: string, profileId: number) => {
//   await prisma.profile.update({
//     where: { id: profileId },
//     data: { title },
//   })
//   const updatedProfile = await getUpdatedProfile(profileId)
//   return NextResponse.json(updatedProfile, { status: 200 })
// }

// const updateCoverPicture = async (coverPicture: File, user: User, profileId: number) => {
//   const coverPictureRes = await uploadImage(coverPicture, user.user_name)
//   await saveProfilePicture(coverPictureRes, "cover", profileId)
//   await prisma.profile.update({
//     where: { id: profileId },
//     data: { cover_picture: coverPictureRes.data?.secure_url },
//   })
//   const updatedProfile = await getUpdatedProfile(profileId)
//   return NextResponse.json(updatedProfile, { status: 200 })
// }

// const updateProfilePicture = async (profilePicture: File, user: User, profileId: number) => {
//   const profilePictureRes = await uploadImage(profilePicture, user.user_name)
//   await saveProfilePicture(profilePictureRes, "profile", profileId)
//   await prisma.profile.update({
//     where: { id: profileId },
//     data: { profile_picture: profilePictureRes.data?.secure_url },
//   })
//   const updatedProfile = await getUpdatedProfile(profileId)
//   return NextResponse.json(updatedProfile, { status: 200 })
// }

