import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
    name: "modal",
    initialState: {
        createChannelModal: false,
        createServerModal: false,
        createServerFormModal: false,
        joinServerModal: false,
        inviteModal: false,
    },
    reducers: {
        setCreateChannelModal: (state, action) => {
            state.createChannelModal = action.payload;
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
export const { setCreateChannelModal, setCreateServerModal, setCreateServerFormModal, setJoinServerModal, setInviteModal } = modalSlice.actions;
export default modalSlice.reducer;