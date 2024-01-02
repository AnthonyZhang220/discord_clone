import store from "../../redux/store";
import { addDoc, updateDoc } from "firebase/firestore";
import { uploadBytesResumable, uploadBytes, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { setNewServerInfo, setIsLoading, setCurrServer } from "../../redux/features/serverSlice";
import { setSelectedChannel, setSelectedServer } from "../../redux/features/userSelectStoreSlice";
import { setIsDirectMessagePageOpen } from "../../redux/features/directMessageSlice";

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
    store.dispatch(setCurrServer({ name: serverName, id: serverId }));
}


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

export const handleDeleteServer = async () => {
    setDeleteLoading(true);

    const parse = JSON.parse(localStorage.getItem(`${user.uid}`))
    const newLocal = parse.filter(({ selectedServer }) => selectedServer != selectedServer.uid);
    localStorage.setItem(`${user.uid}`, JSON.stringify(newLocal))

    const serverRef = doc(db, "servers", selectedServer.uid)
    const channelRef = query(collection(db, 'channels'), where('serverRef', '==', selectedServer.uid));
    const messageRef = query(collection(db, 'messages'), where('serverRef', '==', selectedServer.uid));

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
            setCurrChannelList([])
        })
        .catch((error) => {
            console.error('Error deleting documents: ', error);
        });

    await deleteDoc(serverRef).then(() => {
        setCurrentServer({ ...selectedServer, name: "" })
        setDeleteLoading(false);
        handleServerSettingsClose();
    });

}

export const handleInviteToServer = () => {

}