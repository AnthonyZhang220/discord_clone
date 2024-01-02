import { createSlice } from "@reduxjs/toolkit";

const directMessageSlice = createSlice({
    name: "directMessage",
    initialState: {
        isDirectMessagePageOpen: true,
    },
    reducers: {
        setIsDirectMessagePageOpen: (state, action) => {
            state.isDirectMessagePageOpen = action.payload;
        }
    }
})

export const { setIsDirectMessagePageOpen } = directMessageSlice.actions;
export default directMessageSlice.reducer;