import { ShapeOfUserSearchMention } from "@/app/api/users/mentions/route";
import { ShapeOFminmalUserType } from "@/app/api/users/singleuser/route";
import { User } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiUser = createApi({
  reducerPath: "users",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
  endpoints: (build) => ({
    getUser: build.query<ShapeOFminmalUserType, any>({
      query: ({ userId }) => `/users/singleuser?userId=${userId}`,
    }),
    

    getUserName: build.query<
      { data: ShapeOfUserSearchMention[]; hasMore: boolean },
      {
        size: number;
        take: number;
        userId: number;
        search: string;
      }
    >({
      query: ({ size, take, search, userId }) =>
        `/users/mentions?size=${size}&take=${take}&search=${search}&userId=${userId}`,
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newItems) => {
        currentCache.data.concat(...newItems.data);
        currentCache.hasMore = newItems.hasMore;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      transformResponse(response: ShapeOfUserSearchMention[], meta, arg) {
        const hasMore = response.length !== 0;
        return { data: response, hasMore };
      },
    }),
  }),
});

// Export the generated hooks
export const { useLazyGetUserQuery, useGetUserNameQuery, useGetUserQuery } =
  apiUser;
