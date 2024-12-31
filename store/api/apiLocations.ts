import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define your API slice
export const addressApi = createApi({
  reducerPath: 'addressApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API! }),
  endpoints: (builder) => ({
    fetchLocations: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams(params).toString();
        return `/locations?${searchParams}`;
      },
    }),
  }),
});

// Export the hook for the `fetchLocations` query
export const { useFetchLocationsQuery } = addressApi;
