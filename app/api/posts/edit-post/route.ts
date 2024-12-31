import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  CloudinaryUploadResponse,
  deleteCloudinaryAsset,
  generateBlurhash,
  Upload_coludnairy,
} from "@/utils";
import { Prisma } from "@prisma/client";
import { shapeOfPostsRes } from "../route";

enum TypeLocationTag {
  Add = "add",
  Same = "same",
  Update = "update",
  Del = "del",
}

interface UpdatePostInput {
  postId: string;
  authorId: string;
  removedImages: { id: number; public_id: string }[];
  orderImages: { id: number; order: number }[];
  location: { id: number; tag: TypeLocationTag };
  title?: string;
}

interface ExtendedCloudinaryUploadResponse extends CloudinaryUploadResponse {
  HashBlur: string;
}

async function uploadImage(
  file: File,
  username: string
): Promise<ExtendedCloudinaryUploadResponse | null> {
  try {
    const data = await Upload_coludnairy(file, username);
    if ("secure_url" in data && typeof data.secure_url === "string") {
      const blurhash = await generateBlurhash(
        data.secure_url,
        data.width || 0,
        data.height || 0
      );
      return {
        ...data,
        HashBlur: blurhash,
      };
    }
    throw new Error("Invalid upload response");
  } catch (error) {
    console.error("Image upload failed:", error);
    return null;
  }
}

export async function PUT(req: Request) {
  const formData = await req.formData();
  const input: UpdatePostInput = {
    postId: formData.get("postId") as string,
    authorId: formData.get("authorId") as string,
    removedImages: JSON.parse(formData.get("removed_imgs") as string),
    orderImages: JSON.parse(formData.get("order_imgs") as string),
    location: JSON.parse(formData.get("location") as string),
    title: formData.get("title") as string,
  };

  if (!input.postId || !input.authorId) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const newImgsLen = parseInt(formData.get("new_imgs_len") as string, 10);
  const newImages: { file: File; order: number }[] = [];

  for (let i = 0; i < newImgsLen; i++) {
    const file = formData.get(`new_imgs-${i}`) as File;
    console.log({
      file: file.name,
    });
    const order = parseInt(formData.get(`order-new-imgs-${i}`) as string, 10);
    newImages.push({ file, order });
  }

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const post = await tx.post.findUnique({
          where: { id: +input.postId, author_id: +input.authorId },
        });

        if (!post) {
          throw new Error("Post not found");
          return;
        }

        // Update title if provided
        if (input.title) {
          await tx.post.update({
            where: { id: post.id },
            data: { title: input.title },
          });
        }

        // Update location
        if (input.location.tag !== TypeLocationTag.Same) {
          await tx.post.update({
            where: { id: post.id },
            data: {
              addressId:
                input.location.tag === TypeLocationTag.Del
                  ? null
                  : input.location.id,
            },
          });
        }

        // Update image order

        // Remove images
        await Promise.all(
          input.removedImages.map(async (img) => {
            await deleteCloudinaryAsset(img.public_id);
            await tx.post_image.delete({ where: { id: img.id } });
          })
        );

        // Upload and add new images
        const uploadedImages = await Promise.all(
          newImages.map(async (image) => {
            const uploadedImage = await uploadImage(
              image.file,
              "findUser.user_name"
            );
            if (uploadedImage) {
              return tx.post_image.create({
                data: {
                  post_id: +input.postId,
                  order: image.order,
                  img_path: uploadedImage.secure_url,
                  public_id: uploadedImage.public_id,
                  asset_id: uploadedImage.asset_id,
                  width: uploadedImage.width || 0,
                  height: uploadedImage.height || 0,
                  display_name: uploadedImage.display_name || "",
                  asset_folder: uploadedImage.asset_folder || "",
                  HashBlur: uploadedImage.HashBlur,
                  tags: uploadedImage.tags ? Prisma.JsonNull : Prisma.JsonNull,
                  type: uploadedImage.type || "",
                },
              });
            }
          })
        );
        return uploadedImages
      },

      {
        timeout: 10000,
      }
    );
    const updatedPost = await prisma.post.findUnique({
      where: {
        id: +input.postId,
      },
      include: {
        addrees: true,
        Share: true,
        parent: true,
        post_image: true,
      },
      
    });
    if (!updatedPost)
      return NextResponse.json(
        {
          message: "post not found",
        },
        { status: 400 }
      );

      const [...orderPromise] = await Promise.all(
        input.orderImages.map((img) =>
          prisma.post_image.update({
            where: { id: img.id },
            data: { order: img.order },
          })
        )
      );

const upcomingImages = result?.filter((img)=>img !== undefined) || []
    const formattedPost = {
      post_imgs: [...orderPromise , ...upcomingImages],
      address: updatedPost.addrees,
      id: updatedPost.id,
      title: updatedPost.title,
      author_id: updatedPost.author_id,
      created_at: updatedPost.created_at,
      updated_at: updatedPost.updated_at,
      parentId: updatedPost.parentId,
      published: updatedPost.parentId,
      shared: updatedPost.Share
        ? {
            id: updatedPost.Share?.id,
            content: updatedPost.Share.content,
            post_id: updatedPost.Share?.post_id,
            createdAt: updatedPost.Share?.createdAt,
            updatedAt: updatedPost.Share?.updatedAt,
            sharedBy_author_id: updatedPost.author_id,
          }
        : null,
      parent: updatedPost.parent && {
        mainParentId: updatedPost.parent.id,
        parent_author_id: updatedPost.parent.author_id,
        created_at: updatedPost.parent.created_at,
        updated_at: updatedPost.parent.updated_at,
        parentTitle: updatedPost.parent.title,
      },
    } as shapeOfPostsRes;

    return NextResponse.json(formattedPost, { status: 200 });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { message: "Error updating post" },
      { status: 500 }
    );
  }
}


