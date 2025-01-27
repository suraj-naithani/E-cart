import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SERVER } from "@/constants/constants";

interface ShippingInfo {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
}

interface OrderItem {
  name: string;
  photo: string;
  price: number;
  quantity: number;
}

interface Order {
  shippingInfo: ShippingInfo;
  orderItem: OrderItem[];
  subtotal?: number | undefined; 
  tax?: number | undefined;
  discount: number;
  shippingCharges: number;
  total: number;
  user: number;
  productId: number;
  sellerId: number;
}

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER}/orders/`,
    credentials: "include",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }),
  tagTypes: ["order"], // Adjusted tagTypes for consistency

  endpoints: (builder) => ({
    newOrder: builder.mutation<Order, Partial<Order>>({
      query: (user) => ({
        url: "new",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["order"],
    }),

    getOrders: builder.query<Order[], void>({
      query: () => ({
        url: "all-orders",
        method: "GET",
      }),
      providesTags: ["order"],
    }),

    getMyOrders: builder.query<Order[], void>({
      query: () => ({
        url: "my-orders",
        method: "GET",
      }),
      providesTags: ["order"],
    }),

    updateOrder: builder.mutation<Order[], void>({
      query: (id) => ({
        url: `order-process/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["order"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetOrdersQuery,
  useNewOrderMutation,
  useUpdateOrderMutation,
  useGetMyOrdersQuery,
} = orderApi;

export default orderApi.reducer; // Export the reducer to be used in the store
