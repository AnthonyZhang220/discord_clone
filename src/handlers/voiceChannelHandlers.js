import store from "@/redux/store";
import { joinVoiceChannel, leaveVoiceChannel } from "@/redux/features/voiceChatSlice";
import { showError } from "@/utils/showError";

export const handleJoinVoiceChannel = (name, channelId) => {
    try {
        store.dispatch(joinVoiceChannel({ name, channelId }));
    } catch (error) {
        console.error("Join voice channel failed:", error);
        showError("Voice", error?.message || "Failed to join voice channel.");
    }
};

export function setUpFirebaseListener() {}

export const handleLeaveVoiceChannel = () => {
    try {
        store.dispatch(leaveVoiceChannel());
    } catch (error) {
        console.error("Leave voice channel failed:", error);
        showError("Voice", error?.message || "Failed to leave voice channel.");
    }
};
