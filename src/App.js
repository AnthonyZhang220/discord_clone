import React, { useEffect, useState, useRef, useCallback } from 'react'
import Chat from './Chat/Chat'
import ServerList from './ServerList/ServerList'
import Channel from './Channel/Channel'
import FriendMenu from './FriendMenu/FriendMenu'

import { Box } from '@mui/system'
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Avatar, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material'


import LoginPage, { ResetPasswordPage } from './LoginPage/LoginPage'
import { RegisterPage } from './LoginPage/LoginPage'
import { onSnapshot, query, where, addDoc, collection, Timestamp, arrayUnion, setDoc, doc, getDocs, QuerySnapshot, updateDoc, getDoc, documentId, orderBy, limitToLast, arrayRemove } from 'firebase/firestore';
import { storage } from './firebase'
import { db, auth, realtimedb } from './firebase'
import { ref as realtimeRef, set, onValue, update, get } from 'firebase/database'
import { uploadBytesResumable, uploadBytes, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { FacebookAuthProvider } from "firebase/auth";
import { TwitterAuthProvider } from "firebase/auth";
import { GithubAuthProvider } from "firebase/auth";
import { Outlet } from 'react-router-dom'
import FriendBody from './FriendBody/FriendBody'

import AgoraRTC from 'agora-rtc-sdk-ng';
import { AgoraClient, AgoraConfig } from './Agora'
// import { RtcRole } from "agora-token"
import axios from "axios"

import "./App.scss";


let theme = createTheme({
    typography: {
        fontFamily: ["gg sans", "gg sans Normal", "gg sans Medium", "gg sans SemiBold", "sans-serif"].join(","),
        h3: {
            fontSize: 24,
            color: "#f2f3f5",
        },
        h4: {
            fontSize: 20,
            color: "#f2f3f5",
        },
        h5: {
            fontSize: 18,
            color: "#f2f3f5",
        },
        h6: {
            fontSize: 14,
        },
        p: {
            fontSize: 16,
            color: "#f2f3f5",
        },
        body1: {
            fontFamily: "gg sans SemiBold",
            fontSize: 16,
            color: "#f2f3f5",
        },
        body2: {
            fontFamily: "gg sans Normal",
            fontSize: 14,
            color: "#f2f3f5",
        }
    },
    components: {
        MuiIconButton: {
            defaultProps: {
                color: 'secondary'
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: "bold"
                },
            },
        },
    },
    palette: {
        primary: {
            main: "#b8b9bf",
        },
        secondary: {
            main: '#b8b9bf',
        },
    },
});

theme = responsiveFontSizes(theme);

//google signin
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, onAuthStateChanged } from 'firebase/auth';
import VoiceChat from './VoiceChat/VoiceChat'



