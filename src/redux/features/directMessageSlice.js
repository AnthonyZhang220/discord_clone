import { createSlice } from "@reduxjs/toolkit";

const directMessageSlice = createSlice({
    name: "directMessage",
    initialState: {
        isDirectMessagePageOpen: true,
        currDirectMessageChannel: {},
        friendFilter: "",
        friendList: [],
        isFriendListPageOpen: false,
        isDirectMessageSidebarOpen: false,
    },
    reducers: {
        setIsDirectMessagePageOpen: (state, action) => {
            state.isDirectMessagePageOpen = action.payload;
        },
        setCurrDirectMessageChannel: (state, action) => {
            state.currDirectMessageChannel = action.payload;
        },
        setFriendFilter: (state, action) => {
            state.friendFilter = action.payload;
        },
        setFriendList: (state, action) => {
            state.friendList = action.payload;
        },
        setIsFriendListPageOpen: (state, action) => {
            state.isFriendListPageOpen = action.payload;
        },
        setIsDirectMessageSidebarOpen: (state, action) => {
            state.isDirectMessageSidebarOpen = action.payload;
        }
    }
})

export const { setIsDirectMessagePageOpen, setCurrDirectMessageChannel, setFriendFilter, setIsFriendListPageOpen, setIsDirectMessageSidebarOpen } = directMessageSlice.actions;
export default directMessageSlice.reducer;