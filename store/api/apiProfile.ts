import { Profile } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


type  a = Profile &{  user: {
    first_name: string;
    last_name: string;
 
}}

export const apiProfile = createApi({
  reducerPath: "profile",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
  endpoints: (build) => ({
    getProfile: build.query<a, any>({
      query: ({ userId }) => `/users/profile/${userId}`,
    }),
    editProfile: build.mutation<Profile, any>({
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
          const res = data as Profile;
          dispatch(
            apiProfile.util.updateQueryData(
              "getProfile",
              undefined,
              (draft) => {
                if (draft.id === res.id) {
                  draft = res;
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
