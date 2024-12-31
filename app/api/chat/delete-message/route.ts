import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/utils";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export const DELETE = async (req: Request) => {
  const url = new URL(req.url);
  const messageId = url.searchParams.get("messageId");
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];
  const userId = verifyToken(token)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!messageId) {
    return NextResponse.json(
      { error: "Message ID is required" },
      { status: 400 }
    );
  }
  try {
    const transaction = await prisma.$transaction(async (tx) => {
      const messageFiles = await tx.message.findUnique({
        where: {
          id: +messageId,
        },
        select: {
          messageMedia: true,
        },
      });

      if (messageFiles) {
        try {
          const arrayOfKeys = messageFiles.messageMedia.map((file) => file.key);
          const arrayOfIds = messageFiles.messageMedia.map((file) => file.id);
          await utapi.deleteFiles(arrayOfKeys);
          await tx.messageMedia.deleteMany({
            where: {
              id: {
                in: arrayOfIds,
              },
            },
          });
        } catch (error) {
          console.error(error);
          return NextResponse.json(
            { message: "File upload failed", error: error },
            { status: 500 }
          );
        }
      }

      const delMessage = await tx.message.delete({
        where: {
          id: +messageId,
        },
      });
      return delMessage;
    });
    return NextResponse.json(
      { message: "Message deleted successfully", tx: transaction },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error deleting message", error: error },
      { status: 500 }
    );
  }
};
