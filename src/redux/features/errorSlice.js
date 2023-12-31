import { createSlice } from "@reduxjs/toolkit";

const errorSlice = createSlice({
    name: "error",
    initialState: {
        errorTypeMessage: null,
        errorReason: null,
    },
    reducers: {
        setError: (state, action) => {
            state.errorTypeMessage = action.payload.type;
            state.errorReason = action.payload.message;
        }
    },
})

export const { setError } = errorSlice.actions;
export default errorSlice.reducer;