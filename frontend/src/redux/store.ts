import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { authReducer } from "./reducers/authReducer";
import { profileApi } from "./api/profileApi";
import { productApi } from "./api/productApi";
import { reviewApi } from "./api/reviewApi";
import { productReducer } from "./reducers/productReducer";
import { dashboardReducer } from "./reducers/dashboardReducer";
import { cartReducer } from "./reducers/cartReducer";
import { cartApi } from "./api/cartApi";
import { dashboardApi } from "./api/dashboardApi";
import { sellerApi } from "./api/sellerApi";
import { orderApi } from "./api/orderApi";
import { orderReducer } from "./reducers/orderReducer";
import { paymentApi } from "./api/payment";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [reviewApi.reducerPath]: reviewApi.reducer,
        [cartApi.reducerPath]: cartApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [sellerApi.reducerPath]: sellerApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [paymentApi.reducerPath]: orderApi.reducer,
        [authReducer.name]: authReducer.reducer,
        [productReducer.name]: productReducer.reducer,
        [cartReducer.name]: cartReducer.reducer,
        [dashboardReducer.name]: dashboardReducer.reducer,
        [orderReducer.name]: orderReducer.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(profileApi.middleware)
            .concat(productApi.middleware)
            .concat(reviewApi.middleware)
            .concat(cartApi.middleware)
            .concat(dashboardApi.middleware)
            .concat(sellerApi.middleware)
            .concat(orderApi.middleware)
            .concat(paymentApi.middleware)
    ,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
