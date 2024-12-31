import { ShapeOfreactionsComments } from "@/app/api/comment/get-reactions/route";
import { shapeGetRpelayLikeRes } from "@/app/api/comment/get-replies-like/route";
import { shapeOfNestedReplayArg, shapeOfNestedReplayRes } from "@/app/api/comment/nested-replay/route";
import { shapeOfReplies } from "@/app/api/comment/replay/route";
import { FixedComment } from "@/app/api/comment/route";
import {
  ShapOfArgsToggleReactionComments,
  ShapOfResToggleReactionComments,
} from "@/app/api/comment/toggle-reaction/route";
import {
  ShapOfArgsToggleReplayLikes,
  ShapOfResToggleReplayLikes,
} from "@/app/api/comment/toggle-replay-reatction/route";
import { Comment, reactionsComment, replay, replayLikes } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const commentApi = createApi({
  reducerPath: "comment",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
  tagTypes: ["comment", "reaction-Comment"],
  endpoints: (builder) => ({
    getComment: builder.query<
    FixedComment[],
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
      { content: string; post_id: number; author_id: number ; parsedData : string}
    >({
      query: ({
        parsedData,
        content,
        post_id,
        author_id,
        
      }: {
        parsedData:string,
        post_id: number;
        author_id?: number;
        content?: string;
      }) => ({
        url: "/comment/add-comment",
        method: "POST",
        body: {parsedData , content, post_id, author_id },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const res = data as FixedComment
          dispatch(
            commentApi.util.updateQueryData(
              "getComment",
              { post_id: arg?.post_id, comment_skip: 0, comment_take: 4 }, // Provide default values

              (draft) => {
                draft.push(res); // Add the new comment to the existing list
              }
            )
          );
        } catch (error) {
          console.error("Failed to add comment:", error);
        }
      },
    }),

    getReplies: builder.query< { hasMore: boolean; replay: shapeOfReplies[] },{ comment_id: number; replaySkip: number; replayTake: number  }>({
      query: ({ comment_id, replaySkip, replayTake }) =>
        `/comment/replay?comment_id=${comment_id}&replaySkip=${replaySkip}&replayTake=${replayTake}`,
      providesTags: (result, error, { comment_id }) => [
        { type: "comment", id: comment_id },
      ],
      serializeQueryArgs({ endpointName, queryArgs }) {
        return `${endpointName}-${queryArgs.comment_id}`;
      },
      
      transformResponse(response :shapeOfReplies[] , meta, arg) {
        return { replay: response, hasMore: response.length > 0 };
      },
      merge: (currentCache, newItems) => {
        currentCache.replay.push(...newItems.replay);
        currentCache.hasMore = newItems.hasMore;
      },
    }),

    addReplay: builder.mutation<
    shapeOfReplies,
      {
        parsedData: string ;
        comment_id: number;
        author_id: number;
        content: string;
        post_id: number;
      }
    >({
      query: ({ comment_id, author_id, content, post_id  ,parsedData }) => ({
        url: "/comment/add-replay",
        method: "POST",
        body: { comment_id, author_id, content, post_id  , parsedData},
      }),
      async onQueryStarted(arg , { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            commentApi.util.updateQueryData(
              "getReplies",
              { comment_id : arg.comment_id ,
                replaySkip : 0 , 
                replayTake : 0
               }, // Provide default values
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
      ShapeOfreactionsComments[],
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
      query({ author_id, comment_id, post_Id, emoji, imageUrl, names }) {
        return {
          url: "/comment/toggle-reaction",
          method: "POST",
          body: { author_id, comment_id, post_Id, emoji, imageUrl, names },
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const emoji  = data.emoji as ShapeOfreactionsComments
          if (!data.emoji) return;
          dispatch(
            commentApi.util.updateQueryData(
              "getReactionComments",
              {
                comment_id: arg.comment_id,
            
              },(draft) => {
                if (data.tag === "add") {
                  draft.push(emoji);
                } else if (data.tag === "updated") {
                  const index = draft.findIndex(
                    (emoji) => emoji.id === data.emoji.id
                  );
                  if (index !== -1) {
                    draft[index] = emoji;
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
    getRepliesLikes: builder.query<shapeGetRpelayLikeRes[], { replay_id: number }>({
      query: ({ replay_id }) =>
        `http://localhost:3000/api/comment/get-replies-like?replay_id=${replay_id}`,

      serializeQueryArgs({ endpointName, queryArgs }) {
        return `${endpointName}-${queryArgs.replay_id}`;
      },
    }),
    toggleReplayLikes: builder.mutation<
      ShapOfResToggleReplayLikes,
      ShapOfArgsToggleReplayLikes
    >({
      query({ author_id, post_Id, replay_id }) {
        return {
          url: "http://localhost:3000/api/comment/toggle-replay-reatction",
          body: { author_id, post_Id, replay_id },
          method: "POST",
        };
      },

      async onQueryStarted(arg, {dispatch , queryFulfilled}) {
        const res = (await queryFulfilled).data 
        try {
          dispatch(
            commentApi.util.updateQueryData("getRepliesLikes",{
              replay_id :arg.replay_id
            } ,(draft)=>{
              
              if(res.tag === "add")
              {
                draft.push(res.replay)
              }
              if(res.tag === "delete"){
                const index = draft.findIndex(d=>d.id === res.replay.id)
                if(index !== -1 ){
                  draft.splice(index ,1 )
                } 
              }


            })
          )
        } catch (error) {
            console.log(error);
        }
      },
    }),
    getNEstedReplies : builder.query<    
    
    { hasMore: boolean; replay: shapeOfReplies[] },
     {skip :number ;
      take : number
      parent_Id : number ;}>({
      query: ({
        skip ,
        parent_Id ,
        take
      }) => `http://localhost:3000/api/comment/getNestedReplies/?parent_Id=${parent_Id}&skip=${skip}&take=${take}`,

      serializeQueryArgs({endpointName ,  queryArgs}){
        return `${endpointName}-${queryArgs.parent_Id}`;
 
      },
      
      transformResponse(response : shapeOfReplies[], meta, arg) {
        return { replay: response, hasMore: response.length > 0 };
      },
      merge: (currentCache, newItems) => {
        currentCache.replay.push(...newItems.replay);
        currentCache.hasMore = newItems.hasMore;
      },


    }),
    addNestedReplay: builder.mutation<shapeOfReplies, shapeOfNestedReplayArg>({
      query({ author_id, comment_id, post_id, content, replayid  , parsedData}) {
        return {
          url: "/comment/nested-replay",
          method: "POST",
          body: { author_id, comment_id, post_id, content, replayid ,  parsedData },
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = (await queryFulfilled).data;
          
          dispatch(
            commentApi.util.updateQueryData(
              "getNEstedReplies",
              {
                parent_Id: arg.replayid,
                skip: 0,
                take: 4,

              },
              (draft) => {
                // Find the parent replay by ID
                draft.replay.unshift(res )
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
  useAddNestedReplayMutation,
  useGetNEstedRepliesQuery ,
  useToggleReplayLikesMutation ,
  useGetRepliesLikesQuery, 
  useGetCommentQuery,
  useAddReplayMutation,
  useGetRepliesQuery,
  useAddCommentMutation,
  useToggleEmojiCommentsMutation,
  useGetReactionCommentsQuery,
} = commentApi;
