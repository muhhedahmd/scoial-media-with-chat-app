"use client";

import { Suspense, useRef, useState } from "react";
import { LoaderCircle, LucideStepBack } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import UserInfoLogin from "./UserInfoLogin"

interface ResponseState {
  status?: number;
  ok?: boolean;
  errors?: string;
}


const Signin = () => {

  
  const router = useRouter();
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
        const res = await signIn("sigin", {
          redirect: false,
          ...userValues,
        });

        setResponse({
          status: res?.status,
          ok: res?.ok,
          errors: res?.error && JSON.parse(res?.error).errors.message,
        });

        if (res?.ok && res?.status === 200) {
          setTimeout(() => {
            router.push("/profilee");
          }, 300);
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
    <div className="flex w-screen min-h-screen main-gradient">
      <Suspense fallback={<>loading....</>}>

      <div className="flex-1 flex flex-col">
   
        <div className="p-4">
          <Link
            className="flex items-center text-[#554A4B] hover:text-[#FFD0A3] transition-colors"
            href="/"
          >
            <LucideStepBack className="h-4 w-4 mr-2" />
            <span>Go Back</span>
          </Link>
        </div>

        <div className="flex-1  flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-white p-4 rounded-lg shadow-lg">
            <div className="bg-white">
             
              {response.ok !== undefined && (
                <div
                  className={cn(
                    "mb-4 p-3 rounded-md text-center",
                    response.ok ? "bg-[#F9D6D3] text-[#554A4B]" : "bg-red-100 text-red-800"
                  )}
                >
                  {response.errors ? response.errors : "Signed in successfully"}
                </div>
              )}
            </div>

            <UserInfoLogin ref={userInfoRef} />

            <div className="flex flex-col space-y-3">
              <Button
                onClick={SubmitCreationUser}
              
                className="w-full
                bg-[#558b73] text-white"
                type="submit"
                disabled={loading}
              >
                {loading ? <LoaderCircle className="animate-spin w-5 h-5" /> : "Sign in"}
              </Button>

              <Button 
                onClick={() => router.push("/auth/signup")} 
                variant="outline" 
                className="w-full
                border-[##558b73] text-[#554A4B] hover:bg-[##558b73aa] hover:text-gray-700"
              >
                Register
              </Button>

              <Button 
                variant="link" 
                className="w-full text-[#554A4B] hover:text-[#35472e]"
              >
                Forgot password?
              </Button>
            </div>
          </div>
        </div>
      </div>
      </Suspense>


    </div>
  );
};

export default Signin;



// #F9D6D3

// #FFEAE4

// #FFD0A3

// #554A4B