import React, { useEffect, useState, useRef, useCallback, Fragment } from 'react'
import Chat from './components/Chat/Chat'
import ServerList from './components/ServerList/ServerList'
import Channel from './components/Channel/Channel'
import FriendMenu from './components/FriendMenu/FriendMenu'

import { Box } from '@mui/system'
import { Routes, Route, useNavigate } from 'react-router-dom'

import LoginPage, { ResetPasswordPage } from './components/LoginPage/LoginPage'
import { RegisterPage } from './components/LoginPage/LoginPage'
import { onSnapshot, query, where, addDoc, collection, Timestamp, arrayUnion, setDoc, doc, getDocs, QuerySnapshot, updateDoc, getDoc, documentId, orderBy, limitToLast, arrayRemove } from 'firebase/firestore';
import { storage } from './firebase'
import { db, auth, realtimedb } from './firebase'
import { ref as realtimeRef, set, onValue, update, get } from 'firebase/database'



import { Outlet } from 'react-router-dom'
import FriendBody from './components/Friend/FriendBody/FriendBody'

import AgoraRTC from 'agora-rtc-sdk-ng';
import { AgoraClient, AgoraConfig } from './Agora'
// import { RtcRole } from "agora-token"
import { fetchToken } from './utils/fetchToken'

import VoiceChat from './components/Chat/VoiceChat/VoiceChat'
import { useDispatch, useSelector } from 'react-redux'
import ThemeContextProvider from './contexts/ThemeContextProvider'
import CssBaseline from '@mui/material/CssBaseline';
import { convertDateDivider } from './utils/formatter'
import { listenToAuthStateChange } from './utils/authentication'

import "./App.scss";

