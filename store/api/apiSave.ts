import { shapeOfgetSaveRes } from "@/app/api/InterActions/save/get_saves_by_post_cate/route";
import { shapeOfPostsRes } from "@/app/api/posts/route";
import { Save, Save_catagory } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define types for query and mutation payloads
interface GetSaveCategoryArgs {
  author_id: number;
  skip: number;
  take: number;
}

interface GetSingleSaveDetailsArgs {
  save_id: number;
}

interface GetSavesByCategoryArgs {
  cateagory_name: string;
  skip: number;
  take: number;
  userId: number;
}

interface AddSaveCategoryArgs {
  name: string;
  author_id: number;
}
interface GetSingleSaveArgs {
  userId: number;
  post_id: number;
}

interface ToggleSaveArgs {
  postId: number;
  userId: number;
  cateagory: string;
}

export const apiSave = createApi({
  reducerPath: "saveApi",
  tagTypes: ["singlePost"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API!,
  }),
  endpoints(build) {
    return {
      getSingleSaveDetails: build.query<
        shapeOfPostsRes,
        GetSingleSaveDetailsArgs
      >({
        query: ({ save_id }) =>
          `/InterActions/save/get_single_save?save_id=${save_id}`,
      }),
      getSingleSaveByPost: build.query<shapeOfgetSaveRes, GetSingleSaveArgs>({
        query: ({ userId, post_id }) =>
          `/InterActions/save/get_saves_by_post_cate?userId=${userId}&post_id=${post_id}`,
        providesTags(result, error, arg) {
          return [{ type: "singlePost", id: `${arg.post_id}-${arg.userId}` }];
        },
        serializeQueryArgs: ({ endpointName, queryArgs }) => {
          return `${endpointName}-${queryArgs.post_id}-${queryArgs.userId}`;
        },
        transformResponse: (response: shapeOfgetSaveRes) => response,
        transformErrorResponse: (response, meta, arg) => {
       
          
          if (response.status === 404) {
            return { };
          } else if (response.status === 500) {
            return {  };
          } else {
            return { error: "Unknown error" };
          }
        },
        
      }),
      getSavesByCategory: build.query<Save, GetSavesByCategoryArgs>({
        query: ({ cateagory_name, skip, take, userId }) =>
          `/InterActions/save/get_Save_by_cate?cateagory_name=${cateagory_name}&skip=${skip}&take=${take}&userId=${userId}`,
      }),
      getSaveCategory: build.query<
        { catagries: Save_catagory[]; hasMore: boolean },
        GetSaveCategoryArgs
      >({
        query: ({ author_id, skip, take }) =>
          `/InterActions/save/get_saves_category?author_id=${author_id}&skip=${skip}&take=${take}`,
        serializeQueryArgs: ({ endpointName }) => endpointName,
        merge: (currentCache, newItems) => {
          currentCache.catagries.push(...newItems.catagries);
          currentCache.hasMore = newItems.hasMore;
        },

        transformResponse(response: Save_catagory[], meta, arg) {
          const hasMore = response.length !== 0;
          return { catagries: response, hasMore };
        },
      }),
      addSaveCategory: build.mutation<Save_catagory, AddSaveCategoryArgs>({
        query: ({ name, author_id }) => ({
          url: "/InterActions/save/add_save_category",
          method: "POST",
          body: { name, author_id },
        }),
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          const res = (await queryFulfilled).data as Save_catagory;
          try {
            dispatch(
              apiSave.util.updateQueryData(
                "getSaveCategory",
                {
                  author_id: arg.author_id,
                  skip: 0,
                  take: 10,
                },
                (draft) => {
                  if (draft) {
                    draft.catagries.push(res);
                  }
                }
              )
            );
          } catch (error) {
            console.log(error);
          }
        },
      }),
      toggleSave: build.mutation<
      { save: shapeOfgetSaveRes; tag: "add" | "delete" | "update" },
      ToggleSaveArgs
    >({
      query({ postId, userId, cateagory }) {
        return {
          url: "/InterActions/save/toggle_save",
          method: "POST",
          body: { postId, userId, cateagory },
        };
      },
      // invalidatesTags(result, error, arg, meta) {
      //   return [{ type: "singlePost", id: `${arg.postId}-${arg.userId}` }];

      // },
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          const res = data;
    
          const cacheKey = {
            post_id: arg.postId,
            userId: arg.userId,
          };

          if(res.tag === "add"){
            dispatch(
              apiSave.util.invalidateTags([{ type: "singlePost", id: `${arg.postId}-${arg.userId}` }])
            );
          }
    
          dispatch(
            apiSave.util.updateQueryData(
              "getSingleSaveByPost",
              cacheKey,
              (draft) => {
                if (!draft) {
                  return res.save;
                }
    
                if (res.tag === "delete") {
                  return null;
                }
    
                if (res.tag === "add" || res.tag === "update") {
                  Object.assign(draft, res.save);
                }
              }
            )
          );
        } catch (error) {

          console.error("Error during toggleSave:", error);
          // Optionally dispatch an error action to handle it in your UI or cache the error
        }
      },
      // No invalidation of tags
    }),
    
    
    };
  },
});

export const {
  useGetSaveCategoryQuery,
  useGetSavesByCategoryQuery,
  useGetSingleSaveDetailsQuery,
  useGetSingleSaveByPostQuery,
  useAddSaveCategoryMutation,
  useToggleSaveMutation,
} = apiSave;

// userId: arg.userId,
