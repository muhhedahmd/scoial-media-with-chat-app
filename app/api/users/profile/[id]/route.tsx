import prisma from "@/lib/prisma"
import { UserProfile } from "@/store/api/apiProfile"
import { ProfilePicture } from "@prisma/client"
import { JsonObject, JsonValue } from "@prisma/client/runtime/library"
import { NextResponse } from "next/server"






export const GET = async (_: any, { params }: { params: { id: string } }) => {
    console.log(params)

    const selectUser = await prisma.user.findFirst({
        where: {
            id: +params.id
        }
    })
    if (!!selectUser) {

        const findUserProfile  = await prisma.profile.findUnique({
            where: {
                user_id: +params.id
            },
            select: {
                isCompleteProfile: true,
                location_id : true ,
                user_id: true,
                id: true,
                birthdate: true,
                PhoneNumber: true,
                bio: true,
                created_at: true,
                updated_at: true,
                title: true,
                location: true,
                website: true,
                
                user: {
                    select: {
                        first_name: true,
                        last_name: true,
                        user_name: true,
                        email: true,
                        isPrivate: true,
                    }
                },
                profilePictures: true

            },



        })

        if (!!findUserProfile) {
            return NextResponse.json(findUserProfile, { status: 200 })
        }
        else {
            console.log("error")
            return NextResponse.json({ message: "Profile Not completed" }, { status: 400 })
        }

    }
    else {

        return NextResponse.json({ message: "This user is not exisit" }, { status: 400 })
    }

}