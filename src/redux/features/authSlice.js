// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: {},
        isLoggedIn: false,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setIsLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload
        }
        // Add other auth-related reducers here
    },
});

export const { setUser, setIsLoggedIn } = authSlice.actions;
export default authSlice.reducer;
