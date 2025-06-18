import { userWithProfile } from "@/Types";
import { Address, Gender, Profile, ProfilePicture, ProfilePictureType, Role } from "@prisma/client";
import { JsonObject, JsonValue } from "@prisma/client/runtime/library";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface UserProfile {

  id: number;
  user_id: number;
  location_id: null | number,

  // user_id: number;
  bio: string | null;
  location: Address | null;
  PhoneNumber: string | null;
  website: JsonValue;
  birthdate: Date | null;
  title: string | null;
  created_at: Date;
  updated_at: Date,
  profilePictures: ProfilePicture[] | undefined
  user: {
    first_name: string;
    last_name: string;
    user_name: string,
    email: string,
    isPrivate: boolean
  },

}
export const apiProfile = createApi({
  reducerPath: "profile",
  tagTypes: ["getProfile"],
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
  endpoints: (build) => ({
    getProfile: build.query<
      UserProfile,
      {
        userId: number;
      }
    >({
      query: ({ userId }) => `/users/profile/${userId}`,
      keepUnusedDataFor: 300, // keep cached data for 5 minutes
      providesTags(result, error, arg, meta) {
        return [{ type: 'getProfile', id: arg.userId }];
      },

    }),
    editProfile: build.mutation<userWithProfile, any>({
      query: ({
        userId,
        profileData,
      }: {
        userId: number;
        profileData: FormData;
      }) => ({
        url: `/users/UpdateProfile/${userId}`,
        method: "PUT",
        body: profileData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const res = data;

          dispatch(
            apiProfile.util.updateQueryData(
              "getProfile",
              {
                userId: arg.userId,
              },
              (draft) => {
                if (draft.id === res.profile?.id) {
                  return {
                    id: res?.profile?.id!,
                    user_id: res?.profile?.user_id!,
                    location_id: res?.profile?.location_id!,
                    // user_id: number;
                    bio: res?.profile?.bio!,
                    location: res?.profile?.location!,
                    PhoneNumber: res?.profile?.PhoneNumber!,
                    website: res?.profile?.website!,
                    birthdate: res?.profile?.birthdate!,
                    title: res?.profile?.title!,
                    created_at: res?.profile?.created_at!,
                    updated_at: res?.profile?.updated_at!,
                    profilePictures: res?.profile?.profilePictures!,
                    user: {
                      first_name: res.first_name,
                      last_name: res.last_name,
                      user_name: res.user_name,
                      email: res.email,
                      isPrivate: false  // hard coded
                    },

                  } as UserProfile;
                } else {


                }
              }
            )
          );
        } catch (error) {
          console.log(error);
          // dispatch(editProfileError(error));
        }
      },
    }),
    updateUserInfo: build.mutation<{
      first_name: string,
      last_name: string,
      user_name: string,
      email: string,
      gender: Gender,
      role: Role
}, FormData >({
      query: (FormData) => ({
        url: `/users/update`,
        method: "PUT",
        body: FormData,
      }),
    }),
    CompleteProfile: build.mutation<userWithProfile, FormData>({
      query: (FormData: FormData) => ({
        url: `/users/profile/complete`,
        method: "PUT",
        body: FormData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const res = data;

          // dispatch(
          //   apiProfile.util.updateQueryData(
          //     "getProfile",
          //     {
          //       userId: arg.userId,
          //     },
          //     (draft) => {
          //       if (draft.id === res.profile?.id) {
          //         return {
          //           id: res?.profile?.id!,
          //           user_id: res?.profile?.user_id!,
          //           location_id: res?.profile?.location_id!,
          //           // user_id: number;
          //           bio: res?.profile?.bio!,
          //           location: res?.profile?.location!,
          //           PhoneNumber: res?.profile?.PhoneNumber!,
          //           website: res?.profile?.website!,
          //           birthdate: res?.profile?.birthdate!,
          //           title: res?.profile?.title!,
          //           created_at: res?.profile?.created_at!,
          //           updated_at: res?.profile?.updated_at!,
          //           profilePictures: res?.profile?.profilePictures!,
          //           user: {
          //             first_name: res.first_name,
          //             last_name: res.last_name,
          //             user_name: res.user_name,
          //             email: res.email,
          //             isPrivate: false  // hard coded
          //           },

          //         } as UserProfile;
          //       } else {


          //       }
          //     }
          //   )
          // );
        } catch (error) {
          console.log(error);
          // dispatch(editProfileError(error));
        }
      },
    }),
  }),
});

// Export the generated hooks
export const { useGetProfileQuery,  
  useUpdateUserInfoMutation,
    useEditProfileMutation  ,
   useCompleteProfileMutation
  } = apiProfile;
