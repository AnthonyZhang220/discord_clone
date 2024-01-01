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


