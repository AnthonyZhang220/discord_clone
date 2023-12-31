import React, { useEffect, useState, useRef, useCallback, Fragment } from 'react'
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
import { ElevatorSharp, FormatListBulletedOutlined } from '@mui/icons-material'



const App = () => {
    const navigate = useNavigate();
    // const [user] = useAuthState(auth);
    const GoogleProvider = new GoogleAuthProvider();
    const FacebookProvider = new FacebookAuthProvider();
    const TwitterProvider = new TwitterAuthProvider();
    const GithubProvider = new GithubAuthProvider();

    //show modal for new server/channel
    const [channelModal, setChannelModal] = useState(false);
    const [serverModal, setServerModal] = useState(false);

    //store server/channel list for UI render

    //add new server/channel
    const [newChannel, setNewChannel] = useState("")
    const [newServerInfo, setNewServerInfo] = useState({ name: "", serverPic: "" });
    const [serverURL, setServerURL] = useState(null);
    const [file, setFile] = useState(null);

    //current Login USER/SERVER/CHANNEL
    const [currentUser, setCurrentUser] = useState({ name: null, profileURL: null, uid: null, createdAt: null });
    const [currentServer, setCurrentServer] = useState({ name: "", uid: null });
    const [currentChannel, setCurrentChannel] = useState({ name: "", uid: null });
    const [currentMessage, setCurrentMessage] = useState("");

    const [imageDir, setImageDir] = useState("")
    const [isLoading, setIsLoading] = useState(false);

    const [friendList, setFriendList] = useState([])




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
    useEffect(() => {
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



    const [openCreate, setOpenCreate] = useState(false);
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

    const [currentPrivateMessage, setCurrentPrivateMessage] = useState("")

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




    const [friendIds, setFriendIds] = useState([]);

    useEffect(() => {
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

    const [voiceChat, setVoiceChat] = useState(false);
    const [currentVoiceChannel, setCurrentVoiceChannel] = useState({ name: null, uid: null })


    const [config, setConfig] = useState(AgoraConfig)

    const [isSharingEnabled, setIsSharingEnabled] = useState(false)
    const [isMutedVideo, setIsMutedVideo] = useState(true)
    const [agoraEngine, setAgoraEngine] = useState(AgoraClient);
    const screenShareRef = useRef(null)
    const [voiceConnected, setVoiceConnected] = useState(false);
    const [remoteUsers, setRemoteUsers] = useState([]);
    const [localTracks, setLocalTracks] = useState(null)
    const [currentAgoraUID, setCurrentAgoraUID] = useState(null)
    const [screenTrack, setScreenTrack] = useState(null);

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

    useEffect(() => {

        const fetch = async () => {
            const token = await FetchToken()

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
                        //get Document for currentUser in firebase
                        const userDoc = doc(db, "users", currentUser.uid)

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
                                    firebaseUID: currentUser.uid,
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


    const screenShareToggle = async () => {
        console.log(localTracks)

        if (isSharingEnabled == false) {
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
            setIsSharingEnabled(true);
        } else {
            const videoTrack = await AgoraRTC.createMicrophoneAndCameraTracks();
            const [video, audio] = videoTrack
            // await screenTrack.replaceTrack(videoTrack, true)
            await agoraEngine.unpublish(screenTrack)
            await agoraEngine.publish([video, audio])
            // Replace the screen track with the local video track.
            setIsSharingEnabled(false);
        }
    }

    const handleDefen = () => {
        setDefen(!defen)
        document.getElementsByTagName("video").muted = defen
    }

    const handleVideoMuted = async () => {

        const [audio, video] = localTracks

        if (isMutedVideo == false) {
            // Mute the local video.
            updateFirebaseMediaStatus(currentAgoraUID, "video", false)
            agoraEngine && await video.setEnabled(false);
            setIsMutedVideo(true);
        } else {
            // Unmute the local video.
            updateFirebaseMediaStatus(currentAgoraUID, "video", true)
            agoraEngine && await video.setEnabled(true);
            setIsMutedVideo(false)
        }
    }

    useEffect(() => {
        console.log(remoteUsers)
    }, [remoteUsers])

    const handleVoiceMuted = async () => {
        const [audio, video] = localTracks

        if (muted == false) {
            // Mute the local video. 
            updateFirebaseMediaStatus(currentAgoraUID, "audio", false)
            agoraEngine && await audio.setEnabled(false);


            setMuted(true)
        } else {
            // Unmute the local video.
            updateFirebaseMediaStatus(currentAgoraUID, "audio", true)
            agoraEngine && await audio.setEnabled(true);

            setMuted(false)
        }

    }

    const [muted, setMuted] = useState(true);
    const [defen, setDefen] = useState(false);

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
                            <Fragment>
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
                            </Fragment>
                        }>
                        <Route
                            index
                            element={
                                <Fragment>
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
                                        handleLocalUserLeftAgora={handleLocalUserLeftAgora}
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
                                        connectionState={connectionState}
                                    />
                                    {
                                        voiceChat ?
                                            <VoiceChat
                                                voiceChat={voiceChat}
                                                currentVoiceChannel={currentVoiceChannel}
                                                config={config}
                                                currentUser={currentUser}
                                                isMutedVideo={isMutedVideo}
                                                remoteUsers={remoteUsers}
                                                setRemoteUsers={setRemoteUsers}
                                                currentAgoraUID={currentAgoraUID}
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
                                </Fragment>
                            }
                        />
                        <Route
                            path='/channels/@me'
                            element={
                                <Fragment>
                                    <FriendMenu friendList={friendList} currentUser={currentUser} friendIds={friendIds} signOut={signOut} setCurrentUser={setCurrentUser} currentPrivateChannel={currentPrivateChannel} handleOpenFriend={handleOpenFriend} handleCurrentPrivateChannel={handleCurrentPrivateChannel} muted={muted}
                                        defen={defen} handleDefen={handleDefen}
                                        handleVideoMuted={handleVideoMuted} />
                                    <FriendBody friendList={friendList} currentUser={currentUser} friendIds={friendIds} currentPrivateChannel={currentPrivateChannel} handleCurrentPrivateChannel={handleCurrentPrivateChannel} channelRef={channelRef} privateMessages={privateMessages} currentPrivateMessage={currentPrivateMessage} handlePrivateChatInfo={handlePrivateChatInfo} handleAddPrivateMessage={handleAddPrivateMessage} />
                                </Fragment>
                            } />

                    </Route>
                </Route>
            </Routes>
        </ThemeProvider>
    )
}

export default App