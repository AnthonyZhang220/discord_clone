import { createSlice } from "@reduxjs/toolkit";

const memberListSlice = createSlice({
    name: "memberList",
    initialState: {
        isMemberListOpen: true,
        memberList: [],
        memberDetail: {}
    },
    reducers: {
        setIsMemberListOpen: (state, action) => {
            state.isMemberListOpen = action.payload;
        },
        setMemberList: (state, action) => {
            state.memberList = action.payload;
        },
        setMemberDetail: (state, action) => {
            state.memberDetail = action.payload;
        }
    }
})

export const { setIsMemberListOpen, setMemberList, setMemberDetail } = memberListSlice.actions;
export default memberListSlice.reducer;