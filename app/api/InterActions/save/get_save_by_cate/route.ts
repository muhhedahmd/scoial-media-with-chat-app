import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const cateagory_name = url.searchParams.get("cateagory_name")! as string;
  const userId = +url.searchParams.get("userId")!;
  const skip = +(url.searchParams.get("skip") ?? 0);
  const take = +(url.searchParams.get("take") ?? 10);

  console.log({
    cateagory_name,
    skip,
    take,
  });
  if (!cateagory_name || !userId) {
    return NextResponse.json({ message: `invalid Request` }, { status: 400 });
  }
  try {

    const find_saves = await prisma.save_catagory.findUnique({
      where: {
        author_id_name: {
          author_id: userId,
          name: cateagory_name,
        },
      },
      include: {
        save: {
          include:{
            Interaction:{
              select:{
                postId : true ,
                 author_id:true ,
              }
            }
          },
          skip: skip * take,
          take: take,
        },
      },
    });
    if (!find_saves)
      return NextResponse.json(
        { message: `Cateagory Not found` },
        { status: 404 }
      );



    return NextResponse.json(find_saves.save  , {
      status: 200,
    });
  } catch (error) {
    console.log(error);


    return NextResponse.json(
      {
        message: "error fetch data",
      },
      {
        status: 500,
      }
    );
  }
};
