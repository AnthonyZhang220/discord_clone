import store from "../redux/store";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { setDraftDirectMessage, setDraftMessage } from "../redux/features/draftSlice";
import { setError } from "../redux/features/errorSlice";
import { bytesToMB } from "../utils/bytesToMB";

//add new message to db
export const handleSubmitDirectMessage = async (e) => {
    e.preventDefault();
    const user = store.getState().auth.user
    const currDirectMessage = store.getState().draft.draftDirectMessage;
    const currChannel = store.getState().channel.currChannel.id;
    const currServer = store.getState().server.currServer.id
    if (currDirectMessage.trim() == "") {
        return;
    }
    const { id, displayName, avatar } = user;

    await addDoc(collection(db, "messages"), {
        type: "text",
        content: currDirectMessage,
        fileName: "",
        userName: displayName,
        avatar: avatar,
        createdAt: Timestamp.fromDate(new Date()),
        channelRef: currChannel,
        userRef: id,
    }).then(() => {
        store.dispatch(setDraftDirectMessage(""))
    })
}

//add new message to db
export const handleSubmitMessage = async (e) => {
    e.preventDefault();
    const user = store.getState().auth.user
    const currMessage = store.getState().draft.draftMessage;
    const currChannel = store.getState().channel.currChannel.id;
    const currServer = store.getState().server.currServer.id
    if (currMessage.trim() == "") {
        return;
    }

    const { id, displayName, avatar } = user;

    await addDoc(collection(db, "messages"), {
        type: "text",
        content: currMessage,
        fileName: "",
        displayName: displayName,
        avatar: avatar,
        createdAt: Timestamp.fromDate(new Date()),
        channelRef: currChannel,
        userRef: id,
    }).then(() => {
        store.dispatch(setDraftMessage(""))
    })
}



export const handleUploadFile = async (e) => {
    const user = store.getState().auth.user;

    const fileUploaded = e.target.files[0]

    const fileSize = fileUploaded.size;
    const fileType = fileUploaded.type;
    const fileName = fileUploaded.name;

    const mb = bytesToMB(fileSize);

    if (!fileUploaded) {
        return;
    }

    if (mb > 50) {
        store.dispatch(setError("File", "File exceeds 50MB."))
        return;
    }

    // if(fileType !== ){
    //     setFileError(true);
    //     setFileErrorMessage("File format unsupported.")
    //     return;
    // }

    // setFileUpload(fileUploaded)
    const date = new Date();
    const timeString = date.toISOString();


    const messageMediaRef = ref(storage, `messages/${user.id}/${fileName}-${timeString}`)
    const uploadProgress = await uploadBytes(messageMediaRef, fileUploaded)
    const url = await getDownloadURL(messageMediaRef)

    const currChannel = store.getState().channel.currChannel.id;
    const currServer = store.getState().server.currServer.id;
    await addDoc(collection(db, "messages"), {
        type: fileType,
        content: url,
        fileName: fileName,
        userName: user.displayName,
        avatar: user.avatar,
        createdAt: Timestamp.fromDate(new Date()),
        channelRef: currChannel,
        serverRef: currServer,
        userRef: user.id,
    }).then(() => {

    })

}