function App() {
    const dispatch = useDispatch()
    const { user, selectedServer, selectedChannel } = useSelector((state) => state.auth)
    const [imageDir, setImageDir] = useState("")
    const [friendList, setFriendList] = useState([])

    useEffect(() => {
        listenToAuthStateChange();
        return listenToAuthStateChange;
    }, [auth])

    // add new server image
    const handleUploadServerImage = async () => {
    }

    const [friendIds, setFriendIds] = useState([]);

    useEffect(() => {
        if (user.uid) {
            // const docRef = doc(collectionRef, user.uid)
            const docRef = query(collection(db, "users"), where("userId", "==", user.uid))

            const unsub = onSnapshot(docRef, (QuerySnapshot) => {
                let data = [];
                QuerySnapshot.forEach((doc) => {
                    data = doc.data().friends
                })
                setFriendIds(data)
            })

            // return unsub
        }

    }, [user.uid])

    //get user's friend list
    useEffect(() => {
        if (friendIds.length > 0) {
            const q = query(collection(db, "users"), where("userId", "in", friendIds))
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const friendList = [];
                snapshot.forEach((doc) => {
                    friendList.push({
                        displayName: doc.data().displayName,
                        profileURL: doc.data().profileURL,
                        status: doc.data().status,
                        userId: doc.data().userId
                    })
                })
                setFriendList(friendList)
            })

            // return unsubscribe
        }


    }, [friendIds])

    const [currentPrivateChannel, setCurrentPrivateChannel] = useState({ uid: null, name: null, status: null, avatar: null });
    const [channelRef, setChannelRef] = useState("")
    const [privateMessages, setPrivateMessages] = useState([])



    const handleOpenFriend = () => {
        setCurrentPrivateChannel({
            uid: null,
            name: null,
            status: null,
            avatar: null,
            createdAt: null,
        })
    }

    useEffect(() => {
        if (currentPrivateChannel) {
            const q = query(
                collection(db, "messages"),
                where("channelRef", "==", currentPrivateChannel.uid || ""),
                orderBy("createdAt"),
                limitToLast(20)
            );

            const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                let chatList = [];
                let previousUserRef = null;
                let previousDate = null;

                QuerySnapshot.forEach((doc) => {
                    const chatMessage = doc.data()
                    const currentDate = convertDateDivider(chatMessage.createdAt);

                    if (previousDate === null || currentDate != previousDate) {
                        chatList.push({ dividerDate: currentDate })
                    }
                    if (previousUserRef == null || currentDate != previousDate) {
                        chatList.push(chatMessage);
                    } else if (chatMessage.userRef === previousUserRef) {
                        chatList.push({
                            userName: null,
                            avatar: null,
                            createdAt: doc.data().createdAt,
                            type: doc.data().type,
                            fileName: null,
                            content: doc.data().content,
                            userRef: doc.data().userRef,
                            id: doc.id
                        });
                    } else {
                        chatList.push(chatMessage);
                    }

                    previousUserRef = chatMessage.userRef
                    previousDate = convertDateDivider(chatMessage.createdAt)
                });

                setPrivateMessages(chatList);
                //scroll new message
            });
        }
        // chatScroller.current.scrollIntoView({ behavior: "smooth" });
    }, [currentPrivateChannel]);

    const [voiceChat, setVoiceChat] = useState(false);
    const [currentVoiceChannel, setCurrentVoiceChannel] = useState({ name: null, uid: null })


    const [config, setConfig] = useState(AgoraConfig)

    const [agoraEngine, setAgoraEngine] = useState(AgoraClient);
    const screenShareRef = useRef(null)
    const [voiceConnected, setVoiceConnected] = useState(false);
    const [remoteUsers, setRemoteUsers] = useState([]);
    const [localTracks, setLocalTracks] = useState(null)
    const [currentAgoraUID, setCurrentAgoraUID] = useState(null)
    const [screenTrack, setScreenTrack] = useState(null);



    useEffect(() => {
        setConfig({ ...config, channel: currentVoiceChannel.uid })
    }, [currentVoiceChannel.uid])

    const [connectionState, setConnectionState] = useState({ state: null, reason: null })

    useEffect(() => {
        agoraEngine.on("token-privilege-will-expire", async function () {
            const token = await fetchToken(config);
            setConfig({ ...config, token: token })
            await agoraEngine.renewToken(config.token);
        });
        //enabled volume indicator
        agoraEngine.enableAudioVolumeIndicator();

        agoraEngine.on("volume-indicator", (volumes) => {
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



    useEffect(() => {

        const fetch = async () => {
            const token = await fetchToken()

            return new Promise((resolve, reject) => {
                resolve(token)
            })
        }

        if (config.channel) {

            fetch().then((token) => {
                agoraEngine.join(config.appId, config.channel, token, null)
                    .then((uid) => {
                        return Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid])
                    }).then(([tracks, uid]) => {

                        const [audioTrack, videoTrack] = tracks;

                        let data = {
                            firebaseUID: null,
                            uid: null,
                            name: null,
                            avatar: null
                        };

                        let userData = {}
                        //get Document for user in firebase
                        const userDoc = doc(db, "users", user.uid)

                        getDoc(userDoc).then((doc) => {
                            //if such document exist add its info to liveUser array
                            if (doc.exists()) {
                                data = {
                                    firebaseUID: doc.data().userId,
                                    uid: uid,
                                    name: doc.data().displayName,
                                    avatar: doc.data().profileURL,
                                    hasAudio: false,
                                    hasVideo: false,
                                }


                                addLiveUserToFirebase(data)

                                userData = {
                                    firebaseUID: user.uid,
                                    name: data.name,
                                    avatar: data.avatar,
                                    uid,
                                    videoTrack,
                                    audioTrack,
                                    hasVideo: false,
                                    hasAudio: false
                                }

                                setCurrentAgoraUID(uid)
                                setRemoteUsers((previousUsers) => {
                                    if (previousUsers !== undefined) {
                                        return [...previousUsers, userData]
                                    }
                                })

                                setLocalTracks(tracks)
                                agoraEngine.publish(tracks)

                                videoTrack.setEnabled(false);
                                audioTrack.setEnabled(false);
                                console.log("Tracks successfully published!")
                                setVoiceConnected(true)
                                setVoiceChat(true)
                            }
                        })



                    })

            });

        }

    }, [config.channel])

    const [stats, setStats] = useState(0)

    const getStats = () => {
        const stats = agoraEngine.getRTCStats()
        setStats(stats.RTT)
    }

    useEffect(() => {
        const interval = setInterval(getStats, 5000)
        return () => clearInterval(interval);
    }, [agoraEngine])

    const handleDefen = () => {
        setDefen(!defen)
        document.getElementsByTagName("video").muted = defen
    }

    return (
        <ThemeContextProvider>
            <CssBaseline />
            <Routes>
                <Route path="/"
                    element={
                        <LoginPage />
                    } />
                <Route path="/reset"
                    element={<ResetPasswordPage />} />
                <Route path="/register"
                    element={<RegisterPage />} />
                <Route element={
                    <Box className="app-mount">
                        <Box className="app-container" >
                            <Outlet />
                        </Box>
                    </Box>
                } >
                    <Route
                        path="/channels"
                        element={
                            <Fragment>
                                <ServerList />
                                <Outlet />
                            </Fragment>
                        }>
                        <Route
                            index
                            element={
                                <Fragment>
                                    <Channel
                                        voiceChat={voiceChat}
                                        setVoiceChat={setVoiceChat}
                                        currentVoiceChannel={currentVoiceChannel}
                                        setCurrentVoiceChannel={setCurrentVoiceChannel}
                                        voiceConnected={voiceConnected}
                                        stats={stats}
                                        connectionState={connectionState}
                                    />
                                    {
                                        voiceChat ?
                                            <VoiceChat
                                                voiceChat={voiceChat}
                                                currentVoiceChannel={currentVoiceChannel}
                                                config={config}
                                                remoteUsers={remoteUsers}
                                                setRemoteUsers={setRemoteUsers}
                                                currentAgoraUID={currentAgoraUID}
                                            />
                                            :
                                            <Chat />

                                    }
                                </Fragment>
                            }
                        />
                        <Route
                            path='/channels/@me'
                            element={
                                <Fragment>
                                    <FriendMenu friendList={friendList} friendIds={friendIds} currentPrivateChannel={currentPrivateChannel} handleOpenFriend={handleOpenFriend} />
                                    <FriendBody friendList={friendList} friendIds={friendIds} currentPrivateChannel={currentPrivateChannel} channelRef={channelRef} privateMessages={privateMessages} />
                                </Fragment>
                            } />
                    </Route>
                </Route>
            </Routes>
        </ThemeContextProvider>
    )
}

export default App;