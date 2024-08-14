"use client";

import {
  fetchProfile,
  selectProfile,
  selectProfileError,
  selectProfileStatus,
} from "@/store/Reducers/ProfileSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CoverImageLoader, ProfileImageLoader } from "./Loader";
import Image from "next/image";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { AppDispatch } from "@/store/store";

const UserInfo = () => {
  const { toast } = useToast();
  const profile = useSelector(selectProfile);
  const { data } = useSession();
  const user = data?.user as User;
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(selectProfileStatus);
  const error = useSelector(selectProfileError);
  const isLoading = status === "loading" || status === "idle" || status === null;


  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfile(+user?.id)); // Fetch profile on component mount
    }
  }, [dispatch, user?.id, profile]);

  useEffect(() => {
    let toastId;
    if (status === "loading") {
      toastId = toast({
        title: "Loading Profile",
        description: "Please wait while we load your profile.",
        variant: "default",
      });
    } else if (status === "succeeded") {
      toast({
        title: "Profile Loaded",
        description: "Your profile has been loaded successfully.",
        variant: "default",
      });
    } else if (status === "failed") {
      toast({
        title: "Error",
        description: error || "There was an error loading your profile.",
        variant: "destructive",
      });
    }
  }, [status, error, toast]);

  return (
    <div className="relative bg-white rounded-lg h-3/4 border-2 shadow-md w-1/3">
      {isLoading ? (
        <CoverImageLoader />
      ) : (
        <Image
          height={50}
          width={50}
          src={profile?.cover_picture || ""}
          objectFit="cover"
          alt="cover picture"
          sizes="cover"
          className="h-28 rounded-lg object-cover bg-slate-950 w-full"
        />
      )}

      {isLoading ? (
        <ProfileImageLoader />
      ) : (
        <Image
          height={50}
          width={50}
          src={profile?.profile_picture || ""}
          objectFit="cover"
          alt="profile picture"
          sizes="cover"
          className="rounded-full p-1 object-cover absolute top-[19%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-white w-20 h-20"
        />
      )}
    </div>
  );
};

export default UserInfo;
