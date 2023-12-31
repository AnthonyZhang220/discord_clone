import { createSlice } from "@reduxjs/toolkit";
import { uploadBytes, getDownloadURL } from "firebase/storage";


const serverSlice = createSlice({
    name: "server",
    initialState: {
        serverList: [],
        newServerInfo: { serverName: null, serverPic: null },
        joinServerId: "",
        uploadServerProfileImage: null,
        uploadFileLocationURL: "",
        isLoading: false,
    },
    reducers: {
        setServerList: (state, action) => {
            state.serverList = action.payload;
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
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    }
})

export const { setServerList, setNewServerInfo, setUploadFileLocationURL, setJoinServerId, setUploadServerProfileImage, setIsLoading } = serverSlice.actions;

export default serverSlice.reducer;

