import { createSlice } from "@reduxjs/toolkit";

const directMessageSlice = createSlice({
    name: "directMessage",
    initialState: {
        isDirectMessagePageOpen: false,
        currDirectMessageChannel: {},
        currDirectMessageChannelRef: "",
        friendFilter: "",
        friendList: [],
        friendIdList: [],
        directMessageChannelRefs: {},
        directMessageChannelList: [],
        isFriendListPageOpen: false,
        isDirectMessageSidebarOpen: false,
        queryFriendList: [],
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
        setDirectMessageChannelList: (state, action) => {
            state.directMessageChannelList = action.payload;
        },
        setIsFriendListPageOpen: (state, action) => {
            state.isFriendListPageOpen = action.payload;
        },
        toggleDirectMessageSidebar: (state, action) => {
            state.isDirectMessageSidebarOpen = !state.isDirectMessageSidebarOpen;
        },
        setDirectMessageChannelRefs: (state, action) => {
            state.directMessageChannelRefs = action.payload;
        },
        setCurrDirectMessageChannelRef: (state, action) => {
            state.currDirectMessageChannelRef = action.payload;
        },
        setFriendIdList: (state, action) => {
            state.friendIdList = action.payload;
        },
        setQueryFriendList: (state, action) => {
            state.queryFriendList = action.payload;
        }
    }
})

export const { setQueryFriendList, setFriendIdList, setFriendList, setCurrDirectMessageChannelRef, setDirectMessageChannelRefs, setDirectMessageChannelList, setIsDirectMessagePageOpen, setCurrDirectMessageChannel, setFriendFilter, setIsFriendListPageOpen, toggleDirectMessageSidebar } = directMessageSlice.actions;
export default directMessageSlice.reducer;