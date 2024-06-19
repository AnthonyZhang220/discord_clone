import store from "../redux/store";
import { setIsCameraOn, setIsScreenSharingOn, setIsMicOn, setIsDeafen } from "../redux/features/voiceChatSlice";

export const toggleCamera = () => {
    if (store.getState().voiceChat.isCameraOn) {
        // Mute the local video.
        store.dispatch(setIsCameraOn(false))
    } else {
        // Unmute the local video.
        store.dispatch(setIsCameraOn(true))
    }
}

export const toggleScreenShare = () => {
    if (store.getState().voiceChat.isScreenSharingOn) {
        store.dispatch(setIsScreenSharingOn(false))
    } else {
        store.dispatch(setIsScreenSharingOn(true))
    }
}

export const toggleMic = () => {
    if (store.getState().voiceChat.isMicOn) {
        store.dispatch(setIsMicOn(false))
    } else {
        store.dispatch(setIsMicOn(true))
    }
}

export const toggleDeafen = () => {
    if (store.getState().voiceChat.isDeafen) {
        store.dispatch(setIsDeafen(false))
    } else {
        store.dispatch(setIsDeafen(true))
        store.dispatch(setIsMicOn(false))
    }
}