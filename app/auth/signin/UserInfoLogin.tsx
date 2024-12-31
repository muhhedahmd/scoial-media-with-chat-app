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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

interface ProfileInfoProps {
  trigger: () => Promise<boolean>;
  UserValues: () => {
    email: string;
    password: string;
    user_name: string;
  } | any | undefined;
}

const getUserSchema = (logWithEmail: boolean) =>
  z.object({
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    user_name: logWithEmail
      ? z.string().optional()
      : z.string().min(1, { message: "Username is required" }),
    email: logWithEmail
      ? z.string().email("Invalid email address").min(1, { message: "Email is required" })
      : z.string().optional(),
  }).refine((data) => data.user_name || data.email, {
    message: "At least one of username or email is required",
  });

const UserInfoLogin = forwardRef<ProfileInfoProps, {}>((_, ref) => {
  const [logWith, setLogWith] = useState<"email" | "username">("email");

  const userSchema = getUserSchema(logWith === "email");

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

  const handleTabChange = (value: string) => {
    setLogWith(value as "email" | "username");
    formUser.reset();
  };

  return (
    <Card className="w-full bg-white  border-none max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          <div className="bg-white">

              <div className="flex justify-start items-center gap-3 ">
                <Image src="/logo.svg" width={20} height={20} alt="logo" className="h-5 w-auto" />
                <h2 className="text-3xl font-extrabold text-[#554A4B]">Sign in</h2>
              </div>
          </div>

              
              </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...formUser}>
          <form onSubmit={formUser.handleSubmit(() => {})} className="space-y-6">
            <Tabs value={logWith} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="username">Username</TabsTrigger>
              </TabsList>
              <TabsContent value="email">
                <FormField
                  name="email"
                  control={formUser.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="username">
                <FormField
                  name="user_name"
                  control={formUser.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <FormField
              name="password"
              control={formUser.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </form>
        </Form>
      </CardContent>
    </Card>
  );
});

UserInfoLogin.displayName = "UserInfoLogin";

export default UserInfoLogin;

