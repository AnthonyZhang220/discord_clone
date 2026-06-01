import { createSlice } from "@reduxjs/toolkit";

const directMessageSlice = createSlice({
    name: "directMessage",
    initialState: {
        isDirectMessagePageOpen: false,
        currDirectMessageChannel: {},
        currDirectMessageChannelRef: "",
        friendFilter: "online",
        friendList: [],
        friendIdList: [],
        pendingIncomingList: [],
        pendingOutgoingList: [],
        blockedIdList: [],
        blockedList: [],
        inboxCount: 0,
        directMessageChannelRefs: {},
        directMessageChannelList: [],
        isFriendListPageOpen: true,
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
        toggleDirectMessageSidebar: (state) => {
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
        },
        setPendingIncomingList: (state, action) => {
            state.pendingIncomingList = action.payload;
        },
        setPendingOutgoingList: (state, action) => {
            state.pendingOutgoingList = action.payload;
        },
        setBlockedIdList: (state, action) => {
            state.blockedIdList = action.payload;
        },
        setBlockedList: (state, action) => {
            state.blockedList = action.payload;
        },
        setInboxCount: (state, action) => {
            state.inboxCount = action.payload;
        },
    },
});

export const {
    setInboxCount,
    setBlockedList,
    setBlockedIdList,
    setPendingOutgoingList,
    setPendingIncomingList,
    setQueryFriendList,
    setFriendIdList,
    setFriendList,
    setCurrDirectMessageChannelRef,
    setDirectMessageChannelRefs,
    setDirectMessageChannelList,
    setIsDirectMessagePageOpen,
    setCurrDirectMessageChannel,
    setFriendFilter,
    setIsFriendListPageOpen,
    toggleDirectMessageSidebar,
} = directMessageSlice.actions;
export default directMessageSlice.reducer;
