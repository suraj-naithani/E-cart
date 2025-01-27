import { SERVER } from "@/constants/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Review {
    id?: string;
    content: string;
    rating: number;
}

interface CreateReviewArgs {
    review: Review;
    productId: string;
}

export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${SERVER}/review/`,
        credentials: "include",
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    }),
    tagTypes: ["reviews"],

    endpoints: (builder) => ({
        createReview: builder.mutation<void, CreateReviewArgs>({
            query: ({ review, productId }) => ({
                url: `postReview/${productId}`,
                method: "POST",
                body: review,
            }),
            invalidatesTags: ["reviews"],
        }),
        getReviews: builder.query<Review[], string>({
            query: (productId) => ({
                url: `get-review/${productId}`,
                method: "GET",
            }),
            providesTags: ["reviews"],
        }),
        getMyProductReviews: builder.query<Review[], void>({
            query: () => ({
                url: `my-product-reviews`,
                method: "GET",
            }),
            providesTags: ["reviews"],
        }),
        deleteReview: builder.mutation<void, string>({
            query: (reviewId) => ({
                url: `deleteReview/${reviewId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["reviews"],
        }),
    }),
});

export const {
    useCreateReviewMutation,
    useGetReviewsQuery,
    useDeleteReviewMutation,
    useGetMyProductReviewsQuery,
} = reviewApi;
