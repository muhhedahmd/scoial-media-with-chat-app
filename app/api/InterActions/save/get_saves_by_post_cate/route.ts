import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export type shapeOfgetSaveRes = {
  id: number;
  created_at: Date;
  updated_at: Date;
  InteractionId: number;
  save_catagoryId: number;
  Save_catagory: {
    name: string;
  };
} | null;

export const GET = async (req: Request) => {
  const url = new URL(req.url);

  const userId = +url.searchParams.get("userId")!;
  const post_id = +url.searchParams.get("post_id")!;

  if (!userId) {
    return NextResponse.json({ message: `invalid Request` }, { status: 400 });
  }
  try {
    const find_Interaction_save = await prisma.interaction.findUnique({
      where: {
        author_id_postId_type: {
          author_id: userId,
          postId: post_id,
          type: "SAVE",
        },
      },
      select: {
        save: {
          include: {
            Save_catagory: {
              select: {
                name: true,
              },
            },
          },
        },
      },

    });


    if (!find_Interaction_save)
      return NextResponse.json(
       {},
        { status: 404 }
      );

    return NextResponse.json(find_Interaction_save.save[0], {
      status: 200,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error : error , 
        message: "error fetch data",
      },
      {
        status: 500,
      }
    );
  }
};
