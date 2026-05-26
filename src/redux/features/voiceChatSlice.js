// voiceChatSlice.js
import { createSlice } from "@reduxjs/toolkit";
import store from "@/redux/store";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/firebase";

const voiceChatSlice = createSlice({
    name: "voiceChat",
    initialState: {
        isMicOn: true,
        isDeafen: false,
        isCameraOn: false,
        isScreenSharingOn: false,
        isVoiceChatConnected: false,
        isVoiceChatLoading: false,
        isVoiceChatPageOpen: false,
        agoraEngine: null,
        agoraConfig: {},
        screenShareRef: null,
        remoteUsers: [],
        localTracks: null,
        currAgoraUID: null,
        screenTrack: null,
        connectionState: "",
        latency: null,
        // Add other voice chat-related state here
    },
    reducers: {
        // Add other voice chat-related reducers here
        setIsMicOn: (state, action) => {
            state.isMicOn = action.payload;
        },
        setIsDeafen: (state, action) => {
            state.isDeafen = action.payload;
        },
        setIsCameraOn: (state, action) => {
            state.isCameraOn = action.payload;
        },
        setIsScreenSharingOn: (state, action) => {
            state.isScreenSharingOn = action.payload;
        },
        setIsVoiceChatConnected: (state, action) => {
            state.isVoiceChatConnected = action.payload;
        },
        setAgoraEngine: (state, action) => {
            state.agoraEngine = action.payload;
        },
        setScreenShareRef: (state, action) => {
            state.screenShareRef = action.payload;
        },
        setRemoteUsers: (state, action) => {
            state.remoteUsers = action.payload;
        },
        setLocalTracks: (state, action) => {
            state.localTracks = action.payload;
        },
        setCurrAgoraUID: (state, action) => {
            state.currAgoraUID = action.payload;
        },
        setScreenTrack: (state, action) => {
            state.screenTrack = action.payload;
        },
        setAgoraConfig: (state, action) => {
            state.agoraConfig = action.payload;
        },
        setIsVoiceChatPageOpen: (state, action) => {
            state.isVoiceChatPageOpen = action.payload;
        },
        setConnectionState: (state, action) => {
            state.connectionState = action.payload;
        },
        setLatency: (state, action) => {
            state.latency = action.payload;
        },
        setIsVoiceChatLoading: (state, action) => {
            state.isVoiceChatLoading = action.payload;
        },
    },
});

export const {
    setIsCameraOn,
    setIsMicOn,
    setIsDeafen,
    setIsVoiceChatConnected,
    setIsScreenSharingOn,
    setAgoraEngine,
    setScreenShareRef,
    setRemoteUsers,
    setLocalTracks,
    setCurrAgoraUID,
    setScreenTrack,
    setAgoraConfig,
    setIsVoiceChatPageOpen,
    setConnectionState,
    setLatency,
    setIsVoiceChatLoading,
} = voiceChatSlice.actions;
export default voiceChatSlice.reducer;

// Helpers to access current runtime state and dispatch actions
const getState = () => store.getState();
const getCurrentVoiceChannel = () =>
    getState().server?.currentVoiceChannel ||
    getState().voiceChat?.currentVoiceChannel || { uid: null };
const getCurrentUser = () => getState().auth?.user || {};
const getLocalTracks = () => getState().voiceChat?.localTracks || [];
const getAgoraEngine = () => getState().voiceChat?.agoraEngine;
const dispatch = (action) => store.dispatch(action);
const setCurrentVoiceChannel = (val) =>
    dispatch({ type: "server/setCurrentVoiceChannel", payload: val });

export const handleVolume = (volumes) => {
    const previousUsers = getState().voiceChat.remoteUsers || [];
    const next = previousUsers.map((user) => {
        if (user) {
            const volume = volumes.find((v) => v.uid == user.uid);
            if (volume) return { ...user, volume: volume.level };
            return user;
        }
        return user;
    });
    dispatch(voiceChatSlice.actions.setRemoteUsers(next));
};

