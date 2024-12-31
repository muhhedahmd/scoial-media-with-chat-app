import { reactionType } from "@/app/api/posts/reactions/route";
import { ReactionInfo } from "@/app/api/posts/ReactToggle/route";
import { shapeOfPostsRes } from "@/app/api/posts/route";
import {
  post,
  post_image,
  ProfilePicture,
  Reaction,
  ReactionType,
} from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface profilePostData {
  user: {
    first_name: string;
    last_name: string;
    user_name: string;
    id: number;
  };
  profile_picture: string | null;
  profilePictures: ProfilePicture[];
  id: number;
}

export const apiSlice = createApi({
  reducerPath: "Posts",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
  tagTypes: ["Posts", "Reactions"],
  endpoints: (builder) => ({
    getPosts: builder.query<
      {
        posts: shapeOfPostsRes[];
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
      transformResponse(response: shapeOfPostsRes[], meta, arg) {
        const hasMore = response.length !== 0;
        return { posts: response, hasMore };
      },
    }),

    getPostImages: builder.query<post_image[], number>({
      query: (id) => `/posts/post_image?PostId=${id}`,

      serializeQueryArgs({ endpointName, queryArgs }) {
        const key = `${endpointName}-${queryArgs}`;
      
        return `${endpointName}-${queryArgs}`;
      },

      transformResponse(response: post_image[], meta, arg) {
        return response.sort((img) => img.order);
      },
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
              draft.posts.unshift(data);
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

    deletePost: builder.mutation<post, { userId: number; postId: number }>({
      query: ({ userId, postId }) => ({
        url: `/posts/delete-post?user-id=${userId}&post-id=${postId}`,
        method: "DELETE",
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const res = (await queryFulfilled).data;
          dispatch(
            apiSlice.util.updateQueryData("getPosts", undefined, (draft) => {
              const findIndex = draft.posts.findIndex((e) => e.id === res.id);
              if (findIndex !== -1) {
                draft.posts.splice(findIndex, 1);
              }
            })
          );
        } catch (error) {}
      },
    }),

    editPost: builder.mutation<shapeOfPostsRes, { formData: FormData }>({
      query: ({ formData }) => ({
        url: `/posts/edit-post`,
        method: "PUT",
        body: formData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const postId = arg.formData.get("postId") as string;

        console.log(
          `editing post with id: ${postId} and formData: ${JSON.stringify(
            arg.formData
          )}`,

          { commingData: (await queryFulfilled).data }
        );
        // Optimistically update getPosts cache
        const patchPostsResult = dispatch(
          apiSlice.util.updateQueryData("getPosts", undefined, (draft) => {
            const postIndex = draft.posts.findIndex(
              (post) => post.id === +postId
            );
            if (postIndex !== -1) {
              draft.posts[postIndex] = {
                ...draft.posts[postIndex],
                ...arg.formData,
              };
            }
          })
        );

        // Optimistically update getPostImages cache if post_imgs exist
        let patchImagesResult;
        if (arg.formData.get("post_imgs")) {
          patchImagesResult = dispatch(
            apiSlice.util.updateQueryData("getPostImages", +postId, (draft) => {
              const updatedImages = JSON.parse(
                arg.formData.get("post_imgs") as string
              );

              // Map existing draft by `order` for easy comparison
              const draftMap = new Map(draft.map((img) => [img.order, img]));

              // Clear draft, then selectively update it based on `updatedImages`
              draft.splice(
                0,
                draft.length,
                ...updatedImages.map((newImg : any) => {
                  const existingImg = draftMap.get(newImg.order);
                  return existingImg ? { ...existingImg, ...newImg } : newImg; // Update or add image
                })
              );

              // Ensure draft is sorted by `order` to maintain order consistency
              draft.sort((a, b) => a.order - b.order);
            })
          );
        }

        try {
          const { data } = await queryFulfilled;

          // Update getPosts cache with the actual response data
          dispatch(
            apiSlice.util.updateQueryData("getPosts", undefined, (draft) => {
              const postIndex = draft.posts.findIndex(
                (post) => post.id === data.id
              );
              if (postIndex !== -1) {
                draft.posts[postIndex] = data;
              }
            })
          );

          // Update getPostImages cache with the actual response data if post_imgs exist
          if (data.post_imgs) {
            console.log({
              dataImgs: data.post_imgs,
            });
            dispatch(
              apiSlice.util.updateQueryData(
                "getPostImages",
                +postId,
                (draft) => {
                  const updatedImages = data.post_imgs;

                  // Map existing draft by `order` for easy comparison
                  const draftMap = new Map(
                    draft.map((img) => [img.order, img])
                  );

                  if(updatedImages) 
                  draft.splice(
                    0,
                    draft.length,
                         ...updatedImages.map((newImg) => {
                      const existingImg = draftMap.get(newImg.order);
                      return existingImg
                        ? { ...existingImg, ...newImg }
                        : newImg; // Update or add image
                    })
                  );

                  // Ensure draft is sorted by `order` to maintain order consistency
                  draft.sort((a, b) => a.order - b.order);
                }
              )
            );
          }
        } catch (error) {
          console.error("Error updating post:", error);

          // Undo optimistic update for getPosts cache
          patchPostsResult.undo();

          // Undo optimistic update for getPostImages cache if patchImagesResult exists
          if (patchImagesResult) {
            patchImagesResult.undo();
          }
        }
      },
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
        return `${endpointName}-${queryArgs.post_id}`;
      },
    }),
    getPostsOfUser: builder.query<
    { hasMore: boolean; posts: shapeOfPostsRes[]; endReached: boolean },
    {
      userId: number;
      skip?: number;
      take?: number;
    }
  >({
    query: ({ userId, skip, take }) =>
      `/posts/single-user/?userId=${userId}&skip=${skip || 0}&take=${take || 10}`,
    serializeQueryArgs: ({ endpointName, queryArgs }) =>
      `${endpointName}-${queryArgs.userId}`,
    merge: (currentCache, newItems, { arg }) => {
      if (currentCache.endReached) {
        return currentCache;
      }
      return {
        posts: [...currentCache.posts, ...newItems.posts],
        hasMore: newItems.hasMore,
        endReached: !newItems.hasMore,
      };
    },
    forceRefetch({ currentArg, previousArg }) {
      return (
        currentArg?.skip !== previousArg?.skip ||
        currentArg?.take !== previousArg?.take
      );
    },
    transformResponse(response: shapeOfPostsRes[], meta, arg) {
      const hasMore = response.length >= (arg.take || 10);
      return { posts: response, hasMore, endReached: !hasMore };
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

          dispatch(
            apiSlice.util.updateQueryData(
              "getPostReactions",
              { post_id: arg.postId },
              (draft) => {
                if (res.tag === "add") {
                  draft?.push(res.react as reactionType);
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
              }
            )
          );
        } catch (err) {
          console.error("Error toggling reaction:", err);
        }
      },
    }),
    addShare: builder.mutation({
      query: (body: {
        content: string;
        post_id: number;
        author_id: number;
      }) => {
        return {
          url: "/share/add-share",
          method: "POST",
          body: body,
        };
      },

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const res = (await queryFulfilled).data as shapeOfPostsRes;
        try {
          dispatch(
            apiSlice.util.updateQueryData("getPosts", undefined, (draft) => {
              if (draft) {
                draft.posts.unshift(res);
              }
            })
          );
        } catch (error) {
          throw error;
        }
      },
    }),
    getSinglePost: builder.query<
      shapeOfPostsRes,
      {
        post_id: number;
      }
    >({
      query: ({ post_id }) => `/posts/single_post?post_id=${post_id}`,
    }),
  }),
});

export const {
  useEditPostMutation,
  useDeletePostMutation,
  useGetSinglePostQuery,
  useAddShareMutation,
  useGetProfilePostQuery,
  useGetCommentsReplayQuery,
  useGetPostsQuery,
  useAddPostMutation,
  useGetPostReactionsQuery,
  useGetPostCommentsQuery,
  useGetPostImagesQuery,
  useToggleReactMutation,
  useGetPostsOfUserQuery,
} = apiSlice;
