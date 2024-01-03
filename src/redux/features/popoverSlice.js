import { createSlice } from "@reduxjs/toolkit";

const popoverSlice = createSlice({
    name: "popover",
    initialState: {
        serverSettingsPopover: false,
        userDetailPopover: false,
        memberDetailPopover: false,

    },
    reducers: {
        toggleServerSettings: (state, action) => {
            !state.serverSettingsPopover;
        },
        setUserDetailPopover: (state, action) => {
            state.userDetailPopover = action.payload;
        },
        setMemberDetailPopover: (state, action) => {
            state.memberDetailPopover = action.payload;
        },
    }
})

export const { toggleServerSettings, setUserDetailPopover, setMemberDetailPopover } = popoverSlice.actions;

export default popoverSlice.reducer;

