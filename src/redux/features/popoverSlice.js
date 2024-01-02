import { createSlice } from "@reduxjs/toolkit";

const popoverSlice = createSlice({
    name: "popover",
    initialState: {
        serverSettingsPopover: false,
        userDetailPopover: false,
    },
    reducers: {
        toggleServerSettings: (state, action) => {
            !state.serverSettingsPopover;
        },
        setUserDetailPopover: (state, action) => {
            state.userDetailPopover = action.payload;
        }
    }
})

export const { toggleServerSettings, setUserDetailPopover } = popoverSlice.actions;

export default popoverSlice.reducer;

