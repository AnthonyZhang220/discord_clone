// privateChannelSlice.js
import { createSlice } from '@reduxjs/toolkit';

const directMessageSlice = createSlice({
    name: 'directMessage',
    initialState: {
        curDirectMessage: null,
        channelRef: '',
        directMessages: [],
        draftDirectMessage: "",
        // Add other private channel-related state here
    },
    reducers: {
        setDraftDirectMessage: (state, action) => {
            state.draftDirectMessage = action.payload;
        },
        setDirectMessageRef: (state, action) => {
            state.channelRef = action.payload;
        },
        setDirectMessage: (state, action) => {
            state.directMessages = action.payload;
        },
        // Add other private channel-related reducers here
    },
});

export const {
    setDraftDirectMessage, setDirectMessage, setDirectMessageRef
} = directMessageSlice.actions;
export default directMessageSlice.reducer;

//add new message to db
export const handleSubmitDirectMessage = () => async (dispatch) => {

    if (curDirectMessage.trim() == "") {
        return;
    }
    const { uid, displayName, photoURL } = auth.currentUser;

    await addDoc(collection(db, "messages"), {
        type: "text",
        content: draftDirectMessage,
        fileName: "",
        userName: displayName,
        avatar: photoURL,
        createdAt: Timestamp.fromDate(new Date()),
        channelRef: currentPrivateChannel.uid,
        serverRef: currentServer.uid,
        userRef: uid,
    }).then(() => {
        dispatch(setDirectMessage(""))
    })
}