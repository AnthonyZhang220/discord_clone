// messageSlice.js
import { createSlice } from '@reduxjs/toolkit';

const draftSlice = createSlice({
    name: 'draft',
    initialState: {
        draftMessage: "",
        draftDirectMessage: "",
        // Add other message-related state here
    },
    reducers: {
        setDraftMessage: (state, action) => {
            state.draftMessage = action.payload;
        },
        setDraftDirectMessage: (state, action) => {
            state.draftDirectMessage = action.payload;
        },
        // Add other message-related reducers here
    },
});

export const { setDraftDirectMessage, setDraftMessage } = draftSlice.actions;
export default draftSlice.reducer;
