import { createSlice } from "@reduxjs/toolkit";
import { addDoc, collection } from "firebase/firestore";

const channelSlice = createSlice({
    name: "channel",
    initialState: {
        channelList: [],
        voiceChannelList: [],
        newChannelInfo: { channelName: null },
    },
    reducers: {
        setChannelList: (state, action) => {
            state.channelList = action.payload;
        },
        setVoiceChannelList: (state, action) => {
            state.voiceChannelList = action.payload;
        },
        setNewChannelInfo: (state, action) => {
            state.newChannelInfo = action.payload;
        },
    }
})

export const { setNewChannelInfo, setChannelList, setVoiceChannelList } = channelSlice.actions;

export const handleCreateChannel = (currentServer, newChannelInfo) => async (dispatch) => {
    await addDoc(collection(db, "channels"), {
        name: newChannelInfo.channelName,
        serverRef: currentServer.uid,
        createdAt: Timestamp.fromDate(new Date()),
        messages: [],
    }).then(() => {
        dispatch(setNewChannelInfo({ channelName: "" }))
        // handleChannelModalClose();

    })

}



export default channelSlice.reducer;