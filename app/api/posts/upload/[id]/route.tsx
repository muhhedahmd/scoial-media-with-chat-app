import  prisma  from "@/lib/prisma";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import streamifier from "streamifier"
// Configure Cloudinary
cloudinary.v2.config({
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const POST = async (req: Request, { params }: { params: { id: string } }) => {
    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) return NextResponse.json({ message: "No file provided" }, { status: 400 });

    // Upload to Cloudinary
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer)

        const  uploadFromBuffer = async (req  :Buffer) => {

            return new Promise((resolve, reject) => {
         
              let cld_upload_stream = cloudinary.v2.uploader.upload_stream(
               {
                 folder: "foo"
               },
               (error: any, result: any) => {
         
                 if (result) {
                   resolve(result);
                 } else {
                   reject(error);
                  }
                }
              );
         
              streamifier.createReadStream(req).pipe(cld_upload_stream);
            });
         
         };
         
         const  result  : any   = await uploadFromBuffer(buffer);
         

        // Save image information to the database
        const post = await prisma.post.findUnique({
            where: {
                id: +params.id,
            },
        });

        // if (post) {
        //     const image = await prisma.post_image.create({
        //         data: {
        //             img_path: result.s, // Use the URL returned by Cloudinary
        //             post_id: +params.id,
        //         },
        //     });
        //     return NextResponse.json(image, { status: 200 });
        // } else {
        //     return NextResponse.json({ message: "Post not found" }, { status: 404 });
        // }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error uploading file" }, { status: 500 });
    }
};
