"use client";

import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfileInfoProps {
  trigger: () => Promise<boolean>;
  UserValues: () => {
    email: string;
    password: string;
    user_name: string;
  }  | any  |undefined
}

const getUserSchema = (logWithEmail: boolean) =>
  z.object({
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    user_name: logWithEmail
      ? z.string().optional()
      : z.string().min(1, { message: 'Username is required' }),
    email: logWithEmail
      ? z.string().email('Invalid email address').min(1, { message: 'Email is required' })
      : z.string().optional(),
  }).refine((data) => data.user_name || data.email, {
    message: 'At least one of username or email is required',
  });

const UserInfoLogin = forwardRef<ProfileInfoProps, {}>((_, ref) => {
  const [LogWith, setLogWith] = useState(true);

  const userSchema = getUserSchema(LogWith);

  const formUser = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
      user_name: "",
    },
  });

  useImperativeHandle(ref, () => ({
    trigger: () => formUser.trigger(),
    UserValues: () => formUser?.getValues(),
  }));
  return (
    <Form {...formUser}>
      <form
        className="flex flex-col md:w-[58%] w-[100%] justify-center gap-[5rem] items-start"
        onSubmit={formUser.handleSubmit(() => {})}
      >
        <div className="flex justify-start w-full flex-col md:flex-row gap-[3rem] items-start">
          <div className="flex justify-start md:w-1/2 w-full flex-col">
            {LogWith ? (
              <FormField
                name="email"
                control={formUser.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className=" gap-3 flex items-start w-full justify-start">
                        <Input placeholder="Jsck@example.com" {...field} />
                        <Button type="button"  onClick={()=>{
                          formUser.setValue("user_name" , "")
                                   formUser.setValue("email" , "")
                          formUser.clearErrors()


                          setLogWith(!LogWith)}}>with user name</Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            ) : (
              <FormField
                name="user_name"
                control={formUser.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Name</FormLabel>
                    <FormControl>
                      <div className=" gap-3 flex items-start w-full justify-start">
                        <Input placeholder="Jack_1a" {...field} />
                        <Button type="button"  onClick={()=>{
                          formUser.setValue("email" , "")
                          formUser.setValue("user_name" , "")
                          formUser.clearErrors()
                          setLogWith(!LogWith)
                          }}>with Email</Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            )}
            <FormField
              name="password"
              control={formUser.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="*********" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
          </div>

        </div>
        <Button
        type="submit"
        >
          Test
        </Button>
      </form>
    </Form>
  );
});

export default UserInfoLogin;
UserInfoLogin.displayName = "UserInfoLogin";
