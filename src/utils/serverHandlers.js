import store from "../redux/store";
import { addDoc, updateDoc } from "firebase/firestore";
import { uploadBytesResumable, uploadBytes, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { setNewServerInfo, setIsLoading } from "../redux/features/serverSlice";
//add new Server with handleUploadServerImage();
export const handleCreateServer = async (user, newServerInfo) => {
    dispatch(setIsLoading(true));
    // Create the file metadata
    /** @type {any} */
    const metadata = {
        contentType: "image/*"
    }

    const date = new Date();
    const timeString = date.toISOString();

    // Upload file and metadata to the object 'images/mountains.jpg'
    const serverProfileRef = storageRef(storage, `serverProfile/${user.uid}/${fileName}-${timeString}`, metadata);

    const uploadProgress = await uploadBytes(serverProfileRef, file)
    const url = await getDownloadURL(serverProfileRef)

    const serverDoc = collection(db, "servers");
    const channelDoc = collection(db, "channels");

    //upload image
    await addDoc(serverDoc, {
        serverPic: url,
        name: newServerInfo.name,
        ownerId: user.uid,
        createdAt: Timestamp.fromDate(new Date()),
        members: [user.uid],
    }).then((doc) => {
        addDoc(channelDoc, {
            name: "general",
            serverRef: doc.id,
            createdAt: Timestamp.fromDate(new Date()),
            messages: [],
        }).then(() => {
            store.dispatch(setIsLoading(false))
            store.dispatch(setNewServerInfo({ serverName: "", serverPic: "" }))
            // setServerURL(null);
            // setFile(null);
        })

    })
}
export const handleJoinServer = async (serverId) => {
    dispatch(setIsLoading(true))
    try {
        const updateRef = doc(db, "servers", serverId);
        const joinSuccess = await updateDoc(updateRef, {
            members: arrayUnion(user.uid)
        })

        if (joinSuccess) {
            dispatch(setIsLoading(false))
        }
    } catch (error) {
        console.error("Join server error:", error)
    }
}