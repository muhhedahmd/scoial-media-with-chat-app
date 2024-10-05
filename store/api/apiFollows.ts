import { togglefollowInfer } from "@/app/api/follow/togglefollow/route";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface stateFollow {
  state: "follow" | "following" | "follow back";
  id: number;
}

export const followApi = createApi({
  reducerPath: "followApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
  tagTypes: ["Follow" , "get state"],
  endpoints: (builder) => ({
    getFollowing: builder.query({
      query: ({ userId }) => `/follow/following/${userId}`,
    }),
    getFollower: builder.query({
      query: ({ userId }) => `/follow/follower/${userId}`,
    }),
    getFollowingCount: builder.query({
      query: ({ userId }) => `/follow/following/${userId}/count`,
    }),
    getFollowercount: builder.query({
      query: ({ userId }) => `/follow/follower/${userId}/count`,
    }),
    toggleFollower: builder.mutation({
      invalidatesTags: ["get state"],
      query: (body: togglefollowInfer) => ({
        url: `/follow/togglefollow`,
        method: "POST",
        body: body,
      }),
 
    }),
    followState: builder.query<
      { state: "follow" | "following" | "follow back"; id: number },
      { main_user_id: number; author_user_id: number }
    >({
        providesTags:["get state"],
      query: ({ main_user_id, author_user_id }) =>
        `/follow/followstate/?main_user_id=${main_user_id}&author_user_id=${author_user_id}`,
    }),
  }),
});

export const { useToggleFollowerMutation, useFollowStateQuery  ,
  useGetFollowingCountQuery,
  useGetFollowercountQuery
  ,useGetFollowerQuery , useGetFollowingQuery} = followApi;