const App = () => {
    const navigate = useNavigate();
    // const [user] = useAuthState(auth);
    const GoogleProvider = new GoogleAuthProvider();
    const FacebookProvider = new FacebookAuthProvider();
    const TwitterProvider = new TwitterAuthProvider();
    const GithubProvider = new GithubAuthProvider();

    //show modal for new server/channel
    const [channelModal, setChannelModal] = React.useState(false);
    const [serverModal, setServerModal] = React.useState(false);

    //store server/channel list for UI render

    //add new server/channel
    const [newChannel, setNewChannel] = React.useState("")
    const [newServerInfo, setNewServerInfo] = React.useState({ name: "", serverPic: "" });
    const [serverURL, setServerURL] = React.useState(null);
    const [file, setFile] = React.useState(null);

    //current Login USER/SERVER/CHANNEL
    const [currentUser, setCurrentUser] = React.useState({ name: null, profileURL: null, uid: null, createdAt: null });
    const [currentServer, setCurrentServer] = React.useState({ name: "", uid: null });
    const [currentChannel, setCurrentChannel] = React.useState({ name: "", uid: null });
    const [currentMessage, setCurrentMessage] = React.useState("");

    const [imageDir, setImageDir] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false);

    const [friendList, setFriendList] = React.useState([])




    //google sign in with redirect
    const googleSignIn = () => {
        // This will trigger a full page redirect away from your app
        signInWithRedirect(auth, GoogleProvider)
    }

    const facebookSignIn = () => {
        signInWithRedirect(auth, FacebookProvider)
    }

    const twitterSignIn = () => {
        signInWithRedirect(auth, TwitterProvider)
    }
    const githubSignIn = () => {
        signInWithRedirect(auth, GithubProvider)
    }

    //auth/login state change
    React.useEffect(() => {
        const loginState = onAuthStateChanged(auth, (user) => {
            console.log(user)
            if (user) {
                const userRef = doc(db, "users", user.uid);

                getDoc(userRef).then((doc) => {
                    const has = doc.exists();
                    if (has) {
                        setCurrentUser({ name: doc.data().displayName, profileURL: doc.data().profileURL, uid: doc.data().userId, createdAt: doc.data().createdAt.seconds, status: doc.data().status })
                    } else {
                        setDoc(userRef, {
                            displayName: user.displayName,
                            email: user.email ? user.email : "",
                            profileURL: user.photoURL,
                            userId: user.uid,
                            createdAt: Timestamp.fromDate(new Date()),
                            status: "online",
                            friends: [],
                        }).then((doc) => {
                            setCurrentUser({ name: doc.data().displayName, profileURL: doc.data().profileURL, uid: doc.data().userId, createdAt: doc.data().createdAt.seconds, status: doc.data().status })
                        })
                    }
                })


                //if user not in the storage, add to the local storage
                if (!localStorage.getItem(`${user.uid}`)) {
                    localStorage.setItem(`${user.uid}`, JSON.stringify({ defaultServer: "", defaultServerName: "", userDefault: [] }));
                } else {
                    const storage = JSON.parse(localStorage.getItem(`${user.uid}`))
                    setCurrentServer({ name: storage.defaultServerName, uid: storage.defaultServer })
                    setCurrentChannel({ name: storage.userDefault.lengh == 0 ? "" : storage.userDefault.find(x => x.currentServer == storage.defaultServer).currentChannelName, uid: storage.userDefault.find(x => x.currentServer == storage.defaultServer).currentChannel })
                }
                navigate('/channels')
            } else {
                updateDoc(doc(db, "users", currentUser.uid), {
                    status: "offline",
                })
                setCurrentUser({ name: null, profileURL: null, uid: null, status: null })
                navigate('/')

            }

        })

        return () => {
            loginState();
        }

    }, [auth])


    //auth sign out function
    const signOut = () => {
        auth.signOut().then(() => {

            const userRef = doc(db, "users", currentUser.uid)
            updateDoc(userRef, {
                status: "offline"
            })
            setCurrentUser({ name: null, profileURL: null, uid: null, createdAt: null })
        }).then(() => {
            navigate("/", { replace: true })
        })
    }


    const handleCurrentServer = (serverName, serverUid) => {

        const userItem = JSON.parse(localStorage.getItem(`${currentUser.uid}`));
        const userArray = userItem.userDefault;
        const foundDefaultChannel = userArray.find(obj => obj.currentServer === serverUid)

        localStorage.setItem(`${currentUser.uid}`, JSON.stringify({ ...userItem, defaultServer: serverUid, defaultServerName: serverName }))

        if (foundDefaultChannel == undefined) {
            const newServerObj = {
                currentServer: serverUid,
                currentChannel: null,
                currentChannelName: null,
            }
            userArray.push(newServerObj);

            localStorage.setItem(`${currentUser.uid}`, JSON.stringify({ ...userItem, userDefault: userArray }))
        } else {
            if (userArray.length !== 0) {
                userArray.forEach((obj) => {
                    if (obj.currentServer === serverUid) {
                        setCurrentChannel({ name: obj.currentChannelName, uid: obj.currentChannel })
                    }
                })
            }
        }


        setCurrentServer({ name: serverName, uid: serverUid })
        navigate("/channels")

    }


    const handleCurrentChannel = (channelName, channelUid) => {


        const userItem = JSON.parse(localStorage.getItem(`${currentUser.uid}`))
        const userArray = userItem.userDefault;
        if (userArray.length !== 0) {
            userArray.forEach((obj) => {
                if (obj.currentServer === currentServer.uid) {
                    obj.currentChannel = channelUid;
                    obj.currentChannelName = channelName;
                }
            })
        }

        localStorage.setItem(`${currentUser.uid}`, JSON.stringify({ ...userItem, userDefault: userArray }))

        setCurrentChannel({ name: channelName, uid: channelUid })
    }


    const handleChannelModalClose = () => {
        setChannelModal(false);
    }
    const handleServerModalClose = () => {
        setServerModal(false);
    }



    // add new server image
    const handleUploadServerImage = async () => {
    }



    const [openCreate, setOpenCreate] = React.useState(false);
    //add new Server with handleUploadServerImage();
    const handleAddServer = async () => {
        setIsLoading(true)
        // Create the file metadata
        /** @type {any} */
        const metadata = {
            contentType: "image/*"
        }

        const fileName = file.name;

        const date = new Date();
        const timeString = date.toISOString();

        // Upload file and metadata to the object 'images/mountains.jpg'
        const serverProfileRef = storageRef(storage, `serverProfile/${currentUser.uid}/${fileName}-${timeString}`, metadata);

        const uploadProgress = await uploadBytes(serverProfileRef, file)
        const url = await getDownloadURL(serverProfileRef)

        const serverDoc = collection(db, "servers");
        const channelDoc = collection(db, "channels");

        //upload image
        await addDoc(serverDoc, {
            serverPic: url,
            name: newServerInfo.name,
            ownerId: currentUser.uid,
            createdAt: Timestamp.fromDate(new Date()),
            members: [currentUser.uid],
        }).then((doc) => {
            addDoc(channelDoc, {
                name: "general",
                serverRef: doc.id,
                createdAt: Timestamp.fromDate(new Date()),
                messages: [],
            }).then(() => {
                setIsLoading(false);
                setNewServerInfo({ name: "", serverPic: "" })
                setServerURL(null);
                setFile(null);
                handleServerModalClose();
                setOpenCreate(false)

            })

        })

    }

    const [currentPrivateMessage, setCurrentPrivateMessage] = React.useState("")

    const handleChannelInfo = (e) => {
        setNewChannel(e.target.value)
    }

    const handleChatInfo = (e) => {
        setCurrentMessage(e.target.value);
    }
    const handlePrivateChatInfo = (e) => {
        setCurrentPrivateMessage(e.target.value);
    }


    //add new channel to db
    const handleAddChannel = async () => {

        await addDoc(collection(db, "channels"), {
            name: newChannel,
            serverRef: currentServer.uid,
            createdAt: Timestamp.fromDate(new Date()),
            messages: [],
        }).then(() => {
            setNewChannel("")
            handleChannelModalClose();
        })

    }

    //add new message to db
    const handleAddPrivateMessage = async (e) => {
        e.preventDefault();

        if (currentPrivateMessage.trim() == "") {
            return;
        }

        const { uid, displayName, photoURL } = auth.currentUser;

        await addDoc(collection(db, "messages"), {
            type: "text",
            content: currentPrivateMessage,
            fileName: "",
            userName: displayName,
            avatar: photoURL,
            createdAt: Timestamp.fromDate(new Date()),
            channelRef: currentPrivateChannel.uid,
            serverRef: currentServer.uid,
            userRef: uid,
        }).then(() => {
            setCurrentMessage("")
        })
    }
    //add new message to db
    const handleAddMessage = async (e) => {
        e.preventDefault();

        if (currentMessage.trim() == "") {
            return;
        }

        const { uid, displayName, photoURL } = auth.currentUser;

        await addDoc(collection(db, "messages"), {
            type: "text",
            content: currentMessage,
            fileName: "",
            userName: displayName,
            avatar: photoURL,
            createdAt: Timestamp.fromDate(new Date()),
            channelRef: currentChannel.uid,
            serverRef: currentServer.uid,
            userRef: uid,
        }).then(() => {
            setCurrentMessage("")
        })
    }




    const [friendIds, setFriendIds] = React.useState([]);

    React.useEffect(() => {
        if (currentUser.uid) {
            // const docRef = doc(collectionRef, currentUser.uid)
            const docRef = query(collection(db, "users"), where("userId", "==", currentUser.uid))

            const unsub = onSnapshot(docRef, (QuerySnapshot) => {
                let data = [];
                QuerySnapshot.forEach((doc) => {
                    data = doc.data().friends
                })
                setFriendIds(data)
            })

            // return unsub
        }

    }, [currentUser.uid])

    //get user's friend list
    React.useEffect(() => {

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

    const [currentPrivateChannel, setCurrentPrivateChannel] = React.useState({ uid: null, name: null, status: null, avatar: null });
    const [channelRef, setChannelRef] = React.useState("")
    const [privateMessages, setPrivateMessages] = React.useState([])

    const handleCurrentPrivateChannel = async (channelId) => {

        const q = query(collection(db, "privatechannels"), where("memberRef", "array-contains", currentUser.uid))

        let userRef = [];
        const docRef = await getDocs(q)
        docRef.forEach((doc) => {
            userRef = doc.data().memberRef
        })


        let userId = "";
        if (userRef[0] === currentUser.uid) {
            userId = userRef[1]
        } else if (userRef[1] === currentUser.uid) {
            userId = userRef[0]
        }
        const resRef = doc(db, "users", userId)
        const queryRef = await getDoc(resRef);

        setCurrentPrivateChannel({
            uid: queryRef.data().userId,
            name: queryRef.data().displayName,
            status: queryRef.data().status,
            avatar: queryRef.data().profileURL,
            createdAt: queryRef.data().createdAt.seconds,
        })

        setChannelRef(channelRef);
    }

    const handleOpenFriend = () => {
        setCurrentPrivateChannel({
            uid: null,
            name: null,
            status: null,
            avatar: null,
            createdAt: null,
        })
    }


    const convertDateDivider = (date) => {
        const newDate = new Date(date.seconds * 1000)
        const formattedDate = newDate.toLocaleDateString('en-US', { month: "long", day: "numeric", year: "numeric" })
        const now = new Date();
        const timeDiff = Math.abs(now.getTime() - newDate.getTime())

        const oneDay = 24 * 60 * 60 * 1000;

        const millisecondsInCurrentDay = now.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        return formattedDate;
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

    const [voiceChat, setVoiceChat] = React.useState(false);
    const [currentVoiceChannel, setCurrentVoiceChannel] = React.useState({ name: null, uid: null })


    const [config, setConfig] = useState(AgoraConfig)

    const [isSharingEnabled, setIsSharingEnabled] = useState(false)
    const [isMutedVideo, setIsMutedVideo] = useState(true)
    const [agoraEngine, setAgoraEngine] = useState(AgoraClient);
    const screenShareRef = useRef(null)
    const [voiceConnected, setVoiceConnected] = useState(false);
    const [liveUsers, setLiveUsers] = useState([]);
    const [localTracks, setLocalTracks] = useState(null)
    const [currentAgoraUID, setCurrentAgoraUID] = useState(null)
    const [screenTrack, setScreenTrack] = useState(null);

    const FetchToken = async () => {
        return new Promise(function (resolve) {
            if (config.channel) {
                axios.get(config.serverUrl + '/rtc/' + config.channel + '/1/uid/' + "0" + '/?expiry=' + config.ExpireTime)
                    .then(
                        response => {
                            console.log(response.data.rtcToken);
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

    useEffect(() => {

        agoraEngine.on("token-privilege-will-expire", async function () {
            const token = await FetchToken();
            setConfig({ ...config, token: token })
            await agoraEngine.renewToken(config.token);
        });

        agoraEngine.enableAudioVolumeIndicator();

        agoraEngine.on("volume-indicator", volumes => {
            setLiveUsers((previousUsers) => {
                return previousUsers.map(user => {
                    const volume = volumes.find(v => v.uid === user.uid);
                    if (volume) {
                        return { ...user, volume: volume.level };
                    }
                    return user;
                });
            });
        })

        agoraEngine.on("user-published", async (user, mediaType) => {
            await agoraEngine.subscribe(user, mediaType)

            if (mediaType == "video") {
                setLiveUsers((previousUsers) => [...previousUsers, user])
            }

            if (mediaType == "audio") {

            }

            setVoiceChat(true)
            handleUserJoined(user, mediaType)

        });

        agoraEngine.on("user-joined", async (user) => {

        })

        agoraEngine.on("user-left", async (user) => {

        })


        agoraEngine.on("user-unpublished", async (user, mediaType) => {
            console.log(user.uid + "has left the channel");
            setLiveUsers((previousUsers) =>
                previousUsers.filter((obj) => obj.uid != user.uid)
            );

        });

        // agoraEngine.on("user-left", async (user, mediaType) => {
        //     await handleUserLeft(user, mediaType)
        // })

        return () => {
            for (const localTrack of localTracks) {
                localTrack.stop();
                localTrack.close();
            }
            agoraEngine.off("user-published", handleUserJoined)
            agoraEngine.off("user-left", handleUserLeft)
            agoraEngine.unpublish(tracks).then(() => agoraEngine.leave())
            agoraEngine?.destroy();
        }

    }, []);

    useEffect(() => {

        const fetch = async () => {
            const token = await FetchToken()

            return new Promise((resolve, reject) => {
                resolve(token)
            })
        }

        if (config.channel) {

            fetch().then((token) => {
                setVoiceChat(true)
                agoraEngine.join(config.appId, config.channel, token, null)
                    .then((uid) => {
                        return Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid])
                    }).then(([tracks, uid]) => {
                        setCurrentAgoraUID(uid)

                        addLiveUser(uid)

                        const [audioTrack, videoTrack] = tracks;

                        setLiveUsers((previousUsers) => [...previousUsers, {
                            firebaseUID: currentUser.uid,
                            uid,
                            videoTrack,
                            audioTrack
                        }])

                        videoTrack.setEnabled(false);
                        audioTrack.setMuted(true);
                        setLocalTracks(tracks)
                        agoraEngine.publish(tracks)
                        console.log("Tracks successfully published!")
                        setVoiceConnected(true)
                    })

            });

        }

    }, [config.channel])

    const addLiveUser = (uid) => {
        const userRef = doc(db, "voicechannels", currentVoiceChannel.uid)
        getDoc(userRef).then((doc) => {
            if (doc.exists()) {
                const arr = doc.data().liveUser;
                if (!arr.find(x => x.userId === currentUser.uid)) {
                    updateDoc(userRef, {
                        liveUser: arrayUnion({ displayName: currentUser.name, profileURL: currentUser.profileURL, userId: currentUser.uid, agoraUID: uid })
                    })
                }
            }
        })
    }

    const removeLiveUser = () => {
        if (currentVoiceChannel.uid) {
            const userRef = doc(db, "voicechannels", currentVoiceChannel.uid)
            getDoc(userRef).then((doc) => {
                if (doc.exists()) {
                    const arr = doc.data().liveUser;
                    if (arr.find(x => x.userId === currentUser.uid)) {
                        updateDoc(userRef, {
                            liveUser: arrayRemove({ displayName: currentUser.name, profileURL: currentUser.profileURL, userId: currentUser.uid, agoraUID: currentAgoraUID })
                        })
                    }
                }
            })
        }
    }


    const [stats, setStats] = useState(0)

    const getStats = () => {
        const stats = agoraEngine.getRTCStats()
        setStats(stats.RTT)
    }

    useEffect(() => {
        const interval = setInterval(getStats, 5000)
        return () => clearInterval(interval);
    }, [agoraEngine])


    const screenShareToggle = async () => {
        const screenTrack = await AgoraRTC.createScreenVideoTrack({ displaySurface: "browser" }, "auto");
        const [video, audio] = screenTrack;

        if (isSharingEnabled == false) {
            // Create a screen track for screen sharing.
            // Replace the video track with the screen track.
            await agoraEngine.publish([video, audio])
            // Update the screen sharing state.
            setIsSharingEnabled(true);
        } else {
            // Replace the screen track with the local video track.
            await agoraEngine.unpublish([video, audio])
            setIsSharingEnabled(false);
        }
    }

    const handleUserJoined = () => {

    }

    const handleUserLeft = async (user) => {

        removeLiveUser()

        await agoraEngine?.leave();
        setVoiceConnected(false)
        console.log("You left the channel");
    }


    const handleDefen = () => {
        setDefen(!defen)
        document.getElementsByTagName("video").muted = defen
    }

    const handleVideoMuted = async () => {

        const [audio, video] = localTracks

        if (isMutedVideo == false) {
            // Mute the local video.
            await video.setEnbled(true);
            setIsMutedVideo(true)
        } else {
            // Unmute the local video.
            await video.setEnbled(false);
            setIsMutedVideo(false)
        }
    }

    const handleVoiceMuted = async () => {
        const [audio, video] = localTracks

        if (muted == false) {
            // Mute the local video. 
            await audio.setMuted(true);
            setMuted(true)
        } else {
            // Unmute the local video.
            await audio.setMuted(false);
            setMuted(false)
        }

    }

    const [muted, setMuted] = React.useState(true);
    const [defen, setDefen] = React.useState(false);

    return (
        <ThemeProvider theme={theme}>
            {/* <CssBaseline /> */}
            <Routes>
                <Route path="/"
                    element={
                        <LoginPage
                            googleSignIn={googleSignIn}
                            facebookSignIn={facebookSignIn}
                            twitterSignIn={twitterSignIn}
                            githubSignIn={githubSignIn}
                            setCurrentUser={setCurrentUser}
                        />
                    } />
                <Route path="/reset"
                    element={<ResetPasswordPage />} />
                <Route path="/register"
                    element={<RegisterPage currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
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
                            <React.Fragment>
                                <ServerList
                                    handleAddServer={handleAddServer}
                                    handleCurrentServer={handleCurrentServer}
                                    setCurrentServer={setCurrentChannel}
                                    currentUser={currentUser}
                                    currentServer={currentServer}
                                    setServerModal={setServerModal}
                                    serverModal={serverModal}
                                    file={file}
                                    setFile={setFile}
                                    serverURL={serverURL}
                                    setServerURL={setServerURL}
                                    openCreate={openCreate}
                                    setOpenCreate={setOpenCreate}
                                    isLoading={isLoading}
                                    newServerInfo={newServerInfo}
                                    setNewServerInfo={setNewServerInfo}
                                />
                                <Outlet />
                            </React.Fragment>
                        }>
                        <Route
                            index
                            element={
                                <React.Fragment>
                                    <Channel
                                        currentServer={currentServer}
                                        setCurrentServer={setCurrentServer}
                                        currentUser={currentUser}
                                        currentChannel={currentChannel}
                                        setCurrentUser={setCurrentUser}
                                        signOut={signOut}
                                        handleAddChannel={handleAddChannel}
                                        handleCurrentChannel={handleCurrentChannel}
                                        channelModal={channelModal}
                                        setChannelModal={setChannelModal}
                                        handleChannelInfo={handleChannelInfo}
                                        newChannel={newChannel}
                                        voiceChat={voiceChat}
                                        setVoiceChat={setVoiceChat}
                                        currentVoiceChannel={currentVoiceChannel}
                                        setCurrentVoiceChannel={setCurrentVoiceChannel}
                                        handleUserJoined={handleUserJoined}
                                        handleUserLeft={handleUserLeft}
                                        muted={muted}
                                        defen={defen}
                                        handleDefen={handleDefen}
                                        handleVideoMuted={handleVideoMuted}
                                        handleVoiceMuted={handleVoiceMuted}
                                        voiceConnected={voiceConnected}
                                        isSharingEnabled={isSharingEnabled}
                                        isMutedVideo={isMutedVideo}
                                        screenShareToggle={screenShareToggle}
                                        stats={stats}
                                    />
                                    {
                                        voiceChat ?
                                            <VoiceChat
                                                voiceChat={voiceChat}
                                                currentVoiceChannel={currentVoiceChannel}
                                                config={config}
                                                currentUser={currentUser}
                                                isMutedVideo={isMutedVideo}
                                                liveUsers={liveUsers}
                                            />
                                            :
                                            <Chat
                                                currentUser={currentUser}
                                                currentServer={currentServer}
                                                currentChannel={currentChannel}
                                                handleAddMessage={handleAddMessage}
                                                handleChatInfo={handleChatInfo}
                                                currentMessage={currentMessage}
                                            />

                                    }
                                </React.Fragment>
                            }
                        />
                        <Route
                            path='/channels/@me'
                            element={
                                <React.Fragment>
                                    <FriendMenu friendList={friendList} currentUser={currentUser} friendIds={friendIds} signOut={signOut} setCurrentUser={setCurrentUser} currentPrivateChannel={currentPrivateChannel} handleOpenFriend={handleOpenFriend} handleCurrentPrivateChannel={handleCurrentPrivateChannel} muted={muted}
                                        defen={defen} handleDefen={handleDefen}
                                        handleVideoMuted={handleVideoMuted} />
                                    <FriendBody friendList={friendList} currentUser={currentUser} friendIds={friendIds} currentPrivateChannel={currentPrivateChannel} handleCurrentPrivateChannel={handleCurrentPrivateChannel} channelRef={channelRef} privateMessages={privateMessages} currentPrivateMessage={currentPrivateMessage} handlePrivateChatInfo={handlePrivateChatInfo} handleAddPrivateMessage={handleAddPrivateMessage} />
                                </React.Fragment>
                            } />

                    </Route>
                </Route>
            </Routes>
        </ThemeProvider>
    )
}

export default App