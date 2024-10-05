import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"







export type ShapeOfUserSerchMention =   {
    user_name: string;
    profile: {
        profile_picture: string | null;
    } | null;
    id: number;
    first_name: string;
    last_name: string;
}


export const GET = async (req: Request) => {
    try {
        const url = new URL(req.url)
        const size = Number(url.searchParams.get("size")) || 0
        const take = Number(url.searchParams.get("take")) || 10
        const search = url.searchParams.get("search") ?? ""
        const userId = +url.searchParams.get("userId")!

        // const sortBy = url.searchParams.get("sortBy") ?? "user_name" // Default sorting by user_name
        // const sortOrder = url.searchParams.get("sortOrder") ?? "asc" // Default sorting order

        // Validate sorting parameters
        // const validSortFields = ["user_name", "createdAt"] // Add other fields as necessary
        // const isValidSortField = validSortFields.includes(sortBy)
        // const isValidSortOrder = ["asc", "desc"].includes(sortOrder)

        // if (!isValidSortField || !isValidSortOrder) {
        //     return NextResponse.json({ error: "Invalid sorting parameters" }, { status: 400 })
        // }

        const findUserNames = await prisma.user.findMany({
            where: {
                AND: [
                    { user_name: { contains: search, mode: 'insensitive' } },
                    { id: { not: userId } }
                ]
            },
            select: {
                id: true,
                user_name: true,
                first_name: true ,
                last_name: true ,
                profile: {
                    select: {
                        profile_picture: true,
                       
                    }
                }
            },
            skip: size * take,
            take: take,
            orderBy: [
                // {
                //     profile: {
                //         following: {
                //             _count: sortOrder === "asc" ? "asc" : "desc" // Primary sorting by followers count
                //         }
                //     }
                // },
                // {
                //     // [sortBy]: sortOrder // Secondary sorting by user_name or createdAt
                // }
            ]
        })

        return NextResponse.json(findUserNames, { status: 200 })
    } catch (error) {
        console.error("Error fetching users:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
