"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "./authOptions"
import supabase from "./Supabase"
import prisma from "./prisma"
import { tree } from "next/dist/build/templates/app-page"


// Initialize Supabase client


// Send OTP using Supabase Auth

const getuser = async () => {

  const session = await getServerSession(authOptions)

  if (!session?.user) return null
  return await prisma.user.findUnique({
    where: {
      id: session?.user.id
    },
    select: {
      first_name : true ,
      last_name :true,
      id: true,
      email: true,
      profile: {
        select: {
          PhoneNumber: true
        }
      }
    }
  })
}



export async function sendVerificationCode(method: "email" | "phone") {

  try {
    // const session = await getServerSession(authOptions)

    // if (!session?.user || !user) {
    // }
const user = await getuser()

    console.log(user)
    if (!user) {

      return { success: false, error: "Not authenticated" }
    }
    const userId = user.id as number
    const email = user.email as string

    // Get user profile for phone number
    const userProfile = await prisma.profile.findUnique({
      where: { user_id: userId },
      select: { PhoneNumber: true },
    })
    console.log({
      userProfile
    })

    const phoneNumber = userProfile?.PhoneNumber?.toString()

    if (method === "email" && email) {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          // channel :""

          shouldCreateUser: false, // Don't create user in Supabase
          data: {
            verification_type: "device_verification",
            user_id: userId.toString(),

          },
        },
      })

      if (error) {
        console.error("Supabase email OTP error:", error)
        return { success: false, error: "Failed to send email verification code" }
      }

      // Store verification session info in your database
      await prisma.session.updateMany({
        where: {
          userId: userId,
          expires: { gt: new Date() },
        },
        data: {
          verificationMethod: "email",
          verificationContact: email,
        },
      })

      return { success: true, message: "Verification code sent to your email" }
    } else if (method === "phone" && phoneNumber) {
      // Send SMS OTP using Supabase
      const { data, error } = await supabase.auth.signInWithOtp({




        // phone: phoneNumber,
        phone: phoneNumber,

        options: {
          channel: "sms",
          // shouldCreateUser: false, // Don't create user in Supabase
          data: {
            verification_type: "device_verification",
            main_user_id: userId.toString(),
            full_name: `${user.first_name} ${user.last_name}`.trim(),
          },
        },
      })
      console.log(data)

      if (error) {
        console.error("Supabase SMS OTP error:", error)
        return { success: false, error: "Failed to send SMS verification code" }
      }

      // Store verification session info in your database
      await prisma.session.updateMany({
        where: {
          userId: userId,
          expires: { gt: new Date() },
        },
        data: {
          verificationMethod: "phone",
          verificationContact: phoneNumber,
        },
      })

      return { success: true, message: "Verification code sent to your phone" }
    } else {
      return {
        success: false,
        error: `No ${method} ${method === "email" ? "address" : "number"} found`,
      }
    }
  } catch (error) {
    console.error("Error sending verification code:", error)
    return {
      success: false,
      error: "An error occurred while sending the verification code",
    }
  }
}

// Verify OTP using Supabase Auth
export async function verifyCode(code: string) {

  try {
    // const session = await getServerSession(authOptions)
    // const getuser = await prisma.user.findUnique({

    //   where: {
    //     id: session?.user.id
    //   },
    //   select: {
    //     email: true,
    //     profile: {
    //       select: {
    //         PhoneNumber: true
    //       }
    //     }
    //   }
    // })
const user = await getuser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    const userId = user.id as number

    // Get the verification method from your database
    const userSession = await prisma.session.findFirst({
      where: {
        userId: userId,
        expires: { gt: new Date() },
        verificationMethod: { not: null },
      },
      select: {
        id: true,
        verificationMethod: true,
        verificationContact: true,
      },
    })

    if (!userSession || !userSession.verificationMethod || !userSession.verificationContact) {
      return { success: false, error: "No verification session found. Please request a new code." }
    }

    // Verify OTP with Supabase
    let verifyResult
    if (userSession.verificationMethod === "email") {

      verifyResult = await supabase.auth.verifyOtp({
        options: {

        },
        email: user.email,
        token: code,
        type: "email",
      })
    } else if (userSession.verificationMethod === "phone") {
      verifyResult = await supabase.auth.verifyOtp({
        // phone: "userSession.verificationContact",
        phone: user.profile?.PhoneNumber as string || "",
        token: code,
        type: "sms",
      })
    } else {
      return { success: false, error: "Invalid verification method" }
    }

    if (verifyResult.error) {
      console.error("Supabase OTP verification error:", verifyResult.error)

      // Handle specific error types
      if (verifyResult.error.message.includes("expired")) {
        return { success: false, error: "Verification code has expired. Please request a new one." }
      } else if (verifyResult.error.message.includes("invalid")) {
        return { success: false, error: "Invalid verification code" }
      } else {
        return { success: false, error: "Verification failed. Please try again." }
      }
    }

    // Mark device as verified in your database
    await prisma.session.update({
      where: { id: userSession.id },
      data: {
        isDeviceVerfcation: true,
        verificationMethod: null,
        verificationContact: null,
      },
    })

    return {
      success: true,
      message: "Device verified successfully!",
      method: userSession.verificationMethod,
    }
  } catch (error) {
    console.error("Error verifying code:", error)
    return {
      success: false,
      error: "An error occurred during verification",
    }
  }
}

// Resend verification code
export async function resendVerificationCode() {

  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return { success: false, error: "Not authenticated" }
    }

    const userId = session.user.id as number

    // Get the last verification method used
    const userSession = await prisma.session.findFirst({
      where: {
        userId: userId,
        expires: { gt: new Date() },
      },
      select: {
        verificationMethod: true,
      },
    })

    const method = userSession?.verificationMethod as "email" | "phone" | null

    if (!method) {
      return { success: false, error: "No previous verification method found" }
    }

    return await sendVerificationCode(method)
  } catch (error) {
    console.error("Error resending verification code:", error)
    return {
      success: false,
      error: "An error occurred while resending the verification code",
    }
  }
}
