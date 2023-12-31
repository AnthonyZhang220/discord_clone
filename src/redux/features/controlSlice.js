import { createSlice } from "@reduxjs/toolkit";

const controlSlice = createSlice({
    name: "control",
    initialState: {
        isMuted: true,
        isDeafen: false,
        isCameraOn: false,
        isScreenSharingOn: false,
        isVoiceChatConnected: false,
    },
    reducers: {
        setIsMuted: (state, action) => {
            state.isMuted = action.payload;
        },
        setIsDeafen: (state, action) => {
            state.isDeafen = action.payload;
        },
        setIsCameraOn: (state, action) => {
            state.isCameraOn = action.payload;
        },
        setIsScreenSharingOn: (state, action) => {
            state.isScreenSharingOn = action.payload;
        },
        setIsVoiceChatConnected: (state, action) => {
            state.isVoiceChatConnected = action.payload;
        },
    }
})

export const { setIsCameraOn, setIsMuted, setIsDeafen, setIsSharingOn, setIsVoiceChatConnected, setIsScreenSharingOn } = controlSlice.actions;

export default controlSlice.reducer;

