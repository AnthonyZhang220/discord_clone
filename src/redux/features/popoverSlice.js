import { createSlice } from "@reduxjs/toolkit";

const popoverSlice = createSlice({
    name: "popover",
    initialState: {
        serverSettingsPopover: false,
        userDetailPopover: false,
    },
    reducers: {
        setServerSettingsPopover: (state, action) => {
            state.serverSettingsPopover = action.payload;
        },
        setUserDetailPopover: (state, action) => {
            state.userDetailPopover = action.payload;
        }
    }
})

export const { setServerSettingsPopover, setUserDetailPopover } = popoverSlice.actions;

export default popoverSlice.reducer;

