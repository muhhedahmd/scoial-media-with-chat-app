import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const url = new URL(req.url);

  const street = url.searchParams.get("street") || "";
  const city = url.searchParams.get("city") || "";
  const state = url.searchParams.get("state") || "";
  const zip = url.searchParams.get("zip") || "";
  const country = url.searchParams.get("country") || "";

  // If all search parameters are empty, return a 204 response
  if (!street && !city && !state && !zip && !country) {
    return NextResponse.json({ message: "No search parameters provided" }, {
      status: 204, // No Content
    });
  }

  try {
    // Dynamically build the `where` clause based on the non-empty parameters
    const whereClause: any = {};
    if (street) whereClause.street = { contains: street  ,
      mode:"insensitive",

    };
    if (city) whereClause.city = { contains: city  ,
      mode:"insensitive",

    };
    if (state) whereClause.state = { contains: state  ,
      mode:"insensitive",

    };
    if (zip) whereClause.zip = { contains: zip   ,

      mode:"insensitive",

    };
    if (country) whereClause.country = {  
      mode:"insensitive",
      contains: country
     };

    // Fetch locations based on the dynamic `where` clause
    const locations = await prisma.address.findMany({
      where: whereClause,
      take: 20,
    });

    return NextResponse.json(locations, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching locations", details: error },
      {
        status: 500,
      }
    );
  }
};
