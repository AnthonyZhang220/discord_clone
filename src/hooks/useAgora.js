import React, { useEffect } from 'react'

function useAgora() {
    useEffect(() => {
        agoraEngine.on("token-privilege-will-expire", async function () {
            const token = await FetchToken();
            setConfig({ ...config, token: token })
            await agoraEngine.renewToken(config.token);
        });
        //enabled volume indicator
        agoraEngine.enableAudioVolumeIndicator();

        agoraEngine.on("volume-indicator", (volumes) => {
            handleVolume(volumes)
        })
        agoraEngine.on("user-published", (user, mediaType) => {
            console.log(user.uid + "published");
            handleUserSubscribe(user, mediaType)
            handleUserPublishedToAgora(user, mediaType)
        });
        agoraEngine.on("user-joined", (user) => {
            handleRemoteUserJoinedAgora(user)
        })
        agoraEngine.on("user-left", (user) => {
            console.log(user.uid + "has left the channel");
            handleRemoteUserLeftAgora(user)
        })
        agoraEngine.on("user-unpublished", (user, mediaType) => {
            console.log(user.uid + "unpublished");
            handleUserUnpublishedFromAgora(user, mediaType)
        });

        agoraEngine.on("connection-state-change", (currentState, prevState, reason) => {
            setConnectionState({ state: currentState, reason: reason })
        })

        return () => {
            removeLiveUserFromFirebase(currentAgoraUID)

            for (const localTrack of localTracks) {
                localTrack.stop();
                localTrack.close();
            }
            agoraEngine.off("user-published", handleRemoteUserJoinedAgora)
            agoraEngine.off("user-left", handleRemoteUserLeftAgora)
            agoraEngine.unpublish(localTracks).then(() => agoraEngine.leave())
        }

    }, []);

    const FetchToken = async () => {
        return new Promise(function (resolve) {
            if (config.channel) {
                axios.get(config.serverUrl + '/rtc/' + config.channel + '/1/uid/' + "0" + '/?expiry=' + config.ExpireTime)
                    .then(
                        response => {
                            resolve(response.data.rtcToken);
                        })
                    .catch(error => {
                        console.log(error);
                    });
            }
        });
    }

    useEffect(() => {
        setConfig({ ...config, channel: currentVoiceChannel.uid })
    }, [currentVoiceChannel.uid])

    const [connectionState, setConnectionState] = useState({ state: null, reason: null })



    const handleUserSubscribe = async (user, mediaType) => {
        const id = user.uid
        await agoraEngine.subscribe(user, mediaType)
    }

    const handleVolume = (volumes) => {
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

    useEffect(() => {
        // constantly monitor the state change of user, audio, video
        if (currentVoiceChannel.uid) {
            const voiceChannelRef = doc(db, "voicechannels", currentVoiceChannel.uid)
            const snapshot = onSnapshot(voiceChannelRef, (doc) => {
                const list = doc.data().liveUser
                if (list && list.length != 0) {
                    list.forEach((User) => {
                        setRemoteUsers((previousUser) => {
                            if (previousUser != undefined) {
                                return previousUser.map((user) => {
                                    if (user.uid == User.uid) {
                                        return { ...user, name: User.name, hasAudio: User.hasAudio, hasVideo: User.hasVideo }
                                    }
                                    return user;
                                })
                            }
                        })
                    })
                }
            })
        }
    }, [remoteUsers, config.channel])

    const updateFirebaseMediaStatus = (agoraID, mediaType, status) => {

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

    const handleUserPublishedToAgora = (user, mediaType) => {

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

    const handleRemoteUserJoinedAgora = (user) => {

        setRemoteUsers((previousUsers) => {
            if (previousUsers !== undefined) {
                if (previousUsers.find(User => User.uid != user.uid)) {
                    return [...previousUsers, { uid: user.uid, hasAudio: user.hasAudio, audioTrack: user.audioTrack, hasVideo: user.hasVideo, videoTrack: user.videoTrack }]
                }
            }
        })
    }

    useEffect(() => {
        console.log(remoteUsers)
    }, [remoteUsers])

    const handleLocalUserLeftAgora = async () => {

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

    const handleRemoteUserLeftAgora = (user) => {

        setRemoteUsers((previousUsers) => {
            if (previousUsers !== undefined) {
                const newArr = previousUsers.filter((User) => User.uid != user.uid)
                return newArr;
            }
        })

    }

    const addLiveUserToFirebase = (userData) => {
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

    const removeLiveUserFromFirebase = (agoraID) => {
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
    return []
}

export default useAgora