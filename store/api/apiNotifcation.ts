import { Notification } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const NotifcationApi = createApi({
  reducerPath: "Notifcation",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
  endpoints(build) {
    return {

      getNotifcation: build.query<
        Notification[],
        {
          userId: number;
          skip: number;
          take: number;
        }
      >({
        query: ({ userId, skip, take }) =>
          `/notifications/?user_id=${userId}&skip=${skip}&take=${take}`,
      }),
    };
  },
});

export const {useGetNotifcationQuery  } =
  NotifcationApi;
