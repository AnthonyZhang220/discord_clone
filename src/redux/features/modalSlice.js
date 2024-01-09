import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
    name: "modal",
    initialState: {
        createChannelModal: false,
        createVoiceChannelModal: false,
        createServerModal: false,
        createServerFormModal: false,
        joinServerModal: false,
        inviteModal: false,
    },
    reducers: {
        setCreateChannelModal: (state, action) => {
            state.createChannelModal = action.payload;
        },
        setCreateVoiceChannelModal: (state, action) => {
            state.createVoiceChannelModal = action.payload;
        },
        setCreateServerModal: (state, action) => {
            state.createServerModal = action.payload;
        },
        setCreateServerFormModal: (state, action) => {
            state.createServerFormModal = action.payload;
        },
        setJoinServerModal: (state, action) => {
            state.joinServerModal = action.payload;
        },
        setInviteModal: (state, action) => {
            state.inviteModal = action.payload;
        },
    }
})
export const { setCreateChannelModal, setCreateVoiceChannelModal, setCreateServerModal, setCreateServerFormModal, setJoinServerModal, setInviteModal } = modalSlice.actions;
export default modalSlice.reducer;