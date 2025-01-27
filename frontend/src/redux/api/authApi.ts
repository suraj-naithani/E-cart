import { SERVER } from "@/constants/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface User {
  email: string;
  password: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER}/auth`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    userSignup: builder.mutation<void, User>({
      query: (user) => ({
        url: "signup",
        method: "POST",
        body: user,
      }),
    }),
    userSignIn: builder.mutation<void, User>({
      query: (user) => ({
        url: "signin",
        method: "POST",
        body: user,
      }),
    }),
  }),
});

export const {
  useUserSignupMutation,
  useUserSignInMutation,
} = authApi;
