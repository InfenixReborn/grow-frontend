import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: localStorage.getItem("token") ? { token: localStorage.getItem("token") } : null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = { token: action.payload };
            localStorage.setItem("token", action.payload);
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("token");
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
