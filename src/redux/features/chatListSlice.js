// privateChannelSlice.js
import { createSlice } from '@reduxjs/toolkit';

const chatListSlice = createSlice({
    name: 'chatList',
    initialState: {
        directMessageList: [],
        messeageList: [],
        // Add other private channel-related state here
    },
    reducers: {
        setDirectMessageList: (state, action) => {
            state.draftDirectMessage = action.payload;
        },
        setMessageList: (state, action) => {
            state.channelRef = action.payload;
        },
        // Add other private channel-related reducers here
    },
});

export const {
    setDirectMessageList, setMessageList
} = chatListSlice.actions;
export default chatListSlice.reducer;

