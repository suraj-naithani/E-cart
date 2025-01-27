import { SERVER } from "@/constants/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const sellerApi = createApi({
  reducerPath: "sellerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER}/seller/`,
    credentials: "include",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }, 
  }),
  tagTypes: ["seller"],

  endpoints: (builder) => ({
    newProduct: builder.mutation({
      query: (productData) => ({
        url: "create-product",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["seller"],
    }),

    getProducts: builder.query({
      query: () => ({
        url: "products",
        method: "GET",
      }),
      providesTags: ["seller"],
    }),

    updateProduct: builder.mutation({
      query: (updatedProductData: FormData) => ({
        url: `update-product/${updatedProductData.get("id")}`,
        method: "PUT",
        body: updatedProductData,
      }),
      invalidatesTags: ["seller"],
    }),

    deleteProduct: builder.mutation({
      query: (id: string) => ({
        url: `delete-product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["seller"],
    }),
  }),
});

export const {
  useNewProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = sellerApi;
