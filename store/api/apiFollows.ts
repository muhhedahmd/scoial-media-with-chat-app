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
      query: ({ profile_id }) => `/follow/following/${profile_id}`,
    }),
    getFollower: builder.query({
      query: ({ profile_id }) => `/follow/follower/${profile_id}`,
    }),
    toggleFollower: builder.mutation({
      invalidatesTags: ["get state"],
      query: (body: togglefollowInfer) => ({
        url: `/follow/togglefollow`,
        method: "POST",
        body: body,
      }),
    //   async onQueryStarted(arg, { dispatch, queryFulfilled }) {
    //     try {
    //       const { data } = await queryFulfilled;
    //       const res = data as stateFollow;

    //       // Update the followState cache
    //       dispatch(
    //         followApi.util.updateQueryData(
    //           "followState",
    //           {
    //             main_user_id: arg.main_user_id,
    //             author_user_id: arg.author_user_id,
    //           },
    //           (draft) => {
    //             console.log(draft, res);
    //             if (draft.id === res.id) {
    //               draft.state = res.state; // Update the state based on the response
    //             }
    //           }
    //         )
    //       );
    //     } catch (error) {
    //       console.error("Error updating follow state:", error);
    //     }
    //   },
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

export const { useToggleFollowerMutation, useFollowStateQuery } = followApi;
