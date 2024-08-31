import { ProfileSchema } from "@/app/auth/signup/_comsponents/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import AutocompleteSingleValue from "./AutocompleteSinglValus";
import AutocompleteMultiValue from "./AutocompleteMultivalue";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";

import { useToast } from "@/components/ui/use-toast";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEditProfileMutation, useGetProfileQuery } from "@/store/api/apiProfile";

const MainInfo = () => {




  const Router = useRouter();
  const { toast } = useToast();
  const { data } = useSession();
  const user = data?.user as User;

  
  
  const   {
    data : profile , 
    isLoading :status,
    isSuccess  ,
    isError
  } = useGetProfileQuery({userId : user?.id})

  const  [EditProfile  , {
    isLoading : editStatus ,
    isSuccess : editSuccess ,
    isError : editError ,
    
  }]  = useEditProfileMutation()
  
  // if(!user.id) return
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      title: profile?.title || "",
      PhoneNumber: "",
      bio: profile?.bio || "",
      birthdate: profile?.birthdate || new Date(),
      cover_picture: null,
      location: profile?.location || "",
      profile_picture: null,
      website: profile?.website || {},
    },
  });



  useEffect(() => {
    let toastId;
    if (status ) {
      toastId = toast({
        title: "Updating Profile",
        description: "Please wait while we update your profile.",
        variant: "default",
      });
    }

    if (isSuccess) {
      form.setValue("title", profile?.title || "");
      form.setValue("PhoneNumber", profile?.PhoneNumber || "0");
      form.setValue("bio", profile?.bio || "");
      form.setValue("birthdate", profile?.birthdate || new Date());
      form.setValue("location", profile?.location || "");
      form.setValue("website", profile?.website || {});

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        variant: "default",
      });
    }

    if (isError) {
      toast({
        title: "Error",
        description:  "There was an error updating your profile.",
        variant: "destructive",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, toast]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (await form.trigger()) {
      const updatedProfile = form.getValues();
      const formData = new FormData();

      Object.keys(updatedProfile).forEach((k) => {
        let key = k as keyof typeof updatedProfile;

        if (
          typeof updatedProfile[key] === "object" &&
          k !== "cover_picture" &&
          k !== "birthdate" &&
          k !== "profile_picture"
        ) {
          formData.append(k, JSON.stringify(updatedProfile[key]));
        } else {
          formData.append(k, updatedProfile[key]);
        }
      });


        EditProfile({ userId: user.id, profileData: formData }).then(()=>{

          toast({
            title: "Profile Updated",
            description: "Your profile has been updated successfully.",
            variant: "success",
            
          })
          Router.push("/maintimeline")
          
        }
      ).catch((err)=>{
        toast({
          title: "Error",
          description:  "There was an error updating your profile.",
          variant: "destructive",
          
        }) })
        // Router.push("/maintimeline")
      
      // console.log(status);
    }
  };

  return (
    <div className=" flex justify-center items-center w-full h-full">
      <div className=" h-auto md:w-2/3 lg:w-1/2 lg:h-auto w-3/4 gap-4 p-6 rounded-md shadow-md bg-white flex flex-col justify-start items-start ">
        <p className="text-2xl ">
          Hello , {user?.first_name} {user?.last_name}
        </p>
        {/* <p className="text-destructive text-sm"></p> */}
        <Form
        
        {...form}>
          <form
            
            className=" flex-col w-full h-full flex justify-between items-start"
            onSubmit={(e) => onSubmit(e)}
          >
            <div className=" gap-4 flex w-full h-3/4 justify-between flex-col md:flex-row items-center">
              <div className="h-full  gap-3 w-full flex justify-between items-start flex-col">
                <FormField
                  name="bio"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>bio</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="hello there , iam mohamed"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  name="PhoneNumber"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="hello there , iam mohamed"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  name="birthdate"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Birthdate</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={
                            field.value
                              ? new Date(field.value).toISOString().slice(0, 10)
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(new Date(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="cover_picture"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>cover picture</FormLabel>
                      <FormControl>
                        <Input
                          className={cn(
                            field.value?.type.startsWith("image/") &&
                              field.value !== null
                              ? "border-2 border-emerald-300 text-emerald-300"
                              : "border-2 border-destructive text-destructive"
                          )}
                          type="file"
                          onChange={(e) =>
                            field.onChange(e.target.files?.[0] ?? null)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <div className="h-full gap-3 w-full flex justify-between items-start flex-col">
                <FormField
                  name="profile_picture"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Profile picture</FormLabel>
                      <FormControl>
                        <Input
                          className={cn(
                            field.value?.type.startsWith("image/")
                              ? "border-2 border-emerald-300 text-emerald-300"
                              : "border-2 border-destructive text-destructive"
                          )}
                          type="file"
                          onChange={(e) =>
                            field.onChange(e.target.files?.[0] ?? null)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  name="title"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="ex:- font-end" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Websites</FormLabel>
                      <FormControl>
                        <Controller
                          name="website"
                          control={form.control}
                          render={({ field }) => (
                            <AutocompleteMultiValue
                              control={form.control}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Controller
                          name="location"
                          control={form.control}
                          render={({ field }) => (
                            <AutocompleteSingleValue
                              control={form.control}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="p-2 flex justify-between items-start w-full">
              <Button
                disabled={editStatus }
                className="w-2/6"
                type="submit"
              >
                {editStatus  ? (
                  <LoaderCircle className="animate-spin w-4 h-4  " />
                ) : (
                  "submit"
                )}
              </Button>
              <Button
              disabled={editStatus}
                onClick={() => Router.push("/maintimeline")}
                variant={"ghost"}
                type="button"
              >
                {editStatus ? (
                  <LoaderCircle className="animate-spin w-4 h-4  " />
                ) : (
                  "skip"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default MainInfo;
