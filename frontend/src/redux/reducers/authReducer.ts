import { AuthState, User } from "@/utils/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
    user: null,
    isLoading: true,
    role: "", 
    token: null,
};

export const authReducer = createSlice({
    name: "authReducer",
    initialState,
    reducers: {
        userExists: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isLoading = false;
            state.role = action.payload.role;
            state.token = localStorage.getItem("token"); 
        },
        userNotExist: (state) => {
            state.user = null;
            state.isLoading = false;
            state.role = "";
            state.token = null;  
        },
        setToken: (state, action: PayloadAction<string>) => {
            localStorage.setItem("token", action.payload);
        },
        clearToken: () => {
            localStorage.removeItem("token");
        },
    },
});

export const { userExists, userNotExist, setToken, clearToken } =
    authReducer.actions;
