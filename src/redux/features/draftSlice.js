// messageSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { auth } from '../../firebase';

const draftSlice = createSlice({
    name: 'draft',
    initialState: {
        curChannelMessage: [],
        draftMessage: "",
        // Add other message-related state here
    },
    reducers: {
        setCurChannelMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setMessageDraft: (state, action) => {
            state.currentMessage = action.payload;
        },
        // Add other message-related reducers here
    },
});

export const { setCurChannelMessage, setMessageDraft } = draftSlice.actions;
export default draftSlice.reducer;

//add new message to db
export const handleSubmitMessage = (currentServer, currentChannel) => async (dispatch) => {

    if (draftMessage.trim() == "") {
        return;
    }

    const { uid, displayName, photoURL } = auth.currentUser;

    await addDoc(collection(db, "messages"), {
        type: "text",
        content: draftMessage,
        fileName: "",
        displayName: displayName,
        avatar: photoURL,
        createdAt: Timestamp.fromDate(new Date()),
        channelRef: currentChannel.uid,
        serverRef: currentServer.uid,
        userRef: uid,
    }).then(() => {
        dispatch(setMessageDraft(""))
    })
}