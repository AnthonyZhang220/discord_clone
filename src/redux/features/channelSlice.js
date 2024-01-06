import { createSlice } from "@reduxjs/toolkit";

const channelSlice = createSlice({
    name: "channel",
    initialState: {
        currChannel: { name: "", id: "" },
        currChannelList: [],
        currVoiceChannel: {},
        currVoiceChannelList: [],
        newChannelInfo: { channelName: null },
    },
    reducers: {
        setCurrChannel: (state, action) => {
            state.currChannel = action.payload;
        },
        setCurrChannelList: (state, action) => {
            state.currChannelList = action.payload;
        },
        setCurrVoiceChannel: (state, action) => {
            state.currVoiceChannel = action.payload;
        },
        setCurrVoiceChannelList: (state, action) => {
            state.currVoiceChannelList = action.payload;
        },
        setNewChannelInfo: (state, action) => {
            state.newChannelInfo = action.payload;
        },
    }
})

export const { setNewChannelInfo, setCurrChannelList, setCurrVoiceChannelList, setCurrChannel, setCurrVoiceChannel } = channelSlice.actions;
export default channelSlice.reducer;