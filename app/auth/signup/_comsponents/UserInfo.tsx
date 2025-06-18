"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { userSchema } from "./schema";
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
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProfileInfoProps {
  trigger: ()=> Promise<boolean>
  UserValues: () => {
    email: string;
    first_name: string;
    role: "user" | "admin" | "super_admin";
    password: string;
    last_name: string;
    user_name: string;
    gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
}|  any | undefined
}

const ProfileInfo = forwardRef<ProfileInfoProps, {}>((_, ref) => {
  const formUser = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      role: "user",
      password: "",
      gender: "MALE",
      user_name: "",
      confirm_password:""
    },
  });
  
  useImperativeHandle(ref, () => ({
    trigger: () =>  formUser.trigger(),
    UserValues: () => formUser.getValues(),
    
  }));

  

  return (
    <Form {...formUser}>
      <form
        className="flex flex-col  w-[100%] justify-center gap-[5rem] items-start"
        onSubmit={formUser.handleSubmit(()=>{})}
      >
        <div className="flex justify-start w-full flex-col md:flex-row gap-[3rem] items-start">
          <div className="flex justify-start md:w-1/2 w-full flex-col">
            <FormField
              name="first_name"
              control={formUser.control}
              render={({ field }) => (
                <FormItem
                
                className="w-full"
                >
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input placeholder="Juon" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>

     
            <FormField
              name="email"
              control={formUser.control}
              render={({ field }) => (
                <FormItem

className="w-full"

                
                >
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Jsck@example.com" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
              <FormField
                name="password"
                control={formUser.control}
                render={({ field }) => (
                  <FormItem
                  
                  className="w-full"
                  >
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="*********" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                name="confirm_password"
                control={formUser.control}
                render={({ field }) => (
                  <FormItem
                  
                  className="w-full"
                  >
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input placeholder="*********" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
          </div>
          <div className="flex justify-start md:w-1/2 w-full flex-col">
          <FormField
              name="last_name"
              control={formUser.control}
              render={({ field }) => (
                <FormItem
                
                className="w-full"
                >
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input placeholder="stevvd" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>

            <div className="flex items-start w-full  flex-col justify-start gap-3">
              <FormField
                name="gender"
                control={formUser.control}
                render={({ field }) => (
                  <FormItem
                  
                  className="w-full"
                  >
                    <FormLabel>Gender</FormLabel>
                    <Controller
                      control={formUser.control}
                      name="gender"
                      render={({ field }) => (
                        <Select   onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                            <SelectItem value="PREFER_NOT_TO_SAY">
                              {`PREFER NOT TO SAY`}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                name="role"
                control={formUser.control}
                render={({ field }) => (
                  <FormItem
                  
                  className="w-full"
                  >
                    <FormLabel>Role</FormLabel>
                    <Controller
                      control={formUser.control}
                      name="role"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="super_admin">Super admin</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
            <FormField
              name="user_name"
              control={formUser.control}
              render={({ field }) => (
                <FormItem
                
                className="w-full"
                >
                  <FormLabel>User Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jack_1a" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>

          </div>
        </div>

       
      </form>
    </Form>
  );
});

export default ProfileInfo;
ProfileInfo.displayName = "ProfileInfo";
