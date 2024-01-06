import store from "../../redux/store";
import { db } from "../../firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { setCurrVoiceChannel } from "../../redux/features/channelSlice";
import { setIsVoiceChatConnected, setIsVoiceChatPageOpen } from "../../redux/features/voiceChatSlice";

export const handleJoinVoiceChannel = async (name, channelId) => {
    store.dispatch(setIsVoiceChatPageOpen(true))
    const currUser = store.getState().auth.user;
    const participant = {
        id: currUser.id,
        profileURL: currUser.profileURL,
        displayName: currUser.displayName
    }

    const channelRef = doc(db, "voicechannels", channelId)
    const channelDoc = await updateDoc(channelRef, {
        participants: arrayUnion(participant)
    })

    store.dispatch(setCurrVoiceChannel({ name: name, id: channelId }))
    store.dispatch(setIsVoiceChatConnected(true))
    return { uid: currUser.id, channel: channelId }
}

export function setUpFirebaseListener() {

}


export const handleLeaveVoiceChannel = async () => {
    store.dispatch(setIsVoiceChatPageOpen(false))
    const voiceChannel = store.getState().channel.currVoiceChannel;
    const currUser = store.getState().auth.user;
    const participant = {
        id: currUser.id,
        profileURL: currUser.profileURL,
        displayName: currUser.displayName
    }
    const channelRef = doc(db, "voicechannels", voiceChannel.id)
    const channelDoc = await updateDoc(channelRef, {
        participants: arrayRemove(participant)
    })

    store.dispatch(setCurrVoiceChannel({}))
}