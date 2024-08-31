import {
  ShapOfArgsToggleReactionComments,
  ShapOfResToggleReactionComments,
} from "@/app/api/comment/toggle-reaction/route";
import { Comment, reactionsComment, replay } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const commentApi = createApi({
  reducerPath: "comment",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
  tagTypes: ["comment", "reaction-Comment"],
  endpoints: (builder) => ({
    getComment: builder.query<
      Comment[],
      { post_id: number; comment_skip: number; comment_take: number }
    >({
      query: ({ post_id, comment_skip, comment_take }) =>
        `/comment?post_id=${post_id}&comment_skip=${comment_skip}&comment_take=${comment_take}`,
      providesTags: (result, error, { post_id }) => [
        { type: "comment", id: post_id },
      ],
      serializeQueryArgs({ endpointName, queryArgs }) {
        return `${endpointName}-${queryArgs.post_id}`;
      },
      merge: (existingCache, newItems, { arg }) => {
        // Handle pagination merging
        return existingCache ? [...existingCache, ...newItems] : newItems;
      },
    }),

    addComment: builder.mutation<
      Comment,
      { content: string; post_id: number; author_id: number }
    >({
      query: ({
        content,
        post_id,
        author_id,
      }: {
        post_id: number;
        author_id?: number;
        content?: string;
      }) => ({
        url: "/comment/add-comment",
        method: "POST",
        body: { content, post_id, author_id },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            commentApi.util.updateQueryData(
              "getComment",
              { post_id: arg.post_id },
              (draft) => {
                draft.push(data); // Add the new comment to the existing list
              }
            )
          );
        } catch (error) {
          console.error("Failed to add comment:", error);
        }
      },
    }),

    getReplies: builder.query<
      { hasMore: boolean; replay: replay[] },
      { comment_id: number; replaySkip: number; replayTake: number }
    >({
      query: ({ comment_id, replaySkip, replayTake }) =>
        `/comment/replay?comment_id=${comment_id}&replaySkip=${replaySkip}&replayTake=${replayTake}`,
      providesTags: (result, error, { comment_id }) => [
        { type: "comment", id: comment_id },
      ],
      transformResponse(response: replay[], meta, arg) {
        return { replay: response, hasMore: response.length > 0 };
      },
      serializeQueryArgs({ endpointName, queryArgs }) {
        return `${endpointName}-${queryArgs.comment_id}`;
      },

      merge: (currentCache, newItems) => {
        currentCache.replay.push(...newItems.replay);
        currentCache.hasMore = newItems.hasMore;
      },
    }),

    addReplay: builder.mutation<
      replay,
      { comment_id: number; author_id: number; content: string }
    >({
      query: ({ comment_id, author_id, content }) => ({
        url: "/comment/add-replay",
        method: "POST",
        body: { comment_id, author_id, content },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            commentApi.util.updateQueryData(
              "getReplies",
              { comment_id: arg.comment_id },
              (draft) => {
                draft.replay.push(data); // Add the new reply to the existing list
              }
            )
          );
        } catch (error) {
          console.error("Failed to add reply:", error);
        }
      },
    }),
    getReactionComments: builder.query<
      reactionsComment[],
      { comment_id: number }
    >({
      query: ({ comment_id }) =>
        `/comment/get-reactions?comment_id=${comment_id}`,
      providesTags: (result, error, { comment_id }) => [
        { type: "reaction-Comment", id: comment_id },
      ],
      serializeQueryArgs({ endpointName, queryArgs }) {
        return `${endpointName}-${queryArgs.comment_id}`;
      },
    }),
    toggleEmojiComments: builder.mutation<
      ShapOfResToggleReactionComments,
      ShapOfArgsToggleReactionComments
    >({
      query({ author_id, comment_id, emoji, imageUrl, names }) {
        return {
          url: "/comment/toggle-reaction",
          method: "POST",
          body: { author_id, comment_id, emoji, imageUrl, names },
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            commentApi.util.updateQueryData(
              "getReactionComments",
              { comment_id: arg.comment_id },
              (draft) => {
                if (data.tag === "add") {
                  draft.push(data.emoji);
                } else if (data.tag === "updated") {
                  const index = draft.findIndex(
                    (emoji) => emoji.id === data.emoji.id
                  );
                  if (index !== -1) {
                    draft[index] = data.emoji;
                  }
                } else if (data.tag === "delete") {
                  const index = draft.findIndex(
                    (emoji) => emoji.id === data.emoji.id
                  );
                  if (index !== -1) {
                    draft.splice(index, 1);
                  }
                }
              }
            )
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useGetCommentQuery,
  useAddReplayMutation,
  useGetRepliesQuery,
  useAddCommentMutation,
  useToggleEmojiCommentsMutation ,
  useGetReactionCommentsQuery
} = commentApi;


