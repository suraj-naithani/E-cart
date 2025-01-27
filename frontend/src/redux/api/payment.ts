import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SERVER } from '@/constants/constants';

export interface PaymentData {
  amount: number; // Example payment data
}

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER}/orders/`,
    credentials: 'include',
  }),
  tagTypes: ['payment'],

  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation<any, PaymentData>({
      query: (paymentData) => ({
        url: 'create-payment-intent',
        method: 'POST',
        body: paymentData,
      }),
    }),
  }),
});

export const { useCreatePaymentIntentMutation } = paymentApi;
