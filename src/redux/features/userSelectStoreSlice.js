// serverSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { redirect } from 'react-router-dom';
import store from '../store';

const userSelectStoreSlice = createSlice({
    name: 'userSelectStore',
    initialState: {
        selectedServer: { serverName: "", serverId: "" },
        selectedChannel: { channelName: "", channelId: "" },
    },
    reducers: {
        setSelectedChannel: (state, action) => {
            state.selectedChannel = action.payload;
        },
        setSelectedServer: (state, action) => {
            state.selectedServer = action.payload;
        },
        setServerList: (state, action) => {
            state.serverList = action.payload;
        },
        setChannelList: (state, action) => {
            state.channelList = action.payload;
        }
    },
});

export const {
    setSelectedServer,
    setSelectedChannel,
    setServerList,
    setChannelList,
} = userSelectStoreSlice.actions;
export default userSelectStoreSlice.reducer;

export const handleSelectedServer = (serverName, serverId) => {

    const userItem = JSON.parse(localStorage.getItem(`${user.uid}`));
    const userArray = userItem.userDefault;
    const foundDefaultChannel = userArray.find(obj => obj.selectedServer.serverId === serverId)

    localStorage.setItem(`${user.uid}`, JSON.stringify({ ...userItem, defaultServer: serverId, defaultServerName: serverName }))

    if (foundDefaultChannel == undefined) {
        const newServerObj = {
            selectedServer: serverId,
            selectedChannel: null,
        }
        userArray.push(newServerObj);

        localStorage.setItem(`${user.uid}`, JSON.stringify({ ...userItem, userDefault: userArray }))
    } else {
        if (userArray.length !== 0) {
            userArray.forEach((obj) => {
                if (obj.currentServer === serverUid) {
                    setCurrentChannel({ name: obj.selectedChannel.channelName, uid: obj.currentChannel })
                }
            })
        }
    }


    setSelectedServer({ serverName: serverName, serverId: serverId })
    return redirect("/channel")

}

export const handleCurrentChannel = (channelName, channelUid) => {
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
        name: queryRef.data().displayName,
        status: queryRef.data().status,
        avatar: queryRef.data().profileURL,
        createdAt: queryRef.data().createdAt.seconds,
    })

    setChannelRef(channelRef);
}