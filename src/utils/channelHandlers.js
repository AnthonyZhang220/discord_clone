import store from "../redux/store"
import { setNewChannelInfo } from "../redux/features/channelSlice"

export const handleCreateChannel = async (currentServer, newChannelInfo) => {
    await addDoc(collection(db, "channels"), {
        name: newChannelInfo.channelName,
        serverRef: currentServer.uid,
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

export const handleSelectedChannel = (channelName, channelUid) => {
    const userItem = JSON.parse(localStorage.getItem(`${user.uid}`))
    const userArray = userItem.userDefault;
    if (userArray.length !== 0) {
        userArray.forEach((obj) => {
            if (obj.currentServer === currentServer.uid) {
                obj.currentChannel = channelUid;
                obj.currentChannelName = channelName;
            }
        })
    }

    localStorage.setItem(`${user.uid}`, JSON.stringify({ ...userItem, userDefault: userArray }))

    setCurrentChannel({ name: channelName, uid: channelUid })
}