// Note: handleUserUnpublishedFromAgora removed because it was unused; keep remote user handlers minimal

export const updateFirebaseMediaStatus = (agoraID, mediaType, status) => {
    const cv = getCurrentVoiceChannel();
    if (cv && cv.uid) {
        const voiceChannelRef = doc(db, "voicechannels", cv.uid);

        getDoc(voiceChannelRef).then((d) => {
            if (d.exists()) {
                const arr = d.data().liveUser || [];
                const updateUser = arr.find((x) => x.uid == agoraID);
                if (updateUser) {
                    if (mediaType === "audio") updateUser.hasAudio = status;
                    if (mediaType === "video") updateUser.hasVideo = status;
                }

                updateDoc(voiceChannelRef, {
                    liveUser: arr,
                });
            }
        });
    }
};

export const handleUserPublishedToAgora = (user, mediaType) => {
    updateFirebaseMediaStatus(user.uid, mediaType, true);

    const previousUsers = getState().voiceChat.remoteUsers || [];
    const next = previousUsers.map((User) => {
        if (User && User.uid == user.uid) {
            if (mediaType === "video")
                return { ...User, hasVideo: true, videoTrack: user.videoTrack, uid: user.uid };
            if (mediaType === "audio")
                return { ...User, hasAudio: true, audioTrack: user.audioTrack, uid: user.uid };
        }
        return User;
    });
    dispatch(voiceChatSlice.actions.setRemoteUsers(next));
};

export const handleRemoteUserJoinedAgora = (user) => {
    const previousUsers = getState().voiceChat.remoteUsers || [];
    if (!previousUsers.find((User) => User.uid == user.uid)) {
        const next = [
            ...previousUsers,
            {
                uid: user.uid,
                hasAudio: user.hasAudio,
                audioTrack: user.audioTrack,
                hasVideo: user.hasVideo,
                videoTrack: user.videoTrack,
            },
        ];
        dispatch(voiceChatSlice.actions.setRemoteUsers(next));
    }
};

export const handleLocalUserLeftAgora = async () => {
    removeLiveUserFromFirebase(getState().voiceChat.currAgoraUID);
    dispatch(voiceChatSlice.actions.setRemoteUsers([]));

    for (const localTrack of getLocalTracks()) {
        if (localTrack) {
            localTrack.stop();
            localTrack.close();
        }
    }

    const engine = getAgoraEngine();
    if (engine) {
        await engine.unpublish(getLocalTracks());
        await engine.leave();
    }

    dispatch(voiceChatSlice.actions.setLocalTracks(null));
    // user left the channel
    setCurrentVoiceChannel({ name: null, uid: null });
};

export const handleRemoteUserLeftAgora = (user) => {
    const previousUsers = getState().voiceChat.remoteUsers || [];
    const newArr = previousUsers.filter((User) => User.uid != user.uid);
    dispatch(voiceChatSlice.actions.setRemoteUsers(newArr));
};

export const addLiveUserToFirebase = (userData) => {
    const cv = getCurrentVoiceChannel();
    const userRef = doc(db, "voicechannels", cv.uid);
    getDoc(userRef).then((d) => {
        if (d.exists()) {
            const arr = d.data().liveUser || [];
            if (!arr.find((x) => x.firebaseUID == getCurrentUser().uid)) {
                updateDoc(userRef, {
                    liveUser: arrayUnion(userData),
                });
            }
        }
    });
};

export const removeLiveUserFromFirebase = (agoraID) => {
    const cv = getCurrentVoiceChannel();
    if (agoraID && cv && cv.uid) {
        const userRef = doc(db, "voicechannels", cv.uid);
        getDoc(userRef).then((d) => {
            if (d.exists()) {
                const arr = d.data().liveUser || [];
                if (arr.find((x) => x.uid == agoraID)) {
                    const deleteUser = arr.find((x) => x.uid == agoraID);
                    updateDoc(userRef, {
                        liveUser: arrayRemove(deleteUser),
                    });
                }
            }
        });
    }
};
