import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  console.log(searchParams);
  const pgNum = +(searchParams.get("pgnum") ?? 0);
  const pgSize = +(searchParams.get("pgsize") ?? 5);


  const posts = await prisma.post.findMany({

  
    orderBy: {
      created_at:"desc"
    },
    
    skip: pgNum * pgSize ,
    take :pgSize,

  });
  return NextResponse.json(
    posts,
    {
      status: 200,
    }
  );
};
