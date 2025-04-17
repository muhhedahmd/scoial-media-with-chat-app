import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import prisma from "@/lib/prisma";
import { encryptMessage, verifyToken } from "@/lib/utils";
import sharp from "sharp";
import { encode } from "blurhash";

import { GroupRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { CustomSession } from "../get-message/route";

const utapi = new UTApi();

async function generateBlurhash(buffer: Buffer): Promise<string> {
  const { data, info } = await sharp(buffer)
    .raw()
    .ensureAlpha()
    .resize(32, 32, { fit: "inside" })
    .toBuffer({ resolveWithObject: true });
  return encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);
}

export async function POST(req: NextRequest) {
  // const authHeader = req.headers.get("Authorization");
  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  // const token = authHeader.split(" ")[1];
  // const userId = verifyToken(token)?.id;

  const session = (await getServerSession(authOptions)) as CustomSession;
  const userId = session?.user?.id;

  if (!session || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // if (!session || !userId) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }


  const body = await req.formData();
  const files = body.getAll("files") as File[];
  const chatId = body.get("chatId") as string;
  const receiverId = body.get("receiverId") as string;
  const content = body.get("content") as string;

  if (!files.length && !content) {
    return NextResponse.json(
      { error: "File or content is required" },
      { status: 400 }
    );
  }

  try {
    const uploadResults = await Promise.all(

      files.map(async (file) => {
        const fileBuffer = await file.arrayBuffer();
        let width, height, blurhash, thumbnail;

        if (file.type.startsWith("image/")) {
          const image = sharp(Buffer.from(fileBuffer));
          const metadata = await image.metadata();
          width = metadata.width;
          height = metadata.height;
          blurhash = await generateBlurhash(Buffer.from(fileBuffer));
          thumbnail = await image
            .resize(200, 200, { fit: "inside" })
            .toBuffer();
        } else if (file.type === "application/pdf") {
          try {

            const thumbnailBlob = body.get(
              `${file.name}-Thumbnail-pdf`
            ) as File;

            const thumbnailBuffer = await thumbnailBlob.arrayBuffer();

            const BufferFile = Buffer.from(thumbnailBuffer);
            thumbnail = BufferFile;

            if (thumbnail) {
              const thumbnailMetadata = await sharp(thumbnail).metadata();
              width = thumbnailMetadata.width;
              height = thumbnailMetadata.height;
              blurhash = await generateBlurhash(thumbnail);
            } else {
              console.log("Failed to generate PDF thumbnail");
            }
          } catch (error) {
            console.error("Error processing PDF:", error);
          }
        } else if (file.type.startsWith("video/")) {
          try {
            const thumbnailVideo = body.get(
              `${file.name}-Thumbnail-video`
            ) as File;
            thumbnail = Buffer.from(await thumbnailVideo.arrayBuffer());
            console.log(thumbnail);
            if (thumbnail) {
              const thumbnailMetadata = await sharp(thumbnail).metadata();
              width = thumbnailMetadata.width;
              height = thumbnailMetadata.height;
              blurhash = await generateBlurhash(thumbnail);
            }
          } catch (error) {
            console.error("Error processing video:", error);
          }
        }
        const uploadResult = await utapi.uploadFiles(file);
        if (uploadResult.error) throw new Error("File upload failed");

        let thumbnailUrl = null;
        if (thumbnail) {
          const thumbnailUpload = await utapi.uploadFiles(
            new File([thumbnail], "thumbnail", { type: "image/png" })
          );
          if (!thumbnailUpload.error) {
            thumbnailUrl = thumbnailUpload.data.url;
          }
        }

        return {
          ...uploadResult.data,
          width,
          height,
          blurhash,
          thumbnailUrl: thumbnailUrl || "",
        };
      })
    );

    let chat: any = parseInt(chatId);

    if (!chatId) {

      if (!receiverId) {
        return NextResponse.json(
          {
            message:
              "Invalid request: receiverId is required when creating a new chat",
          },
          { status: 400 }
        );
      }
      const isExiting = await prisma.chat.findUnique({

        where: {
          creatorId_reciverId:{

            
            creatorId: +userId,
            reciverId: +receiverId,
          }

        },
      });
      if (isExiting) {

        chat = isExiting;
      } else {
        const newChatData = [

          { userId: +userId, role: "ADMIN" },
          { userId: +receiverId, role: "MEMBER" },
        ] as {
          userId: number;
          role: GroupRole;
        }[];

        chat = await prisma.chat.create({
          data: {
            type: "PRIVATE",
            creatorId: +userId,
            reciverId: +receiverId,
            members: {
              createMany: {
                data: newChatData,
              },
            },
          },
          include: {
            members: true,
          },
        });
      }
    } else {

      console.log({ chat, chatId });
      chat = await prisma.chat.findUnique({
        where: { id: +chatId },
        include: { members: true },
      });

      if (!chat) {
        chat = await prisma.chat.create({
          data: {
            type: "PRIVATE",
            creatorId: +userId,
            reciverId: +receiverId!,
          },
        });
      }
    }

    const { iv, encryptedContent } = encryptMessage(content);

    let LinksWithDomains: any= []
    const urlMatches = content.match(/https?:\/\/[^\s]+/g);
    if (urlMatches) {

      urlMatches.map((url) => {
        const match = url.match(/https?:\/\/([^\.]+)\./);
        LinksWithDomains.push({
          url: url,
          domain: match ? match[1] : "",
        });

        return match ? match[1] : null;
      });
    }
      const transaction = await prisma.$transaction(async (tx) => {
        const message = await tx.message.create({

          data: {
            chatId: chat.id,
            senderId: parseInt(userId),
            receiverId: parseInt(receiverId),
            content,
            status: "SENT",
            encryptedContent: encryptedContent,
            iv: iv,

            messageMedia: {
              create: uploadResults.map((result) => ({
                HashBlur: result.blurhash,
                key: result.key,
                mediaUrl: result.url,
                name: result.name,
                size: result.size,
                type: result.type,
                fileHash: result.fileHash,
                width: result?.width,
                height: result?.height,
                thumbnailUrl: result?.thumbnailUrl,
              })),
            },
          },
          include: {
            messageMedia: true,
          },
        });
        if (!!LinksWithDomains) {

          await tx.messageLinks.createMany({
            data: LinksWithDomains.map((link : any) => ({
              messageId: message.id,
              link: link.url ,
              domain: link.domain,
            })),
          });
        }

        return message;
      });

      return NextResponse.json(transaction, { status: 200 });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
