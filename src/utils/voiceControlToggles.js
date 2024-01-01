import store from "../redux/store";
import { setIsMuted, setIsCameraOn, setIsDeafen, setIsScreenSharingOn, setIsSharingOn, setIsVoiceChatConnected } from "../redux/features/controlSlice";

export const toggleVoice = async (isMuted) => {
    const [audio, video] = localTracks

    if (store.getState(isMuted) === false) {
        // Mute the local video. 
        updateFirebaseMediaStatus(currentAgoraUID, "audio", false)
        const muteSuccess = agoraEngine && await audio.setEnabled(false)
        if (muteSuccess) {
            store.dispatch(setIsMuted(true))
        }
    } else {
        // Unmute the local video.
        updateFirebaseMediaStatus(currentAgoraUID, "audio", true)
        const unmuteSuccess = agoraEngine && await audio.setEnabled(true);
        if (unmuteSuccess) {
            store.dispatch(setIsMuted(false));
        }
    }

}
export const toggleCamera = async () => {
    const [audio, video] = localTracks

    if (store.getState(isCameraOn)) {
        // Mute the local video.
        updateFirebaseMediaStatus(currentAgoraUID, "video", false)
        const turnOffCamSuccess = agoraEngine && await video.setEnabled(false);
        if (turnOffCamSuccess) {
            store.dispatch(setIsCameraOn(true))
        }
    } else {
        // Unmute the local video.
        updateFirebaseMediaStatus(currentAgoraUID, "video", true)
        const turnOnCamSuccss = agoraEngine && await video.setEnabled(true);
        if (turnOnCamSuccss) {
            store.dispatch(setIsCameraOn(false))
        }
    }
}

export const toggleHeadphone = async (isDeafen) => {
    if (store.getState(isDeafen)) {
        store.dispatch(setIsDeafen(false))
    } else {
        store.dispatch(setIsDeafen(true))
    }
}

export const toggleScreenShare = async (isScreenSharingOn) => {

    if (store.getState(isScreenSharingOn) == false) {
        const screenTrack = await AgoraRTC.createScreenVideoTrack({ displaySurface: "browser", encoderConfig: "720p_2", optimizationMode: "motion" }, "auto");
        const [video, audio] = screenTrack
        // const newScreenTrack = screenTrack.getMediaStreamTrack()
        await agoraEngine.unpublish(localTracks)
        // await localTracks.replaceTrack(video, true)
        // Create a screen track for screen sharing.
        // Replace the video track with the screen track.
        await agoraEngine.publish([video, audio])
        console.log([video, audio])
        // Update the screen sharing state.
        store.dispatch(setIsScreenSharingOn(true))
    } else {
        const videoTrack = await AgoraRTC.createMicrophoneAndCameraTracks();
        const [video, audio] = videoTrack
        // await screenTrack.replaceTrack(videoTrack, true)
        await agoraEngine.unpublish(screenTrack)
        await agoraEngine.publish([video, audio])
        // Replace the screen track with the local video track.
        store.dispatch(setIsScreenSharingOn(false))
    }
}