import prisma from "@/lib/prisma";
import { CloudinaryUploadResponse, Upload_coludnairy } from "@/utils";
import { PrismaClientRustPanicError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";
interface imagesData {
  img_path: string;
  public_id: string;
  asset_id: string;
  width: number;
  height: number;
  asset_folder: string;
  display_name: string;
  tags: string[];
  type: string;
}
export const POST = async (req: NextRequest) => {
    const formData = await req.formData();
    const title = formData.get("mainText") as string;
    const author_id = formData.get("author_id") as string;
    const images = formData.getAll("images") as File[];
    // return NextResponse.json({ title ,author_id ,images}, { status: 400 });
    if (!author_id ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
  
    const findUser = await prisma.user.findUnique({
      where: { id: +author_id },
    });
  
    if (!findUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  

    const imagesData: imagesData[] = [];
    const ErrorimagesData: File[]  = [];
  
    for (const img of images) {
      try {
        const uploadResult = await Upload_coludnairy(img, findUser.user_name + "post") as { status: number; data: CloudinaryUploadResponse } ;
        imagesData.push({ 
          img_path: uploadResult.data.secure_url ,
          public_id : uploadResult.data.public_id,
           asset_id : uploadResult.data.asset_id,
           width : uploadResult.data.width , 
           height : uploadResult.data.height, 
           asset_folder :uploadResult.data.asset_folder,
           display_name :uploadResult.data.display_name,
           tags: uploadResult.data.tags,
           type:uploadResult.data.type
        });
      } catch (error: any) {
        ErrorimagesData.push(img);
        console.error(`Error uploading image: ${error.message}`);
      }
    } 

  
    if (ErrorimagesData.length > 0) {
      return NextResponse.json({
        error: `Error uploading images: ${ErrorimagesData.map(img => img.name).join(', ')}`,
        failedImages: ErrorimagesData,
      }, { status: 200 });
    }
  
    try {
      const CreatePost = await prisma.post.create({
        data: {
          title,
          author_id: +author_id,
          post_image: {
            createMany: {
                data: [...imagesData],           
            },
          },
        
        },
        include: {
          Interactions :{
             select :{
              reaction :true
             }
          }
        },
      });
      console.log(CreatePost);
      return NextResponse.json(CreatePost, { status: 200 });
    } catch (error : any) {
      if (error instanceof PrismaClientRustPanicError) {
        console.error(`Prisma error: ${error.message}`);
        return NextResponse.json({ error: `Prisma error: ${error.message}` }, { status: 500 });
      } else {
        console.error(`Unknown error: ${error.message}`);
        return NextResponse.json({ error: `Unknown error: ${error.message}` }, { status: 500 });
      }
    }
  };