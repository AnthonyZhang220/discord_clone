import { createSlice } from "@reduxjs/toolkit";

const memberListSlice = createSlice({
    name: "memberList",
    initialState: {
        isMemberListOpen: true,
        memberList: [],
    },
    reducers: {
        setIsMemberListOpen: (state, action) => {
            state.isMemberListOpen = action.payload;
        },
        setMemberList: (state, action) => {
            state.memberList = action.payload;
        }
    }
})

export const { setIsMemberListOpen, setMemberList } = memberListSlice.actions;
export default memberListSlice.reducer;