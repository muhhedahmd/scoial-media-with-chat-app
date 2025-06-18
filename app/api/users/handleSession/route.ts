import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { CustomSession, userWithProfile } from "@/Types";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose"





export const POST = async (request: NextRequest) => {

    try {
        // const session = (await getServerSession(authOptions)) as CustomSession;
        // const userId = session?.user?.id;
        // if (!session || !userId) {
        //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // }
        const { userId } = await request.json();

        // console.log({


        // })
        const findSession = await prisma.session.findFirst({
            where: {

                AND: [
                    {
                        userId: +userId
                    },
                    {
                        expires: {
                            gt: new Date()
                        }
                    },
                    {
                        ipAddress: request.ip || request.headers.get("x-forwarded-for") || "",
                    }
                ]
            },
            select: {
                createdAt: true,
                expires: true,
                id: true,
                // ipAddress: true,
                is2FACompleted: true,
                isDeviceVerfcation: true,
                // userAgent: true,
                // verificationContact: true,
                // verificationMethod: true,
            }

        })

        if (!!findSession) {
            // const token = cookies().get('next-auth.session-token')?.value as string
            // const secretKey = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
            // const tokenData = (await jose.jwtVerify(token, new TextEncoder().encode(process.env.NEXTAUTH_SECRET!))).payload as userWithProfile
            // const customTokenData = {
            //     ...tokenData,
            //     session: findSession
            // }
            // const newToken = await new jose.SignJWT(customTokenData)
            //     .setProtectedHeader({ alg: 'HS256' }) // Same algorithm as NextAuth
            //     .setIssuedAt() // Sets "iat" (issued at) claim
            //     .setExpirationTime('30d') // Match NextAuth's session expiry
            //     .sign(secretKey);

            // cookies().set({
            //     name: "next-auth.session-token",  // Different name from NextAuth's cookie
            //     value: newToken,
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === "production",
            //     sameSite: "lax",
            //     path: "/",
            //     expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days
            // });
            return NextResponse.json({ session: findSession }, { status: 200 });
        }

        else {
            // create session 
            const newSession = await prisma.session.create({
                data: {
                    userId: +userId,
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
                    userAgent: request.headers.get('user-agent') || "",
                    sessionToken: request.cookies.get('next-auth.session-token')?.value || "",
                    ipAddress: request.ip || request.headers.get("x-forwarded-for") || "",
                },
                select: {
                    createdAt: true,
                    expires: true,
                    id: true,
                    // ipAddress: true,
                    is2FACompleted: true,
                    isDeviceVerfcation: true,
                    // userAgent: true,
                    // verificationContact: true,
                    // verificationMethod: true,
                }
            });

            // const token = cookies().get('next-auth.session-token')?.value as string
            // const secretKey = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);

            // const tokenData = (await jose.jwtVerify(token, new TextEncoder().encode(process.env.NEXTAUTH_SECRET!))).payload as userWithProfile
            // const customTokenData = {
            //     ...tokenData,
            //     session: newSession
            // }
            // const newToken = await new jose.SignJWT(customTokenData)
            //     .setProtectedHeader({ alg: 'HS256' }) // Same algorithm as NextAuth
            //     .setIssuedAt() // Sets "iat" (issued at) claim
            //     .setExpirationTime('30d') // Match NextAuth's session expiry
            //     .sign(secretKey);

            // cookies().set({
            //     name: "next-auth.session-token",  // Different name from NextAuth's cookie
            //     value: newToken,
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === "production",
            //     sameSite: "lax",
            //     path: "/",
            //     expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days
            // });
            return NextResponse.json({ session: newSession }, { status: 200 });
        }


    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });

    }


}