import {  User } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiUser = createApi({
  reducerPath: "users",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
  endpoints: (build) => ({
        getUser: build.query<User, any>({
      query: ({ userId }) => `/users/singleuser?userId=${userId}`,
    }),
   
  }),
});

// Export the generated hooks
export const {  useLazyGetUserQuery , useGetUserQuery} = apiUser;
