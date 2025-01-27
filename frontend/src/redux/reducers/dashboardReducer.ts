import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DashboardState {
    data: any | null; // Adjust `any` to your specific data type
    loading: boolean;
}

const initialState: DashboardState = {
    data: null,
    loading: true,
};

export const dashboardReducer = createSlice({
    name: "dashboardReducer",
    initialState,
    reducers: {
        setDashboardData: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.data = action.payload;
        },
        clearDashboardData: (state) => {
            state.data = null;
            state.loading = false;
        },
    },
});

export const { setDashboardData, clearDashboardData } = dashboardReducer.actions;