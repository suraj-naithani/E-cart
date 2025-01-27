import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
    productId: number;
    quantity: number;
    price?: number;  // Assuming price may come from somewhere else if not already included
}

interface ShippingInfo {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: number;
}

interface CartState {
    cartItems: CartItem[];
    shippingInfo: ShippingInfo;
    shippingCharges: number;
    discount: number;
    total: number;
    isLoading: boolean;
}

const initialState: CartState = {
  cartItems: [],
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: 0,
  },
  shippingCharges: 0,
  discount: 0,
  total: 0,
  isLoading: false,
};


export const cartReducer = createSlice({
    name: "cartReducer",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<{ productId: number; quantity: number; price?: number }>) => {
            const { productId, quantity, price } = action.payload;

            const existingProductIndex = state.cartItems.findIndex(
                (item) => item.productId === productId
            );

            if (existingProductIndex >= 0) {
                state.cartItems[existingProductIndex].quantity += quantity;
            } else {
                state.cartItems.push({ productId, quantity, price });
            }

            state.total = state.cartItems.reduce(
                (sum, item) => sum + (item.price || 0) * item.quantity,
                0
            );
        },

        removeFromCart: (state, action: PayloadAction<number>) => {
            const productId = action.payload;

            state.cartItems = state.cartItems.filter(
                (item) => item.productId !== productId
            );

            state.total = state.cartItems.reduce(
                (sum, item) => sum + (item.price || 0) * item.quantity,
                0
            );
        },

        updateCartItem: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
            const { productId, quantity } = action.payload;

            state.cartItems = state.cartItems.map((item) =>
                item.productId === productId ? { ...item, quantity } : item
            );

            state.total = state.cartItems.reduce(
                (sum, item) => sum + (item.price || 0) * item.quantity,
                0
            );
        },

        setCart: (state, action: PayloadAction<{ cart: { items: CartItem[] } }>) => {
            const cartData = action.payload;

            state.cartItems = cartData.cart.items;
        },

        clearCart: (state) => {
            state.cartItems = [];
            state.shippingInfo = {
                address: "",
                city: "",
                state: "",
                country: "",
                pinCode: 0,
            };
            state.shippingCharges = 0;
            state.discount = 0;
            state.total = 0;
        },

        saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
            state.shippingInfo = action.payload;
        },

        setTotal: (state) => {
            state.total = state.cartItems.reduce(
                (sum, item) => sum + (item.product.price || 0) * item.quantity,
                0
            );
        },

        updateShippingCharges: (state, action: PayloadAction<number>) => {
            state.shippingCharges = action.payload;
        },

        updateDiscount: (state, action: PayloadAction<number>) => {
            state.discount = action.payload;
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    updateCartItem,
    setCart,
    clearCart,
    setTotal,
    saveShippingInfo,
    updateShippingCharges,
    updateDiscount,
} = cartReducer.actions;
