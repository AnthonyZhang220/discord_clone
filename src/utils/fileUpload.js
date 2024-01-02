import store from "../redux/store";
import { addDoc } from "firebase/firestore";
import { db } from "../firebase";


export const handleUploadFile = async (e) => {
    const user = store.getState().auth.user;
    const userSelectStore = store.getState().userSelectStore;

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


    const messageMediaRef = ref(storage, `messages/${user.uid}/${fileName}-${timeString}`)
    const uploadProgress = await uploadBytes(messageMediaRef, fileUploaded)
    const url = await getDownloadURL(messageMediaRef)


    await addDoc(collection(db, "messages"), {
        type: fileType,
        content: url,
        fileName: fileName,
        userName: user.displayName,
        avatar: user.profileURL,
        createdAt: Timestamp.fromDate(new Date()),
        channelRef: userSelectStore.selectedChannel,
        serverRef: userSelectStore.selectedServer,
        userRef: user.id,
    }).then(() => {
        setOpenUpload(false);
        setFileUpload(null);
    })

}