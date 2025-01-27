import { SERVER } from "@/constants/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${SERVER}/profile/`,
        credentials: "include",
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    }),
    tagTypes: ["users"],

    endpoints: (builder) => ({
        fetchUserProfile: builder.query({
            query: () => ({
                url: "me",
                method: "GET",
            }),
            providesTags: ["users"],
        }),

        updateUserProfile: builder.mutation({
            query: (updateUser) => ({
                url: "update-profile",
                method: "PUT",
                body: updateUser,
            }),
            invalidatesTags: ["users"],
        }),

        deleteUser: builder.mutation({
            query: () => ({
                url: `deleteProfile`,
                method: "DELETE",
            }),
            invalidatesTags: ["users"],
        }),
    }),
});

export const {
    useFetchUserProfileQuery,
    useUpdateUserProfileMutation,
    useDeleteUserMutation,
} = profileApi;
