"use client"

import "swiper/css"
import UserInfo from "./_comsponents/UserInfo"
import "swiper/css"
import "swiper/css/effect-creative"
import { Suspense, useRef, useState } from "react"
import { LoaderCircle, LucideStepBack, UserPlus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface ResponseState {
  status?: number
  ok?: boolean
  errors?: string
}

const SignUp = () => {
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
        const res = await signIn("signup", {
          redirect: false,
          ...userValues,
        })

        setResponse({
          status: res?.status,
          ok: res?.ok,
          errors: res?.error && JSON.parse(res?.error).errors.message,
        })

        if (res?.ok && res?.status === 200) {
          router.push("/profile") // Redirect to profile
        } else {
          console.log("Error response", res?.error)
        }
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-950">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <LoaderCircle className="animate-spin h-8 w-8 text-emerald-600" />
          </div>
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="py-6">
            <Link
              className="flex items-center text-emerald-700 hover:text-emerald-500 transition-colors dark:text-emerald-300 dark:hover:text-emerald-200"
              href="/"
            >
              <LucideStepBack className="h-4 w-4 mr-2" />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-8 pb-16">
            {/* Left side - Form */}
            <div className="w-full md:w-2/3 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
              <div className="flex items-center mb-8">
                <div className="h-12 w-12 bg-emerald-600 rounded-full flex items-center justify-center mr-4">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Create Your Account</h1>
                  <p className="text-gray-600 dark:text-gray-300">Join our community today</p>
                </div>
              </div>

              {response.ok !== undefined && (
                <div
                  className={cn(
                    "mb-6 p-4 rounded-lg",
                    response.ok
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                  )}
                >
                  {response.errors ? response.errors : "Registration successful! Redirecting..."}
                </div>
              )}

              <UserInfo ref={userInfoRef} />

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button
                  onClick={SubmitCreationUser}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-600"
                  disabled={loading}
                >
                  {loading ? <LoaderCircle className="animate-spin w-5 h-5 mr-2" /> : "Create Account"}
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-950"
                  onClick={() => router.push("/auth/signin")}
                >
                  Sign In Instead
                </Button>
              </div>
            </div>

            {/* Right side - Benefits */}
            <div className="hidden md:block w-1/3 bg-emerald-700 rounded-xl shadow-xl overflow-hidden">
              <div className="p-8 text-white h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Why Join Us?</h2>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-sm">✓</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Connect with friends</h3>
                        <p className="text-sm opacity-80">Stay in touch with the people who matter</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-sm">✓</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Share your moments</h3>
                        <p className="text-sm opacity-80">Post photos and updates about your life</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-sm">✓</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Discover new content</h3>
                        <p className="text-sm opacity-80">Find interesting posts from people around the world</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-8 border-t border-white/20">
                  <p className="text-sm opacity-80">
                    Already have an account?{" "}
                    <Link href="/auth/signin" className="underline font-medium">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  )
}

export default SignUp
