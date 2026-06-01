import store from "@/redux/store";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db, storage } from "@/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { setDraftDirectMessage, setDraftMessage } from "@/redux/features/draftSlice";
import { setIsLoading } from "@/redux/features/loadSlice";
import { showError } from "@/utils/showError";
import { bytesToMB } from "@/utils/bytesToMB";

//add new message to db
export const handleSubmitDirectMessage = async (e) => {
    e.preventDefault();
    const user = store.getState().auth.user;
    const currDirectMessage = String(store.getState().draft.draftDirectMessage || "");
    const currChannel = store.getState().directMessage.currDirectMessageChannelRef;

    if (!currDirectMessage.trim()) {
        return;
    }

    if (!user?.id) {
        showError("Auth", "No authenticated user found.");
        return;
    }

    if (!currChannel) {
        showError("Message", "No channel selected.");
        return;
    }

    store.dispatch(setIsLoading(true));
    try {
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
        });
        store.dispatch(setDraftDirectMessage(""));
    } catch (error) {
        console.error("Direct message send failed:", error);
        showError("Message", error?.message || "Failed to send direct message.");
    } finally {
        store.dispatch(setIsLoading(false));
    }
};

//add new message to db
export const handleSubmitMessage = async (e) => {
    e.preventDefault();
    const user = store.getState().auth.user;
    const currMessage = store.getState().draft.draftMessage;
    const currChannel = store.getState().channel.currChannel.id;

    if (!currMessage.trim()) {
        return;
    }

    if (!user) {
        showError("Auth", "No authenticated user found.");
        return;
    }

    if (!currChannel) {
        showError("Message", "No channel selected.");
        return;
    }

    store.dispatch(setIsLoading(true));
    try {
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
        });
        store.dispatch(setDraftMessage(""));
    } catch (error) {
        console.error("Message send failed:", error);
        showError("Message", error?.message || "Failed to send message.");
    } finally {
        store.dispatch(setIsLoading(false));
    }
};

export const handleUploadFile = async (e) => {
    const user = store.getState().auth.user;

    const fileUploaded = e.target.files?.[0];
    if (!fileUploaded) {
        return;
    }

    const fileSize = fileUploaded.size;
    const fileType = fileUploaded.type;
    const fileName = fileUploaded.name;

    const mb = bytesToMB(fileSize);

    if (mb > 50) {
        showError("File", "File exceeds 50MB.");
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

    const messageMediaRef = ref(storage, `messages/${user.id}/${fileName}-${timeString}`);
    store.dispatch(setIsLoading(true));
    try {
        await uploadBytes(messageMediaRef, fileUploaded);
        const url = await getDownloadURL(messageMediaRef);

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
        });
    } catch (error) {
        console.error("File upload failed:", error);
        if (
            error?.code === "storage/quota-exceeded" ||
            (error?.message && error.message.includes("quota"))
        ) {
            showError(
                "Storage",
                "Firebase Storage quota exceeded. Please free space or upgrade your plan."
            );
        } else {
            showError("File", "Upload failed. Please try again.");
        }
    } finally {
        store.dispatch(setIsLoading(false));
    }
};
