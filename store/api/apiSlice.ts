import { reactionType } from "@/app/api/posts/reactions/route";
import { ReactionInfo } from "@/app/api/posts/ReactToggle/route";
import { shapeOfPostsRes } from "@/app/api/posts/route";
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
    getPosts: builder.query<
      {
        posts:  shapeOfPostsRes[]
        hasMore: boolean;
      },
      any
    >({
      query: ({ pgnum, pgsize }: { pgnum: number; pgsize: number }) =>
        `/posts?pgnum=${+pgnum}&pgsize=${+pgsize}`,
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newItems) => {
        currentCache.posts.push(...newItems.posts);
        currentCache.hasMore = newItems.hasMore;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      transformResponse(
        response :shapeOfPostsRes[],
        meta,
        arg
      ) {
        const hasMore = response.length !== 0;
        return { posts: response, hasMore };
      },
    }),

    getPostImages: builder.query<post_image[], number>({
      query: (id) => `/posts/post_image?PostId=${id}`,
    }),

    getPostComments: builder.query({
      query: (id: number) => `/posts/comments?PostId=${id}`,
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
              draft.posts.push(data);
            })
          );
        } catch (err) {
          console.log(err);
        }
      },
    }),

    getCommentsReplay: builder.query({
      query: (id: number) => `/posts/replay?commentId=${id}`,
    }),

    getProfilePost: builder.query<profilePostData, any>({
      query: ({ PostId, author_id }: { PostId: number; author_id: number }) =>
        `/posts/profilepost?PostId=${PostId}&author_id=${author_id}`,
    }),

    getPostReactions: builder.query<reactionType[], { post_id: number }>({
      query: ({ post_id }) => `/posts/reactions?PostId=${post_id}`,
      providesTags: (result, error, { post_id }) => [
        { type: "Reactions", id: post_id },
      ],
      serializeQueryArgs({ endpointName, queryArgs }) {
        const key = `${endpointName}-${queryArgs.post_id}`;
        console.log("Generated Cache Key:", key);

        return `${endpointName}-${queryArgs.post_id}`;
      },
    }),
    toggleReact: builder.mutation({
      query: (body: ReactionInfo & { postId: number }) => ({
        url: "/posts/ReactToggle",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const res = data as {
            react: {
              id: number;
              type: ReactionType;
              created_at: Date;
              updated_at: Date;
              innteractId: number;
              interactionShareId: number | null;
            };
            tag: string;
          };

          console.log(
            "Updating Cache for Key:",
            `getPostReactions-${arg.postId}`
          );

          dispatch(
            apiSlice.util.updateQueryData(
              "getPostReactions",
              { post_id: arg.postId },
              (draft) => {
                console.log(
                  "Draft content before update:",
                  JSON.stringify(draft, null, 2)
                );
                console.log("Before update:");
                if (res.tag === "add") {
                  draft?.push(res.react as reactionType);
                  console.log(
                    "Draft add content before update:",
                    JSON.stringify(draft, null, 2)
                  );
                }
                if (res.tag === "update") {
                  const index = draft?.findIndex(
                    (item) => item.id === res.react.id
                  );
                  if (index !== -1 && index !== undefined && draft) {
                    draft[index].type = res.react.type;
                  }
                }
                if (res.tag === "delete") {
                  const index = draft?.findIndex(
                    (item) => item.id === res.react.id
                  );
                  if (index !== -1 && index !== undefined) {
                    draft?.splice(index, 1);
                  }
                }
                console.log("Before update:", JSON.stringify(draft, null, 2));
              }
            )
          );
        } catch (err) {
          console.error("Error toggling reaction:", err);
        }
      },
    }),
    addShare : builder.mutation({
      query: (body  :{
        

          "content": string
          , "post_id": number ,
           "author_id": number
      
      }
      )=>{
        return        {
          url  : "/share/add-share",
          method :"POST",
          body  :body

        }
      },
       
      async onQueryStarted(arg,{dispatch , queryFulfilled} ) {
          
          const res  = (await queryFulfilled).data as shapeOfPostsRes
          try {
            
            dispatch(
              apiSlice.util.updateQueryData("getPosts" , undefined  , (draft)=>{
                if (draft) {
                draft.posts.unshift(res)
                }
              })
            )


          } catch (error) {
            throw error
          }




      },
    })
  }),
});

export const {
  useAddShareMutation,
  useGetProfilePostQuery,
  useGetCommentsReplayQuery,
  useGetPostsQuery,
  useAddPostMutation,
  useGetPostReactionsQuery,
  useGetPostCommentsQuery,
  useGetPostImagesQuery,
  useToggleReactMutation,
} = apiSlice;
