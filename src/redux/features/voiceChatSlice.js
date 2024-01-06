// voiceChatSlice.js
import { createSlice } from '@reduxjs/toolkit';

const voiceChatSlice = createSlice({
    name: 'voiceChat',
    initialState: {
        isMuted: true,
        isDeafen: false,
        isCameraOn: false,
        isScreenSharingOn: false,
        isVoiceChatConnected: false,
        isVoiceChatPageOpen: false,
        agoraEngine: null,
        agoraConfig: {},
        screenShareRef: null,
        remoteUsers: [],
        localTracks: null,
        currAgoraUID: null,
        screenTrack: null,
        connectionState: {},
        latency: null,
        // Add other voice chat-related state here
    },
    reducers: {
        // Add other voice chat-related reducers here
        setIsMuted: (state, action) => {
            state.isMuted = action.payload;
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
        }
    },
});

export const {
    setIsCameraOn,
    setIsMuted,
    setIsDeafen,
    setIsSharingOn,
    setIsVoiceChatConnected,
    setIsScreenSharingOn,
    setAgoraEngine,
    setScreenShareRef,
    setRemoteUsers,
    setLocalTracks,
    setCurrentAgoraUID,
    setScreenTrack,
    setAgoraConfig,
    setIsVoiceChatPageOpen,
    setConnectionState,
    setLatency,
} = voiceChatSlice.actions;
export default voiceChatSlice.reducer;


export const handleUserSubscribe = async (user, mediaType) => {
    const id = user.uid
    await agoraEngine.subscribe(user, mediaType)
}

export const handleVolume = (volumes) => {
    setRemoteUsers((previousUsers) => {
        if (previousUsers) {
            return previousUsers.map(user => {
                if (user) {
                    const volume = volumes.find(v => v.uid == user.uid);
                    if (volume) {
                        return { ...user, volume: volume.level };
                    }
                    return user;
                }
            });
        }
    });
}


const handleUserUnpublishedFromAgora = (user, mediaType) => {
    updateFirebaseMediaStatus(user.uid, mediaType, false)

    if (mediaType === "audio") {
        setRemoteUsers((previousUsers) => {
            if (previousUsers !== undefined) {
                return (previousUsers.map((User) => {
                    if (User) {
                        if (User.uid == user.uid) {
                            return { ...User, hasAudio: false, audioTrack: null, uid: user.uid }
                        }
                        return User
                    }
                }))
            }
        });
    }

    if (mediaType === "video") {
        setRemoteUsers((previousUsers) => {
            if (previousUsers !== undefined) {
                return (previousUsers.map((User) => {
                    if (User) {
                        if (User.uid == user.uid) {
                            return { ...User, hasVideo: false, videoTrack: null, uid: user.uid }
                        }
                        return User
                    }
                }))
            }
        });
    }
}

export const updateFirebaseMediaStatus = (agoraID, mediaType, status) => {

    if (currentVoiceChannel.uid) {
        const voiceChannelRef = doc(db, "voicechannels", currentVoiceChannel.uid)

        getDoc(voiceChannelRef).then((doc) => {
            if (doc.exists()) {
                const arr = doc.data().liveUser
                const updateUser = arr.find(x => x.uid == agoraID)
                console.log(updateUser)
                if (updateUser) {
                    if (mediaType === "audio") {
                        updateUser.hasAudio = status;
                    }
                    if (mediaType === "video") {
                        updateUser.hasVideo = status;
                    }
                }

                updateDoc(voiceChannelRef, {
                    liveUser: arr
                })
            }
        })
    }
}

export const handleUserPublishedToAgora = (user, mediaType) => {

    updateFirebaseMediaStatus(user.uid, mediaType, true)

    setRemoteUsers((previousUsers) => {
        if (previousUsers !== undefined) {
            return (previousUsers.map((User) => {
                if (User) {
                    if (User.uid == user.uid) {
                        if (mediaType === "video") {
                            return { ...User, hasVideo: true, videoTrack: user.videoTrack, uid: user.uid }
                        }

                        if (mediaType === "audio") {
                            return { ...User, hasAudio: true, audioTrack: user.audioTrack, uid: user.uid }
                        }
                    }
                    return User
                }
            }))
        }
    })
}

export const handleRemoteUserJoinedAgora = (user) => {

    setRemoteUsers((previousUsers) => {
        if (previousUsers !== undefined) {
            if (previousUsers.find(User => User.uid != user.uid)) {
                return [...previousUsers, { uid: user.uid, hasAudio: user.hasAudio, audioTrack: user.audioTrack, hasVideo: user.hasVideo, videoTrack: user.videoTrack }]
            }
        }
    })
}

export const handleLocalUserLeftAgora = async () => {

    removeLiveUserFromFirebase(currentAgoraUID)
    setRemoteUsers([])

    for (const localTrack of localTracks) {
        localTrack.stop();
        localTrack.close();
    }

    await agoraEngine.unpublish(localTracks)
    await agoraEngine.leave()

    setLocalTracks(null)
    console.log("You left the channel");
    setCurrentVoiceChannel({ name: null, uid: null })
}

export const handleRemoteUserLeftAgora = (user) => {

    setRemoteUsers((previousUsers) => {
        if (previousUsers !== undefined) {
            const newArr = previousUsers.filter((User) => User.uid != user.uid)
            return newArr;
        }
    })

}

export const addLiveUserToFirebase = (userData) => {
    const userRef = doc(db, "voicechannels", currentVoiceChannel.uid)
    getDoc(userRef).then((doc) => {
        if (doc.exists()) {
            const arr = doc.data().liveUser;
            if (!arr.find(x => x.firebaseUID == currentUser.uid)) {
                updateDoc(userRef, {
                    liveUser: arrayUnion(userData)
                })
            }
        }
    })
}

export const removeLiveUserFromFirebase = (agoraID) => {
    if (agoraID && currentVoiceChannel.uid) {
        const userRef = doc(db, "voicechannels", currentVoiceChannel.uid)
        getDoc(userRef).then((doc) => {
            if (doc.exists()) {
                const arr = doc.data().liveUser;
                if (arr.find(x => x.uid == agoraID)) {
                    const deleteUser = arr.find(x => x.uid == agoraID)
                    console.log(deleteUser)
                    updateDoc(userRef, {
                        liveUser: arrayRemove(deleteUser)
                    })
                }
            }
        })
    }
}