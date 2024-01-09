// privateChannelSlice.js
import { createSlice } from '@reduxjs/toolkit';

const chatListSlice = createSlice({
    name: 'chatList',
    initialState: {
        directMessageList: [],
        messageList: [],
        // Add other private channel-related state here
    },
    reducers: {
        setDirectMessageList: (state, action) => {
            state.draftDirectMessage = action.payload;
        },
        setMessageList: (state, action) => {
            state.messageList = action.payload;
        },
        // Add other private channel-related reducers here
    },
});

export const {
    setDirectMessageList, setMessageList
} = chatListSlice.actions;
export default chatListSlice.reducer;

