import store from "@/redux/store";
import {
    setIsCameraOn,
    setIsScreenSharingOn,
    setIsMicOn,
    setIsDeafen,
} from "@/redux/features/voiceChatSlice";
import { showError } from "@/utils/showError";

export const toggleCamera = () => {
    try {
        if (store.getState().voiceChat.isCameraOn) {
            store.dispatch(setIsCameraOn(false));
        } else {
            store.dispatch(setIsCameraOn(true));
        }
    } catch (error) {
        console.error("Toggle camera failed:", error);
        showError("VoiceControl", error?.message || "Failed to toggle camera.");
    }
};

export const toggleScreenShare = () => {
    try {
        if (store.getState().voiceChat.isScreenSharingOn) {
            store.dispatch(setIsScreenSharingOn(false));
        } else {
            store.dispatch(setIsScreenSharingOn(true));
        }
    } catch (error) {
        console.error("Toggle screen share failed:", error);
        showError("VoiceControl", error?.message || "Failed to toggle screen sharing.");
    }
};

export const toggleMic = () => {
    try {
        if (store.getState().voiceChat.isMicOn) {
            store.dispatch(setIsMicOn(false));
        } else {
            store.dispatch(setIsMicOn(true));
        }
    } catch (error) {
        console.error("Toggle mic failed:", error);
        showError("VoiceControl", error?.message || "Failed to toggle mic.");
    }
};

export const toggleDeafen = () => {
    try {
        if (store.getState().voiceChat.isDeafen) {
            store.dispatch(setIsDeafen(false));
        } else {
            store.dispatch(setIsDeafen(true));
            store.dispatch(setIsMicOn(false));
        }
    } catch (error) {
        console.error("Toggle deafen failed:", error);
        showError("VoiceControl", error?.message || "Failed to toggle deafen.");
    }
};
