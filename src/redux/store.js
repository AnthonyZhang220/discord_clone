import { combineReducers, configureStore, applyMiddleware, Tuple } from "@reduxjs/toolkit";
import authSlice from "./features/authSlice";
import draftSlice from "./features/draftSlice";
import directMessageSlice from "./features/directMessageSlice";
import channelSlice from "./features/channelSlice";
import serverSlice from "./features/serverSlice";
import voiceChatSlice from "./features/voiceChatSlice";
import modalSlice from "./features/modalSlice"
import popoverSlice from "./features/popoverSlice";
import controlSlice from "./features/controlSlice";
import errorSlice from "./features/errorSlice";
import userSelectStoreSlice from "./features/userSelectStoreSlice";

const rootReducer = combineReducers({
    auth: authSlice,
    draftSlice: draftSlice,
    directMessage: directMessageSlice,
    channel: channelSlice,
    server: serverSlice,
    voiceChat: voiceChatSlice,
    modal: modalSlice,
    popover: popoverSlice,
    control: controlSlice,
    error: errorSlice,
    userSelectStore: userSelectStoreSlice,
})

const store = configureStore({
    reducer: rootReducer,
})

export default store;