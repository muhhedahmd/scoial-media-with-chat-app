import { post, post_image, Reaction, ReactionType } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
interface profilePostData {
  user: {
    first_name: string;
    last_name: string;
    user_name: string;
    id: number;
  };
  profile_picture: string | null;
}

export const apiSlice = createApi({
  reducerPath: "Posts",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
  tagTypes: ["Posts", "Reactions"],
  endpoints: (builder) => ({
    getPosts: builder.query<{ posts: post[]; hasMore: boolean }, any>({
      query: ({ pgnum, pgsize }: { pgnum: number; pgsize: number }) =>
        `/posts?pgnum=${+pgnum}&pgsize=${+pgsize}`,
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      // Always merge incoming data to the cache entry
      merge: (currentCache, newItems) => {
        currentCache.posts.push(...newItems.posts);
        currentCache.hasMore = newItems.hasMore; 
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg, state }) {
        return currentArg !== previousArg;
      },
      transformResponse(response: post[],meta , arg) {
        
        // let hasMore = response.length >= arg.pgsize || response.length !==  0 ;
        let hasMore = response.length !==  0 ;
        return { posts: response, hasMore: hasMore };
      },
    }),

    getPostImages: builder.query<post_image[], any>({
      query: (id: number) => `/posts/post_image?PostId=${+id}`,
    }),
    getPostReactions: builder.query<Reaction[], any>({
      providesTags: ["Reactions"],
      query: (id: number) => `/posts/reactions?PostId=${+id}`,
    }),
    getPostComments: builder.query({
      query: (id: number) => `/posts/comments?PostId=${+id}`,
    }),
    getCommentsReplay: builder.query({
      query: (id: number) => `/posts/replay?commentId=${+id}`,
    }),
    getProfilePost: builder.query<profilePostData, any>({
      query: ({ PostId, author_id }: { PostId: number; author_id: number }) =>
        `/posts/profilepost?PostId=${PostId}&author_id=${author_id}`,
    }),

    AddPost: builder.mutation({
      query: (formData: FormData) => ({
        url: `/posts/addpost`,
        method: "POST",
        body: formData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            apiSlice.util.updateQueryData("getPosts", undefined, (draft) => {
              draft.posts?.push(data);
            })
          );
        } catch (err) {
          console.log(err);
        }
      },
    }),
    toggleReact: builder.mutation({
      query: (body: reactionInfo) => ({
        url: "/posts/ReactToggle",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const res = data as Reaction;

          dispatch(
            apiSlice.util.updateQueryData(
              "getPostReactions",
              arg.postId,
              (draft) => {
                if (res.add) {
                  // If `add` is true, add the reaction
                  draft.push(res);
                } else if (res.updated) {
                  // If the reaction is updated, find the existing one and update its type
                  const indexToUpdate = draft.findIndex(
                    (reaction) => reaction.id === res.id
                  );
                  if (indexToUpdate !== -1) {
                    draft[indexToUpdate].type = res.type;
                  }
                } else {
                  // If `add` is false and `updated` is not true, remove the reaction
                  const indexToRemove = draft.findIndex(
                    (reaction) => reaction.id === res.id
                  );
                  if (indexToRemove !== -1) {
                    draft.splice(indexToRemove, 1);
                  }
                }
              }
            )
          );
        } catch (err) {
          console.error("Error toggling reaction:", err);
        }
      },
    }),
  }),
});

export const {
  useGetProfilePostQuery,
  useGetPostsQuery,
  useAddPostMutation,
  useGetPostReactionsQuery,
  useGetCommentsReplayQuery,
  useGetPostCommentsQuery,
  useGetPostImagesQuery,
  useToggleReactMutation,
} = apiSlice;
