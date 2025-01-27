import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

interface OrderState {
  order: Order[] | null; // Array of orders or null
  isLoading: boolean;
}

// Initial state
const initialState: OrderState = {
  order: null,
  isLoading: true,
};

// Create the order slice
export const orderReducer = createSlice({
  name: "orderReducer",
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order[]>) => {
      state.order = action.payload; // Set orders to the payload
      state.isLoading = false; // Set loading to false
    },
    updateOrders: (state, action: PayloadAction<Order>) => {
      if (state.order) {
        state.isLoading = true;
        // Update the specific order with the new order data (find by ID)
        state.order = state.order.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload } : item
        );
        state.isLoading = false;
      }
    },
  },
});

export const { addOrder, updateOrders } = orderReducer.actions;
