import prisma from "@/lib/prisma";
import { deleteCloudinaryAsset } from "@/utils";
import {  NextResponse } from "next/server";

export const DELETE = async (req: Request) => {
  const url = new URL(req.url);
  const userId = +url.searchParams.get("user-id")!;
  const postId = +url.searchParams.get("post-id")!;
  if (!userId || !postId)
    return NextResponse.json(
      {
        message: "in valid request",
      },
      {
        status: 400,
      }
    );

  try {
    const findPost = await prisma.post.findUnique({
      where: {
        id: postId,
        author_id: userId,
      },
      include: {
        post_image: true,
      },
    });
    if (findPost) {
      //
      // Call the returned inner function with the second argument
      const [...delImgs] = await Promise.all(
        findPost.post_image.map(async (img) => {
          const del = await deleteCloudinaryAsset(img.public_id);
          console.log(del);
          if (del.status === 200) {
            return {
              message: "all img has removed succesfully",
            }; // Returning something if the asset is deleted
          } else {
            return {
              message: " failed to delete img",
            };
          }
        })
      );
      const deletePost = await prisma.post.delete({
        where: {
          id: postId,
          author_id: userId,
        },
      });

      return NextResponse.json(
        deletePost , 
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          message: "Post not found",
        },
        {
          status: 404,
        }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: error,
      },
      {
        status: 500,
      }
    );
  }
};
