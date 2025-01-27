import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SERVER } from "@/constants/constants";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${SERVER}/dashboard/`,
        credentials: "include",
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    }),
    tagTypes: ["dashboard"],
    endpoints: (builder) => ({
        getAdminDashboardData: builder.query<any, void>({
            query: () => ({
                url: "admin",
                method: "GET",
            }),
            providesTags: ["dashboard"],
        }),
        getSellerDashboardData: builder.query<any, void>({
            query: () => ({
                url: "seller",
                method: "GET",
            }),
            providesTags: ["dashboard"],
        }),
    }),
});

export const {
    useGetAdminDashboardDataQuery,
    useGetSellerDashboardDataQuery,
} = dashboardApi;
