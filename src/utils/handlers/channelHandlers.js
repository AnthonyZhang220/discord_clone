import store from "../../redux/store"
import { setNewChannelInfo, setCurrChannel } from "../../redux/features/channelSlice"
import { update } from "firebase/database"
import { setSelectedChannel } from "../../redux/features/userSelectStoreSlice"

export const handleCreateChannel = async (currentServer, newChannelInfo) => {
    await addDoc(collection(db, "channels"), {
        name: newChannelInfo.channelName,
        serverRef: store.getState().userSelectStore.selectedServer,
        createdAt: Timestamp.fromDate(new Date()),
        messages: [],
    }).then(() => {
        store.dispatch(setNewChannelInfo({ channelName: "" }))
        // handleChannelModalClose();
    })
}

export const handleCurrentPrivateChannel = async (channelId) => {

    const q = query(collection(db, "privatechannels"), where("memberRef", "array-contains", user.uid))

    let userRef = [];
    const docRef = await getDocs(q)
    docRef.forEach((doc) => {
        userRef = doc.data().memberRef
    })


    let userId = "";
    if (userRef[0] === user.uid) {
        userId = userRef[1]
    } else if (userRef[1] === user.uid) {
        userId = userRef[0]
    }
    const resRef = doc(db, "users", userId)
    const queryRef = await getDoc(resRef);

    setCurrentPrivateChannel({
        uid: queryRef.data().userId,
        displayName: queryRef.data().displayName,
        status: queryRef.data().status,
        avatar: queryRef.data().profileURL,
        createdAt: queryRef.data().createdAt.seconds,
    })

    setChannelRef(channelRef);
}

export const handleSelectChannel = (channelName, channelId) => {
    const storedData = localStorage.getItem("userSelectStore");
    const userSelectStore = JSON.parse(storedData);
    const defaultChannels = userSelectStore.selectedChannelIds;
    const selectedServer = store.getState().userSelectStore.selectedServer;

    defaultChannels[selectedServer] = channelId;

    const updatedUserSelectStore = JSON.stringify(userSelectStore)

    localStorage.setItem("userSelectStore", updatedUserSelectStore)
    store.dispatch(setSelectedChannel(channelId))
    store.dispatch(setCurrChannel({ name: channelName, id: channelId }))
}