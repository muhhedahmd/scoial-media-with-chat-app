"use client";

import "swiper/css";
import UserInfo from "./_comsponents/UserInfo";
import "swiper/css";
import "swiper/css/effect-creative";
import {  useRef, useState } from "react";
import { LoaderCircle, LucideStepBack } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ResponseState {
  status?: number;
  ok?: boolean;
  errors?: string;
}

const SignUp = () => {
  const router = useRouter()
  const [response, setResponse] = useState<ResponseState>({});
  const [loading, setLoading] = useState<boolean>(false);
  const userInfoRef = useRef<{
    trigger: () => Promise<boolean>;
    UserValues: () => Promise<any>;
  } | null>(null);


  const SubmitCreationUser = async () => {
    setLoading(true);
    try {
      const userInfoResult = await userInfoRef.current?.trigger();

      if (userInfoResult) {
        const userValues = await userInfoRef.current?.UserValues();
        const res = await signIn("signup", {
          redirect: false,
          ...userValues,
        });

        setResponse({
          status: res?.status,
          ok: res?.ok,
          errors: res?.error && JSON.parse(res?.error).errors.message,
        });

        if (res?.ok && res?.status === 200) {
          // Handle successful sign-up
          setTimeout(() => {
            router.push("/profile"); // Redirect to profile
          }, 300);
        } else {
          console.log("Error response", res?.error);
        }
      } else {
        throw new Error("Form validation failed");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className="w-screen h-screen">
        <div className="h-10">
          <Link
            className="flex justify-start items-center text-gray-700"
            href={"/"}
          >
            <LucideStepBack className="h-4 w-4" />
            <p>Go Back</p>
          </Link>
        </div>

        <div
          className="flex w-full flex-col justify-start md:pl-5 lg:pl-16 md:pt-20 py-10 px-10 gap-3 items-start"
          style={{
            height: "calc(-2.5rem + 100vh)",
          }}
        >
          <div className="flex justify-start items-center gap-3">
            <Image src={"/vercel.svg"} width={50} height={50} alt="logo" />
            <p className="text-2xl">Register</p>
          </div>
          {response.ok !== undefined && (
            <div
              className={cn(
                "h-10 md:w-[58%] w-[100%] rounded-md flex justify-start items-center p-3",
                response.ok ? "bg-emerald-300" : "bg-destructive/15"
              )}
            >
              {response.errors ? response.errors : "Register successfully"}
            </div>
          )}
         
          <div className="w-full h-full">
            <UserInfo ref={userInfoRef} />

            <div className="flex flex-row md:w-[30%] pt-4 w-[100%] justify-center gap-[5rem] items-start">  
              <Button
                onClick={() => SubmitCreationUser()}
                className="w-full"
                type="submit"
                disabled={loading}
              >
                {loading ? <LoaderCircle 
                className="animate-spin w-4 h-4  "
                /> : "Next"}
              </Button>

              <Button variant={"outline"} className="w-full" type="button">
                Go to Login
              </Button>
            </div>
          </div>
        </div>

        <div className="fixed hidden md:block w-1/3 h-full right-0 top-0">
          <div className="h-full w-full bg-teal-500" />
        </div>
      </div>
    </>
  );
};

export default SignUp;
