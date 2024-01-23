// import store from "../redux/store";
// import { setIsMuted, setIsCameraOn, setIsDeafen, setIsScreenSharingOn, setIsSharingOn, setIsVoiceChatConnected } from "../redux/features/voiceChatSlice";

// export const toggleVoice = async () => {
//     const [audio, video] = localTracks

//     if (store.getState().voiceChat.isMuted === false) {
//         // Mute the local video. 
//         updateFirebaseMediaStatus(currentAgoraUID, "audio", false)
//         const muteSuccess = agoraEngine && await audio.setEnabled(false)
//         if (muteSuccess) {
//             store.dispatch(setIsMuted(true))
//         }
//     } else {
//         // Unmute the local video.
//         updateFirebaseMediaStatus(currentAgoraUID, "audio", true)
//         const unmuteSuccess = agoraEngine && await audio.setEnabled(true);
//         if (unmuteSuccess) {
//             store.dispatch(setIsMuted(false));
//         }
//     }

// }


// export const toggleHeadphone = async () => {
//     if (store.getState().voiceChat.isDeafen) {
//         store.dispatch(setIsDeafen(false))
//     } else {
//         store.dispatch(setIsDeafen(true))
//     }
// }

// export const toggleScreenShare = async () => {

//     if (store.getState().voiceChat.isScreenSharingOn == false) {
//         const screenTrack = await AgoraRTC.createScreenVideoTrack({ displaySurface: "browser", encoderConfig: "720p_2", optimizationMode: "motion" }, "auto");
//         const [video, audio] = screenTrack
//         // const newScreenTrack = screenTrack.getMediaStreamTrack()
//         await agoraEngine.unpublish(localTracks)
//         // await localTracks.replaceTrack(video, true)
//         // Create a screen track for screen sharing.
//         // Replace the video track with the screen track.
//         await agoraEngine.publish([video, audio])
//         console.log([video, audio])
//         // Update the screen sharing state.
//         store.dispatch(setIsScreenSharingOn(true))
//     } else {
//         const videoTrack = await AgoraRTC.createMicrophoneAndCameraTracks();
//         const [video, audio] = videoTrack
//         // await screenTrack.replaceTrack(videoTrack, true)
//         await agoraEngine.unpublish(screenTrack)
//         await agoraEngine.publish([video, audio])
//         // Replace the screen track with the local video track.
//         store.dispatch(setIsScreenSharingOn(false))
//     }
// }