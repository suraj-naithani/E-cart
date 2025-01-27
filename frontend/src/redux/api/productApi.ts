import { SERVER } from "@/constants/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${SERVER}/product`,
        credentials: "include",
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    }),
    tagTypes: ["product"],

    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({
                url: "",
                method: "GET",
            }),
            providesTags: ["product"],
        }),

        getSingleProduct: builder.query({
            query: (id: string) => ({
                url: `${id}`,
                method: "GET",
            }),
            providesTags: ["product"],
        }),

        searchProduct: builder.query({
            query: (search: string) => ({
                url: `search?product=${search}`,
                method: "GET",
            }),
            providesTags: ["product"],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetSingleProductQuery,
    useSearchProductQuery,
} = productApi;
