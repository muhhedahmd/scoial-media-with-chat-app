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

export interface CloudinaryUploadResponse {
  status: number;
  secure_url: string;
  public_id: string;
  asset_id: string;
  width: number;
  height: number;
  asset_folder: string;
  display_name: string;
  tags: string[];
  type: string;
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
                 folder: userFolder  || "defualt_Folder",
                  sign_url: true,
                   type: "authenticated"
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
         
         const  result  = await uploadFromBuffer(buffer) as CloudinaryUploadResponse
              



         return { status: 200,
        data : { secure_url: result.secure_url  ,
           public_id : result.public_id,
           asset_id : result.asset_id,
           width : result.width, 
           height : result.height, 
           asset_folder :result.asset_folder,
           display_name :result.display_name,
           tags: result.tags,
           type:result.type}

         }

     
        

    } catch (error) {
        console.error(error);
        return { status: 500, data: 'Error uploading file' };
    }
};

export const updateCloudinaryAsset = async (publicId: string, updates: any) => {
  try {
    const result = await cloudinary.v2.uploader.update_metadata(publicId, updates , {
      type: 'authenticated',
    });
    return { status: 200, res : {message: `Asset updated successfully` , result }};
  } catch (error) {
    console.error(error);
    return { status: 500, message: `Error updating asset` };
  }
};;

export const deleteCloudinaryAsset = async (publicId: string) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId ,{
  
      type: "authenticated"
    });
    return { status: 200, res  : {message: `Asset deleted successfully` , result} };
  } catch (error) {
    console.error(error);
    return { status: 500, message: `Error deleting asset` };
  }
}

// {
//   "asset_id": "03a5b92135161439031d3834c04bc31b",
//   "public_id": "sample",
//   "version": 1719304854,
//   "version_id": "b4df5fee4358f099f58c6bdd07fcf01a",
//   "signature": "9a98bec3f8947d518e1769366b86a59241368a89",
//   "width": 864,
//   "height": 576,
//   "format": "jpg",
//   "resource_type": "image",
//   "created_at": "2024-06-25T08:40:54Z",
//   "tags": [],
//   "bytes": 120253,
//   "type": "upload",
//   "placeholder": false,
//   "url": "http://res.cloudinary.com/cld-docs/image/upload/v1719304854/sample.jpg",
//   "secure_url": "https://res.cloudinary.com/cld-docs/image/upload/v1719304854/sample.jpg",
//   "asset_folder": "",
//   "display_name": "sample",
//   "eager": [
//     {
//       "transformation": "c_crop,g_face,h_400,w_400",
//       "width": 400,
//       "height": 400,
//       "bytes": 27867,
//       "format": "jpg",
//       "url": "http://res.cloudinary.com/cld-docs/image/upload/c_crop,g_face,h_400,w_400/v1719304854/sample.jpg",
//       "secure_url": "https://res.cloudinary.com/cld-docs/image/upload/c_crop,g_face,h_400,w_400/v1719304854/sample.jpg"
//     },
//     {
//       "transformation": "b_blue,c_pad,h_400,w_660",
//       "width": 660,
//       "height": 400,
//       "bytes": 49666,
//       "format": "jpg",
//       "url": "http://res.cloudinary.com/cld-docs/image/upload/b_blue,c_pad,h_400,w_660/v1719304854/sample.jpg",
//       "secure_url": "https://res.cloudinary.com/cld-docs/image/upload/b_blue,c_pad,h_400,w_660/v1719304854/sample.jpg"
//     }
//   ]
// }