// serverSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSelectStoreSlice = createSlice({
    name: 'userSelectStore',
    initialState: {
        selectedServer: "",
        selectedChannel: "",
    },
    reducers: {
        setSelectedChannel: (state, action) => {
            state.selectedChannel = action.payload;
        },
        setSelectedServer: (state, action) => {
            state.selectedServer = action.payload;
        },
        setServerList: (state, action) => {
            state.serverList = action.payload;
        },
        setChannelList: (state, action) => {
            state.channelList = action.payload;
        }
    },
});

export const {
    setSelectedServer,
    setSelectedChannel,
    setServerList,
    setChannelList,
} = userSelectStoreSlice.actions;
export default userSelectStoreSlice.reducer;




