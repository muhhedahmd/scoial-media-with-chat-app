import { parserData } from "@/app/_components/mentionComp/MentionDropDown";
import prisma from "@/lib/prisma";
import {
  CloudinaryUploadResponse,
  generateBlurhash,
  Upload_coludnairy,
} from "@/utils";
import { PrismaClientRustPanicError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";
interface imagesData {
  img_path: string;
  public_id: string;
  asset_id: string;
  width: number;
  height: number;
  HashBlur: string;
  asset_folder: string;
  display_name: string;
  tags: string[];
  type: string;
}
export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const title = formData.get("mainText") as string;
  const activeLocation = (+formData.get("activeLocation")! as number) || null;
  const author_id = formData.get("author_id") as string;
  const images = formData.getAll("images") as File[];
  const parsedData = formData.get("parsedData") as string | undefined;
  const parsed = JSON.parse(parsedData || "[]") as parserData;
  const mentions = parsed?.mentions ?? [];

  if (!author_id) {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  const findUser = await prisma.user.findUnique({
    where: { id: +author_id },
  });

  if (!findUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // const imagesData: imagesData[] = [];
  const ErrorimagesData: File[] = [];

  const uploadImage = async (file: File, username: string) => {
    if (!file) return { status: 200, data: null };

    console.log({ file });

    try {
      if (file) {
        console.log(file);
        const data = await Upload_coludnairy(file, username);
        return { status: 200, data: data as CloudinaryUploadResponse };
      } else {
        return { status: 500, data: null };
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      return { status: 500, data: null };
    }
  };

  const uploadResults = await Promise.all(
    images.map(async (image) => {
      console.log({ image });
      const uploadResponse = await uploadImage(image, findUser.user_name);
      if (uploadResponse.status === 200 && uploadResponse.data) {
        const blurhash = await generateBlurhash(
          uploadResponse.data.secure_url,
          uploadResponse.data.width,
          uploadResponse.data.height
        );
        return {
          img_path: uploadResponse.data.secure_url || " ",
          public_id: uploadResponse.data.public_id || " ",
          asset_id: uploadResponse.data.asset_id || " ",
          width: uploadResponse.data.width || 0,
          height: uploadResponse.data.height || 0,
          display_name: uploadResponse.data.display_name || "",
          asset_folder: uploadResponse.data.asset_folder || "",
          HashBlur: blurhash || " ",
          tags: uploadResponse.data.tags || "",
          type: uploadResponse.data.type || " ",
        };
      }
      // return null;
    })
  );

  if (ErrorimagesData.length > 0) {
    return NextResponse.json(
      {
        error: `Error uploading images: ${ErrorimagesData.map(
          (img) => img.name
        ).join(", ")}`,
        failedImages: ErrorimagesData,
      },
      { status: 200 }
    );
  }

  try {
    const validUploadResults = uploadResults.filter(
      (result) => result !== null
    ) as imagesData[];

    const CreatePost = await prisma.post.create({
      data: {
        title,
        author_id: +author_id,

        addressId: activeLocation || null,
        post_image: {
          createMany: {
            data: [...validUploadResults],
          },
        },
      },
      include: {
        post_image: true,
        Interactions: {
          select: {
            reaction: true,
          },
        },
      },
    });

    if (mentions) {
      await prisma.interaction.createMany({
        data: mentions.map((m) => {
          return {
            author_id: m.userId,
            postId: CreatePost.id,
            type: "MENTION_POST",
          };
        }),
      });
      mentions.forEach(async (m) => {
        if (m.id !== author_id) {
          await prisma.interaction.create({
            data: {
              author_id: m.userId,
              postId: CreatePost.id,
              type: "MENTION_POST",

              Mention: {
                create: {
                  userId: +m.userId,
                  postId: CreatePost.id,
                  endPos: m.endIndex,
                  startPos: m.startIndex,
                  mentionType: "POST",
                  notifcation: {
                    create: {
                      notifierId: +author_id,
                      notifyingId: +m.userId,
                      postId: CreatePost.id,
                      type: "MENTION_POST",
                    },
                  },
                },
              },
            },
          });
        }
      });
    }

    return NextResponse.json({ CreatePost }, { status: 200 });
  } catch (error: any) {
    if (error instanceof PrismaClientRustPanicError) {
      console.error(`Prisma error: ${error.message}`);
      return NextResponse.json(
        { error: `Prisma error: ${error.message}` },
        { status: 500 }
      );
    } else {
      console.error(`Unknown error: ${error.message}`);
      return NextResponse.json(
        { error: `Unknown error: ${error.message}` },
        { status: 500 }
      );
    }
  }
};

// notifierId is the person or entity initiating the notification,
//  likely by mentioning someone else in a post.
//   The notifyingId is the person who will be notified about this mention or action.
