import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import streamifier from "streamifier"
cloudinary.v2.config({
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});
interface paramsInterface {
        id :number
}
export const Upload_coludnairy = async (file : File, userFolder? :  string ,  params? : paramsInterface ) => {
  console.log(file)  
  
  if (!file) return NextResponse.json({ message: "No file provided" }, { status: 400 });
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer)

        const  uploadFromBuffer = async (file  :Buffer) => {

            return new Promise((resolve, reject) => {
         
              let cld_upload_stream = cloudinary.v2.uploader.upload_stream(
               {
                 folder: userFolder  || "defualt_Folder"
               },
               (error: any, result: any) => {
         
                 if (result) {
                   resolve(result);
                 } else {
                   reject(error);
                  }
                }
              );
         
              streamifier.createReadStream(file).pipe(cld_upload_stream);
            });
         
         };
         
         const  result  : any   = await uploadFromBuffer(buffer);
              



         return { status: 200, data: result.secure_url };

     
        

    } catch (error) {
        console.error(error);
        return { status: 500, data: 'Error uploading file' };
    }
};
