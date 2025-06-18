"use client"

import { Suspense, useRef, useState } from "react"
import { LoaderCircle, LucideStepBack, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { signIn, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import UserInfoLogin from "./UserInfoLogin"
import axios from "axios"

interface ResponseState {
  status?: number
  ok?: boolean
  errors?: string
}

const Signin = () => {
  const router = useRouter()
  const [response, setResponse] = useState<ResponseState>({})
  const [loading, setLoading] = useState<boolean>(false)

  const userInfoRef = useRef<{
    trigger: () => Promise<boolean>
    UserValues: () => Promise<any>
  } | null>(null)

  const SubmitCreationUser = async () => {
    setLoading(true)
    try {
      const userInfoResult = await userInfoRef.current?.trigger()
      if (userInfoResult) {
        const userValues = await userInfoRef.current?.UserValues()
        const res = await signIn("sigin", {
          redirect: false,
          ...userValues,
        }).then(async (res) => {
          setResponse({
            status: res?.status,
            ok: res?.ok,
            errors: res?.error && JSON.parse(res?.error).errors.message,
          })
          if (res?.ok && res?.status === 200) {
           

          }

          // console.log(res)
        }).finally(() => {

        })


      } else {
        throw new Error("Form validation failed")
      }
    } catch (error) {
      console.error("Error during form submission:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-screen min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-950">
      <Suspense
        fallback={
          <div className="flex items-center justify-center w-full">
            <LoaderCircle className="animate-spin h-8 w-8 text-emerald-600" />
          </div>
        }
      >
        <div className="flex-1 flex flex-col">
          <div className="p-4">
            <Link
              className="flex items-center text-emerald-700 hover:text-emerald-500 transition-colors dark:text-emerald-300 dark:hover:text-emerald-200"
              href="/"
            >
              <LucideStepBack className="h-4 w-4 mr-2" />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 bg-emerald-600 rounded-full flex items-center justify-center">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome Back</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Sign in to your account</p>
              </div>

              <div className="bg-white dark:bg-gray-800">
                {response.ok !== undefined && (
                  <div
                    className={cn(
                      "mb-4 p-4 rounded-lg text-center",
                      response.ok
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                    )}
                  >
                    {response.errors ? response.errors : "Signed in successfully"}
                  </div>
                )}
              </div>

              <UserInfoLogin ref={userInfoRef} />

              <div className="flex flex-col space-y-4">
                <Button
                  onClick={SubmitCreationUser}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-600"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <LoaderCircle className="animate-spin w-5 h-5 mr-2" /> : <Lock className="w-5 h-5 mr-2" />}
                  Sign in
                </Button>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Button
                      variant="link"
                      className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 p-0"
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Don{"'"} t have an account? </span>
                    <Button
                      onClick={() => router.push("/auth/signup")}
                      variant="link"
                      className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 p-0"
                    >
                      Register
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side decorative panel */}
        <div className="hidden lg:block w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-700 opacity-90"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12">
            <h1 className="text-4xl font-bold mb-6">Connect with your world</h1>
            <p className="text-xl max-w-md text-center mb-8">
              Share moments, discover new connections, and stay updated with your friends.
            </p>
            <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="font-medium mb-1">Share</h3>
                <p className="text-sm opacity-80">Post your moments</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="font-medium mb-1">Connect</h3>
                <p className="text-sm opacity-80">Find new friends</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="font-medium mb-1">Discover</h3>
                <p className="text-sm opacity-80">Explore content</p>
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  )
}

export default Signin
