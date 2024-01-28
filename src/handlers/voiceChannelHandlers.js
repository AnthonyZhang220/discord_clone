import store from "../redux/store";
import { db } from "../firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { setCurrVoiceChannel } from "../redux/features/channelSlice";
import { setAgoraConfig, setIsVoiceChatConnected, setIsVoiceChatLoading, setIsVoiceChatPageOpen } from "../redux/features/voiceChatSlice";
import fetchRTCToken from "../utils/fetchToken";
import AgoraConfig from "../contexts/agora/config";

export const handleJoinVoiceChannel = async (name, channelId) => {
    store.dispatch(setIsVoiceChatLoading(true))
    store.dispatch(setIsVoiceChatPageOpen(true))
    const currServerName = store.getState().server.currServer.name;
    const currUser = store.getState().auth.user;
    const participant = {
        id: currUser.id,
        avatar: currUser.avatar,
        displayName: currUser.displayName
    }

    const channelRef = doc(db, "voicechannels", channelId)
    const channelDoc = await updateDoc(channelRef, {
        participants: arrayUnion(participant)
    })
    store.dispatch(setCurrVoiceChannel({ name: name, id: channelId, serverName: currServerName }))
    const token = await fetchRTCToken(AgoraConfig, channelId)
    if (token) {
        store.dispatch(setAgoraConfig({ appid: AgoraConfig.appId, channel: channelId, uid: currUser.id, token: token }))
        store.dispatch(setIsVoiceChatConnected(true))
        store.dispatch(setIsVoiceChatLoading(false))
    }

}

export function setUpFirebaseListener() {

}


export const handleLeaveVoiceChannel = async () => {
    store.dispatch(setIsVoiceChatConnected(false))
    store.dispatch(setIsVoiceChatPageOpen(false))
    const voiceChannel = store.getState().channel.currVoiceChannel;
    const currUser = store.getState().auth.user;
    const participant = {
        id: currUser.id,
        avatar: currUser.avatar,
        displayName: currUser.displayName
    }
    const channelRef = doc(db, "voicechannels", voiceChannel.id)
    const channelDoc = await updateDoc(channelRef, {
        participants: arrayRemove(participant)
    })

    store.dispatch(setCurrVoiceChannel({}))
}