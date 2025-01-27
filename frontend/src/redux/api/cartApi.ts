import { SERVER } from "@/constants/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Product {
    productId: string;
    quantity?: number;
    price?: number;
    originalPrice?: number;
    shippingFee?: number;
    name?: string;
    category?: string;
    description?: string;
    image?: { url: string }[];
}

export const cartApi = createApi({
    reducerPath: "cartApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${SERVER}/cart/`,
        credentials: "include",
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    }),
    tagTypes: ["cart"],

    endpoints: (builder) => ({
        newCart: builder.mutation<void, Product>({
            query: (product) => ({
                url: "add-to-cart",
                method: "POST",
                body: product,
            }),
            invalidatesTags: ["cart"],
        }),

        getCart: builder.query<Product[], void>({
            query: () => ({
                url: "cart-product",
                method: "GET",
            }),
            providesTags: ["cart"],
        }),

        decreaseQuantity: builder.mutation<void, string>({
            query: (productId) => ({
                url: "decreaseQuantity",
                method: "POST",
                body: { productId },
            }),
            invalidatesTags: ["cart"],
        }),

        increaseQuantity: builder.mutation<void, string>({
            query: (productId) => ({
                url: "increaseQuantity",
                method: "POST",
                body: { productId },
            }),
            invalidatesTags: ["cart"],
        }),

        removeFromCart: builder.mutation<void, string>({
            query: (productId) => ({
                url: "remove-from-cart",
                method: "POST",
                body: { productId },
            }),
            invalidatesTags: ["cart"],
        }),
    }),
});

export const {
    useGetCartQuery,
    useNewCartMutation,
    useRemoveFromCartMutation,
    useDecreaseQuantityMutation,
    useIncreaseQuantityMutation,
} = cartApi;
