// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: {},
        defaultServer: {},
        defaultChannel: {},
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setDefaultServer: (state, action) => {
            state.defaultServer = action.payload;
        },
        setDefaultChannel: (state, action) => {
            state.defaultChannel = action.payload;
        }
        // Add other auth-related reducers here
    },
});

export const { setUser, setDefaultChannel, setDefaultServer } = authSlice.actions;
export default authSlice.reducer;
