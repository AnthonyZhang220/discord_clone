import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/authSlice";
import draftSlice from "./features/draftSlice";
import channelSlice from "./features/channelSlice";
import serverSlice from "./features/serverSlice";
import voiceChatSlice from "./features/voiceChatSlice";
import modalSlice from "./features/modalSlice"
import popoverSlice from "./features/popoverSlice";
import errorSlice from "./features/errorSlice";
import userSelectStoreSlice from "./features/userSelectStoreSlice";
import chatListSlice from "./features/chatListSlice";
import memberListSlice from "./features/memberListSlice";
import directMessageSlice from "./features/directMessageSlice";

const rootReducer = combineReducers({
    auth: authSlice,
    draft: draftSlice,
    chatList: chatListSlice,
    channel: channelSlice,
    server: serverSlice,
    voiceChat: voiceChatSlice,
    modal: modalSlice,
    popover: popoverSlice,
    error: errorSlice,
    userSelectStore: userSelectStoreSlice,
    memberList: memberListSlice,
    directMessage: directMessageSlice,
})

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
})

export default store;