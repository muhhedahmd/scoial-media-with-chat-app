import { Share } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ShareApi = createApi({
    reducerPath: "share",
    baseQuery: fetchBaseQuery({
        baseUrl:  process.env.NEXT_PUBLIC_API!,
    }) ,
    endpoints : (build)=>({
        getShare: build.query<Share[], {shaterId :number}>({
            query: ({shaterId }) => `share/${shaterId}`
            })

        
    })
}) 