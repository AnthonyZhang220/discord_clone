import { createSlice } from "@reduxjs/toolkit";


const serverSlice = createSlice({
    name: "server",
    initialState: {
        currServer: {},
        currServerList: [],
        newServerInfo: { serverName: null, serverPic: null },
        joinServerId: "",
        uploadServerProfileImage: null,
        uploadFileLocationURL: "",
    },
    reducers: {
        setCurrServer: (state, action) => {
            state.currServer = action.payload;
        },
        setCurrServerList: (state, action) => {
            state.currServerList = action.payload;
        },
        setNewServerInfo: (state, action) => {
            state.newServerInfo = action.payload;
        },
        setJoinServerId: (state, action) => {
            state.joinServerId = action.payload;
        },
        setUploadServerProfileImage: (state, action) => {
            state.uploadServerProfileImage = action.payload;
        },
        setUploadFileLocationURL: (state, action) => {
            state.uploadFileLocationURL = action.payload;
        },
    }
})

export const { setCurrServer, setCurrServerList, setNewServerInfo, setUploadFileLocationURL, setJoinServerId, setUploadServerProfileImage } = serverSlice.actions;

export default serverSlice.reducer;

