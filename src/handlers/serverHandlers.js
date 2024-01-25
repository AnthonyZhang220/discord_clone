import store from "../redux/store";
import { addDoc, updateDoc, collection, Timestamp, arrayUnion, doc, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { uploadBytesResumable, uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { storage, db } from "../firebase";
import { setNewServerInfo, setIsLoading, setCurrServer, setUploadServerProfileImage } from "../redux/features/serverSlice";
import { setSelectedChannel, setSelectedServer } from "../redux/features/userSelectStoreSlice";
import { setIsDirectMessagePageOpen } from "../redux/features/directMessageSlice";
import { setCreateServerFormModal, setCreateServerModal } from "../redux/features/modalSlice";
import { toggleServerSettings } from "../redux/features/popoverSlice";
import { setCurrChannelList } from "../redux/features/channelSlice";
// userSelectStore
// {
// selectedServerId: "",
// selectedChannelIds: {
// serverId: channelId
// }
// }

export const handleSelectServer = (serverName, serverId) => {

    const storedData = localStorage.getItem("userSelectStore");
    const userSelectStore = JSON.parse(storedData);
    const storeChannelIds = userSelectStore?.selectedChannelIds;
    const getDefaultChannelId = storeChannelIds[serverId];

    if (getDefaultChannelId === undefined) {
        storeChannelIds[serverId] = "";
    } else {
        store.dispatch(setSelectedChannel(getDefaultChannelId))
    }

    userSelectStore.selectedServerId = serverId;
    const updatedUserSelectStore = JSON.stringify(userSelectStore);
    localStorage.setItem("userSelectStore", updatedUserSelectStore)
    store.dispatch(setIsDirectMessagePageOpen(false))
    store.dispatch(setSelectedServer(serverId))
    store.dispatch(setSelectedChannel(getDefaultChannelId))
    store.dispatch(setCurrServer({ name: serverName, id: serverId }));
}


//add new Server with handleUploadServerImage();
export const handleCreateServer = async (newServerInfo) => {
    store.dispatch(setIsLoading(true));
    // Create the file metadata
    /** @type {any} */
    const metadata = {
        contentType: "image/*"
    }

    const date = new Date();
    const timeString = date.toISOString();
    const user = store.getState().auth.user;
    const file = store.getState().server.uploadServerProfileImage;

    // Upload file and metadata to the object 'images/mountains.jpg'
    const serverProfileRef = ref(storage, `serverProfile/${user.id}/${file.name}-${timeString}`, metadata);

    console.log("serverProfileRef", serverProfileRef)

    const uploadTask = await uploadBytes(serverProfileRef, file)
    const url = await getDownloadURL(uploadTask.ref)

    console.log("url", url)
    const serverDoc = collection(db, "servers");
    const channelDoc = collection(db, "channels");

    //upload image
    const addedServer = await addDoc(serverDoc, {
        avatar: url,
        name: newServerInfo.serverName,
        ownerId: user.id,
        createdAt: Timestamp.fromDate(new Date()),
        members: arrayUnion(user.id),
    })

    const addedChannel = await addDoc(channelDoc, {
        name: "general",
        serverRef: addedServer.id,
        createdAt: Timestamp.fromDate(new Date()),
        messages: [],
    })

    if (addedServer && addedChannel) {
        store.dispatch(setIsLoading(false))
        store.dispatch(setNewServerInfo({ serverName: "", serverPic: "" }))
        store.dispatch(setUploadServerProfileImage(null))
        store.dispatch(setCreateServerFormModal(false))
        store.dispatch(setCreateServerModal(false))
    }
}

export const handleJoinServer = async (serverId) => {
    store.dispatch(setIsLoading(true))
    try {
        const updateRef = doc(db, "servers", serverId);
        const joinSuccess = await updateDoc(updateRef, {
            members: arrayUnion(user.uid)
        })

        if (joinSuccess) {
            store.dispatch(setIsLoading(false))
        }
    } catch (error) {
        console.error("Join server error:", error)
    }
}

export const handleDeleteServer = async () => {
    store.dispatch(setIsLoading(true))

    const selectedServer = store.getState().userSelectStore.selectedServer;
    const serverRef = doc(db, "servers", selectedServer)
    const channelRef = query(collection(db, 'channels'), where('serverRef', '==', selectedServer));
    const messageRef = query(collection(db, 'messages'), where('serverRef', '==', selectedServer));

    await getDocs(messageRef)
        .then((querySnapshot) => {
            // Iterate through the documents and delete them
            querySnapshot.forEach((doc) => {
                deleteDoc(doc.ref);
            });
        })
        .catch((error) => {
            console.error('Error deleting documents: ', error);
        });

    await getDocs(channelRef)
        .then((querySnapshot) => {
            // Iterate through the documents and delete them
            querySnapshot.forEach((doc) => {
                deleteDoc(doc.ref);
            });
            store.dispatch(setCurrChannelList([]))
        })
        .catch((error) => {
            console.error('Error deleting documents: ', error);
        });

    await deleteDoc(serverRef).then(() => {
        store.dispatch(setCurrServer({ name: "", id: "" }));
        store.dispatch(setIsLoading(false));
        store.dispatch(toggleServerSettings())
    });

}

export const handleInviteToServer = () => {

}