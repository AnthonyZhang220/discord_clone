import store from "../../redux/store";
import { setDirectMessage, setMe } from "../../redux/features/chatListSlice";

//add new message to db
export const handleSubmitDirectMessage = async () => {

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
        serverRef: currServer.uid,
        userRef: uid,
    }).then(() => {
        store.dispatch(setDirectMessage(""))
    })
}

//add new message to db
export const handleSubmitMessage = async () => {

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
        serverRef: currServer.uid,
        userRef: uid,
    }).then(() => {
        store.dispatch(setDraftMessage(""))
    })
}