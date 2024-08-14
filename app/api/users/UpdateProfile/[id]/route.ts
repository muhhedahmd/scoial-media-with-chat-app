import prisma from "@/lib/prisma";
import { Upload_coludnairy } from "@/utils";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } }
) => {

  
  const formData = await req.formData();

  const  bio =  formData.get("bio")  as string
  const  birthdate= formData.get("birthdate")  as string
  const  cover_picture= formData.get("cover_picture") as File
  const   location= formData.get("location")  as string
  const   PhoneNumber= Number(formData.get("PhoneNumber")) 
  const   profile_picture= formData.get("profile_picture")  as File
  const websiteValue = formData.get("website")  as string
  const title = formData.get("title")  as string
  

  // console.log({cover_picture ,title ,birthdate ,websiteValue :JSON.parse(websiteValue)})
  // return NextResponse.json({bio , birthdate 
  //   , cover_picture, location, PhoneNumber   , profile_picture, websiteValue

  // } , {status :200})
  
  // const website = JSON.parse(websiteValue) as Record<string, string>;
  
  // const errors: string[] = [];



  const selectUser = await prisma.user.findFirst({
    where: {
      id: +params.id,
    },
  });
  if (!!selectUser) {
    const findUserProfile = await prisma.profile.findUnique({
      where: {
        user_id: +params.id,
      },
    });

    const [coverPictureRes, profilePictureRes] = await Promise.all([
      Upload_coludnairy(cover_picture, selectUser.user_name),
      Upload_coludnairy(profile_picture, selectUser.user_name),
  ]);

  if (coverPictureRes.status !== 200 || profilePictureRes.status !== 200) {
      return NextResponse.json(
          {
              message: 'Failed to upload pictures',
              formData, 
          },
          { status: 400 }
      );
  }

    console.log(coverPictureRes ,profilePictureRes)
  
    // if (!!findUserProfile) {
        const updateProfile = await prisma.profile.upsert({
            where: {
              user_id: +params.id,
            },
            update: {
              bio: bio || findUserProfile?.bio || "",
              birthdate: new Date(birthdate).toISOString() || findUserProfile?.birthdate || "",
              cover_picture: coverPictureRes.data || findUserProfile?.cover_picture || "",
              location: location || findUserProfile?.location || "",
              PhoneNumber: PhoneNumber || findUserProfile?.PhoneNumber || 0,
              profile_picture: profilePictureRes.data || findUserProfile?.profile_picture || "",
              website: JSON.parse(websiteValue) || findUserProfile?.website ||{},
              title : title || findUserProfile?.title ||"",
              isCompleteProfile :true
            },
            create: {
              bio: bio || "",
              birthdate:new Date(birthdate).toISOString()  || "",
              cover_picture: coverPictureRes.data|| "",
              user_id: +params.id,
              location: location || "",
              PhoneNumber: Number(formData.get("PhoneNumber")) || 0,
              profile_picture: profilePictureRes.data  || "",
              website: JSON.parse(websiteValue) || {},
              title : title || "",
              isCompleteProfile :true
            },
          });

          
          
    
        return NextResponse.json({updateProfile }, { status: 200 });

  } else {
    return NextResponse.json(
      { message: "This user is not exisit" },
      { status: 400 }
    );
  }
};


// {
//   "asset_id": "3515c6000a548515f1134043f9785c2f",
//   "public_id": "gotjephlnz2jgiu20zni",
//   "version": 1719307544,
//   "version_id": "7d2cc533bee9ff39f7da7414b61fce7e",
//   "signature": "d0b1009e3271a942836c25756ce3e04d205bf754",
//   "width": 1920,
//   "height": 1441,
//   "format": "jpg",
//   "resource_type": "image",
//   "created_at": "2024-06-25T09:25:44Z",
//   "tags": [],
//   "pages": 1,
//   "bytes": 896838,
//   "type": "upload",
//   "etag": "2a2df1d2d2c3b675521e866599273083",
//   "placeholder": false,
//   "url": "http://res.cloudinary.com/cld-docs/image/upload/v1719307544/gotjephlnz2jgiu20zni.jpg",
//   "secure_url": "https://res.cloudinary.com/cld-docs/image/upload/v1719307544/gotjephlnz2jgiu20zni.jpg",
//   "asset_folder": "",
//   "display_name": "gotjephlnz2jgiu20zni",
//   "original_filename": "sample",
//   "api_key": "614335564976464"
// }