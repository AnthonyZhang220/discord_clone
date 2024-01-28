import { createSlice } from "@reduxjs/toolkit";

const loadSlice = createSlice({
    name: "load",
    initialState: {
        isLoading: false,
    },
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    },
})

export const { setIsLoading } = loadSlice.actions;
export default loadSlice.reducer;
