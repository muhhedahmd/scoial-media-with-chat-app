import { Profile, ProfilePicture, ProfilePictureType } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface UserProfile {
  id: number;
  user_id: number;
  bio: string;
  birthdate: Date;
  cover_picture: string;
  location: string;
  phoneNumber: number;
  profile_picture: string;
  website: JsonObject;
  title: string;
  isCompleteProfile: boolean;
  created_at:        Date ,
  updated_at :      Date,
  user: {
    first_name: string;
    last_name: string;
    user_name: string,
    email  :string ,
    isPrivate :boolean 
  };
  profilePictures: {
    id: number;
    profileId: number;
    type: ProfilePictureType;
    format: string;
    public_url: string;
    public_id: string;
    display_name: string;
    asset_folder: string;
    secure_url: string;
    tags: string[];
    asset_id: string;
    height: number;
    width: number;
    url: string;
    HashBlur: string;
  }[];
}
export const apiProfile = createApi({
  reducerPath: "profile",
  tagTypes:["getProfile"] ,
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
    editProfile: build.mutation<UserProfile, any>({
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
          const res = data as UserProfile;
          dispatch(
            apiProfile.util.updateQueryData(
              "getProfile",
              {
                userId: arg.userId,
              },
              (draft) => {
                if (draft.id === res.id) {
                  return res;
                } else {
                  return draft;
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
  }),
});

// Export the generated hooks
export const { useGetProfileQuery, useEditProfileMutation } = apiProfile;
