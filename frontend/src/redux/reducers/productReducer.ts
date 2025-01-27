import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Product {
  id?: string;
  sellerId?: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  category: string;
  stock: number;
  image: { public_id: string; url: string }[];
  shippingFee: number | null;
  hitCount?: number;
}

const initialState = {
  product: [] as Product[],
  isLoading: true,
};

export const productReducer = createSlice({
  name: "productReducer",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product[]>) => {
      state.product = action.payload;
      state.isLoading = false;
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.product = state.product.filter((i) => i.id !== action.payload);
      state.isLoading = false;
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      state.isLoading = true;
      state.product = state.product.map((item) =>
        item.id === action.payload.id ? { ...action.payload } : item
      );
      state.isLoading = false;
    },
    removeAllProducts: (state) => {
      state.isLoading = true;
      state.product = []; 
      state.isLoading = false;
    },
  },
});

export const { addProduct, removeProduct, updateProduct, removeAllProducts} = productReducer.actions;
