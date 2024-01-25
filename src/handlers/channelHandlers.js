import store from "../redux/store"
import { setNewChannelInfo, setCurrChannel } from "../redux/features/channelSlice"
import { setSelectedChannel } from "../redux/features/userSelectStoreSlice"
import { setDirectMessageChannelRef, setIsFriendListPageOpen, setCurrDirectMessageChannelRef, setCurrDirectMessageChannel } from "../redux/features/directMessageSlice"
import { db } from "../firebase"
import { arrayUnion, doc, getDoc, updateDoc, addDoc, Timestamp, collection } from "firebase/firestore"
import { setIsVoiceChatPageOpen } from "../redux/features/voiceChatSlice"

export const handleCreateChannel = async (newChannelInfo) => {
    const doc = await addDoc(collection(db, "channels"), {
        name: newChannelInfo.channelName,
        serverRef: store.getState().userSelectStore.selectedServer,
        createdAt: Timestamp.fromDate(new Date()),
        messages: [],
    })
    if (doc) {
        store.dispatch(setNewChannelInfo({ channelName: "" }))
        // handleChannelModalClose();
    }
}

export const handleCreateVoiceChannel = async (newChannelInfo) => {
    const doc = await addDoc(collection(db, "voicechannels"), {
        name: newChannelInfo.channelName,
        serverRef: store.getState().userSelectStore.selectedServer,
        createdAt: Timestamp.fromDate(new Date()),
        participants: [],
    })
    if (doc) {
        store.dispatch(setNewChannelInfo({ channelName: "" }))
        // handleChannelModalClose();
    }
}

export const handleCurrDirectMessageChannel = async (userId, status, displayName, avatar, createdAt) => {
    console.log(userId)
    store.dispatch(setCurrDirectMessageChannel({ id: userId, status: status, displayName: displayName, avatar: avatar, createdAt: createdAt }))
    const privateChannels = store.getState().directMessage.directMessageChannelRefs;
    console.log(privateChannels)
    const channelRef = doc(db, "privatechannels", privateChannels[userId]);
    const channelDoc = await getDoc(channelRef);
    const ref = channelDoc.data().channelRef;
    console.log(ref)
    store.dispatch(setCurrDirectMessageChannelRef(ref))
    store.dispatch(setIsFriendListPageOpen(false))
}

export const handleSelectChannel = (channelName, channelId) => {
    const storedData = localStorage.getItem("userSelectStore");
    const userSelectStore = JSON.parse(storedData);
    const defaultChannels = userSelectStore.selectedChannelIds;
    const selectedServer = store.getState().userSelectStore.selectedServer;

    defaultChannels[selectedServer] = channelId;

    const updatedUserSelectStore = JSON.stringify(userSelectStore)

    localStorage.setItem("userSelectStore", updatedUserSelectStore)
    store.dispatch(setIsVoiceChatPageOpen(false))
    store.dispatch(setSelectedChannel(channelId))
    store.dispatch(setCurrChannel({ name: channelName, id: channelId }))
}


