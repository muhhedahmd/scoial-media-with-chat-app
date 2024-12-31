import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import streamifier from "streamifier";
import imageCompression from "browser-image-compression";
import sharp from "sharp";
import { encode } from "blurhash";
import fetch from "node-fetch";
cloudinary.v2.config({
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});
interface paramsInterface {
  id: number;
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
  eager: [
    {
      transformation: string;
      width: number;
      height: number;
      bytes: number;
      format: string;
      url: string;
      secure_url: string;
    }
  ];
}

export const Upload_coludnairy = async (
  file: File,
  userFolder?: string,
  params?: paramsInterface
) => {
  console.log(file);

  if (!file)
    return NextResponse.json({ message: "No file provided" }, { status: 400 });
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadFromBuffer = async (file: Buffer) => {
      return new Promise((resolve, reject) => {
        let cld_upload_stream = cloudinary.v2.uploader.upload_stream(
          {
            folder: userFolder || "defualt_Folder",
            sign_url: true,
            type: "authenticated",
            eager: [
              {
                effect: "blur",
                crop: "scale",
                width: 400,
                height: 400,
                blur_radius: 500, // adjust the blur radius to your liking
              },
            ],
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

    const result = (await uploadFromBuffer(buffer)) as CloudinaryUploadResponse;

    return result;
  } catch (error) {
    console.error(error);
    return { status: 500, data: "Error uploading file" };
  }
};

export const updateCloudinaryAsset = async (publicId: string, updates: any) => {
  try {
    const result = await cloudinary.v2.uploader.update_metadata(
      publicId,
      updates,
      {
        type: "authenticated",
        sign_url: true,
        eager: [
          {
            effect: "blur",
            crop: "scale",
            width: 400,
            height: 400,
            blur_radius: 500, // adjust the blur radius to your liking
          },
        ],
      }
    );
    console.log({ result });
    return result as cloudinary.MetadataFieldApiResponse;
  } catch (error) {
    console.error(error);
    return { status: 500, message: `Error updating asset` };
  }
};

export const deleteCloudinaryAsset = async (publicId: string) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId, {
      type: "authenticated",
    });
    return {
      status: 200,
      res: { message: `Asset deleted successfully`, result },
    };
  } catch (error) {
    console.error(error);
    return { status: 500, message: `Error deleting asset` };
  }
};

export type FileUploadResponse = {
  url: string;

  public_id: string;

  format: string;

  resource_type: string;

  bytes: number;

  original_filename: string;
};

type UploadOptions = {
  folder?: string;

  maxSize?: number; // in bytes

  allowedFormats?: string[];
};

export const uploadFile = async (
  file: File,

  options: UploadOptions = {}
): Promise<FileUploadResponse> => {
  try {
    const {
      folder = "uploads",

      maxSize = 10 * 1024 * 1024, // 10MB default

      allowedFormats = [], // empty means all formats allowed
    } = options;

    // Validate file size

    if (file.size > maxSize) {
      throw new Error(
        `File size exceeds limit of ${maxSize / (1024 * 1024)}MB`
      );
    }

    // Get file extension

    const extension = file.name.split(".").pop()?.toLowerCase() || "";

    // Validate format if allowedFormats is specified

    if (allowedFormats.length > 0 && !allowedFormats.includes(extension)) {
      throw new Error(`File format .${extension} is not allowed`);
    }

    // Determine resource type based on file mime type

    let resourceType = "raw";

    if (file.type.startsWith("image/")) {
      resourceType = "image";
    } else if (file.type.startsWith("video/")) {
      resourceType = "video";
    }

    // Convert file to base64

    const fileToBase64 = (file: Buffer): string => {
      return Buffer.from(file).toString("base64");
    };

    const base64Data = fileToBase64(Buffer.from(await file.arrayBuffer()));

    const base64Uri = `data:${file.type};base64,${base64Data}`;
    // const uploadResult = await cloudinary.v2.uploader.upload(base64Uri, {
    //   // folder,
    //   access_mode :"authenticated",
    //   format: "pdf",
    //   resource_type: "raw",
    //   // unique_filename: true,
    //   // use_filename: true,
    // });


    const uploadFromBuffer = async (file: Buffer) => {
      return new Promise((resolve, reject) => {
        let cld_upload_stream = cloudinary.v2.uploader.upload_stream(
          {
            // folder: "userFolder" ,
            // type: "authenticated",
           resource_type:"auto" ,

            // eager: [
            //   {
            //     effect: "blur",
            //     crop: "scale",
            //     width: 400,
            //     height: 400,
            //     blur_radius: 500, // adjust the blur radius to your liking
            //   },
            // ],
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
    const uploadResult = (await uploadFromBuffer(Buffer.from(await file.arrayBuffer()))) as CloudinaryUploadResponse;

    return {

      ...uploadResult,
      url: uploadResult.secure_url,

      public_id: uploadResult.public_id,

      format: "pdf",

      resource_type: "raw",

      bytes: 100,

      original_filename: "uploadResult.original_filename",
    };
  } catch (error) {
    console.error("Upload error:", error);

    throw error instanceof Error ? error : new Error("Failed to upload file");
  }
};

// Helper function to convert File to base64


// Delete file from cloudinary

// Example usage:

/*

// Upload an image

const imageUpload = await uploadFile(imageFile, {

  folder: 'images',

  maxSize: 5 * 1024 * 1024, // 5MB

  allowedFormats: ['jpg', 'jpeg', 'png', 'gif']

});


// Upload a CSV file

const csvUpload = await uploadFile(csvFile, {

  folder: 'documents/csv',

  maxSize: 2 * 1024 * 1024, // 2MB

  allowedFormats: ['csv']

});


// Upload a text file

const textUpload = await uploadFile(textFile, {

  folder: 'documents/text',

  maxSize: 1 * 1024 * 1024, // 1MB

  allowedFormats: ['txt']

});


// Upload any file without restrictions

const anyFileUpload = await uploadFile(anyFile, {

  folder: 'misc'

});


// Delete a file

await deleteFile(filePublicId, resourceType);

*/

// Common file type configurations

export const FILE_UPLOAD_CONFIGS = {
  image: {
    folder: "images",

    maxSize: 5 * 1024 * 1024, // 5MB

    allowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
  },

  video: {
    folder: "videos",

    maxSize: 50 * 1024 * 1024, // 50MB

    allowedFormats: ["mp4", "mov", "avi", "webm"],
  },

  document: {
    folder: "documents",

    maxSize: 10 * 1024 * 1024, // 10MB

    allowedFormats: ["pdf", "doc", "docx", "txt", "csv", "xls", "xlsx"],
  },

  audio: {
    folder: "audio",

    maxSize: 20 * 1024 * 1024, // 20MB

    allowedFormats: ["mp3", "wav", "ogg"],
  },
};

export const isValidFileType = (file: File, ALLOWED_FORMATS: string[]) => {
  const fileType = file.type.split("/").pop();
  if (!fileType) return;
  return ALLOWED_FORMATS.includes(fileType);
};

export const generateBlurhash = async (
  imageUrl: string,

  width: number,

  height: number
): Promise<string> => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch the image");
    }
    const imageBuffer = await response.arrayBuffer();
    const { data, info } = await sharp(imageBuffer)
      .raw()

      .ensureAlpha()

      .resize(32, 32) // Resize for faster processing

      .toBuffer({ resolveWithObject: true });
    const resizedWidth = info.width; // 32 in this case
    const resizedHeight = info.height; // 32 in this case
    const blurhash = encode(
      new Uint8ClampedArray(data),

      resizedWidth,

      resizedHeight,

      4, // X components

      4 // Y components
    );

    console.log("Image Width:", width);
    console.log("Image Height:", height);
    console.log("Pixel Array Length:", imageBuffer);
    return blurhash;
  } catch (error) {
    console.error("Error generating blurhash:", error);

    throw error;
  }
};
export async function compressImage(file: File, maxSizeMB: number) {
  const options = {
    maxSizeMB: maxSizeMB, // Maximum size in MB
    useWebWorker: true, // Use web worker for better performance
  };
  try {
    const compressedFile = await imageCompression(file, options);
    console.log(compressedFile);
    return compressedFile;
  } catch (error) {
    console.log(error);
    return error;
  }
}
export const handleImageUpload = async (file: File) => {
  const options = {
    maxSizeMB: 1, // Target max size in MB (Instagram limits image size)
    maxWidthOrHeight: 1080, // Maximum width or height (Instagram uses 1080px)
    useWebWorker: true, // Use a web worker for better performance
  };

  try {
    const compressedFile = await imageCompression(file, options);

    return compressedFile;

    // Make your API call with the compressed image here
  } catch (error) {
    console.error("Image compression error:", error);
  }
};
