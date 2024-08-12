"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ProfileSchema } from "./schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

interface UserInfoProps {
  trigger: () => Promise<boolean>
  ProfileValues: () => {
    bio: string;
    profile_picture: null;
    cover_picture: null;
    location: string;
    website: string;
    birthdate: Date;
}

}

const UserInfo = forwardRef<UserInfoProps, {}>((_, ref) => {
  const formUser = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      bio : "",
      birthdate: new Date(), 
      location : "" , 
      website: "",
    },
  });

  useImperativeHandle(ref, () => ({

    trigger: () => formUser.trigger(),
    ProfileValues: () => formUser.getValues(),


  }));


  return (
    <Form {...formUser}>
      <form
        className="flex flex-col md:w-[58%] w-[100%] justify-center gap-[5rem] items-start"
        onSubmit={formUser.handleSubmit(async ()=>{await formUser.trigger()})}
      >
        <div className="flex justify-start w-full gap-[3rem] items-start">
          <div className="flex justify-start w-1/2 flex-col">
            <FormField
              name="bio"
              control={formUser.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Input placeholder="hello i am mohamed  " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>

            <FormField
              name="birthdate"
              control={formUser.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>birthdate</FormLabel>
                  <FormControl>
                  <Input
                type="date"
                
                // value={field.value ? new Date(field.value).toISOString().substring(0, 10) : ''}
                onChange={(e) => {
                  console.log(e.target.value ,
              new Date(e.target.value).toISOString().substring(0, 10) 

                  )
                  formUser.setValue("birthdate" , new Date(e.target.value))
                  // return field.onChange(e.target.value)
                
                }}

              />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>

            <FormField
              name="location"
              control={formUser.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>location</FormLabel>
                  <FormControl>
                    <Input placeholder="Egypt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
          </div>
          <div className="flex justify-start w-1/2 flex-col">
       
            <FormField
              name="cover_picture"
              control={formUser.control}
              render={({ field }) => (
                <FormItem>
                <FormLabel>Cover picture</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      formUser.setValue('cover_picture', file);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              )}
            ></FormField>

            <FormField
              name="profile_picture"
              control={formUser.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile picture</FormLabel>
                  <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      formUser.setValue('profile_picture', file);
                    }}
                  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
        
          </div>
        
        
        </div>
              <div>
                <Button 
                type="submit"
                >
                  Save
                </Button>
              </div>

       
      </form>
    </Form>
  );
});

export default UserInfo;
UserInfo.displayName = "UserInfo";
