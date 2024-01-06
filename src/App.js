import React, { useEffect, useState, useRef, useCallback, Fragment } from 'react'
import Chat from './components/Chat/Chat'
import ServerList from './components/ServerList/ServerList'
import Channel from './components/Channel/Channel'
import { Box } from '@mui/system'
import { Routes, Route, useNavigate } from 'react-router-dom'
import LoginPage, { ResetPasswordPage } from './components/LoginPage/LoginPage'
import { RegisterPage } from './components/LoginPage/LoginPage'
import { onSnapshot, query, where, addDoc, collection, Timestamp, arrayUnion, setDoc, doc, getDocs, QuerySnapshot, updateDoc, getDoc, documentId, orderBy, limitToLast, arrayRemove } from 'firebase/firestore';
import { db, auth, realtimedb } from './firebase'
import { Outlet } from 'react-router-dom'
import AgoraRTC from 'agora-rtc-sdk-ng';
import { AgoraClient, AgoraConfig } from './Agora'
// import { RtcRole } from "agora-token"
import { fetchToken } from './utils/fetchToken'

import VoiceChat from './components/VoiceChat/VoiceChat'
import { useDispatch, useSelector } from 'react-redux'
import ThemeContextProvider from './contexts/ThemeContextProvider'
import CssBaseline from '@mui/material/CssBaseline';
import { convertDateDivider } from './utils/formatter'
import { listenToAuthStateChange } from './utils/authentication'
import DirectMessageMenu from "./components/DirectMessage/DirectMessageMenu/DirectMessageMenu";
import DirectMessageBody from './components/DirectMessage/DirectMessageBody/DirectMessageBody';


import "./App.scss";

function App() {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { isVoiceChatPageOpen } = useSelector(state => state.voiceChat)
    const { currVoiceChannel } = useSelector(state => state.channel)

    useEffect(() => {
        listenToAuthStateChange();
        return listenToAuthStateChange;
    }, [auth])

    const [config, setConfig] = useState(AgoraConfig)

    const [agoraEngine, setAgoraEngine] = useState(AgoraClient);
    // useEffect(() => {
    //     const fetch = async () => {
    //         const token = await fetchToken()

    //         return new Promise((resolve, reject) => {
    //             resolve(token)
    //         })
    //     }

    //     if (config.channel) {

    //         fetch().then((token) => {
    //             agoraEngine.join(config.appId, config.channel, token, null)
    //                 .then((uid) => {
    //                     return Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid])
    //                 }).then(([tracks, uid]) => {

    //                     const [audioTrack, videoTrack] = tracks;

    //                     let data = {
    //                         firebaseUID: null,
    //                         uid: null,
    //                         name: null,
    //                         avatar: null
    //                     };

    //                     let userData = {}
    //                     //get Document for user in firebase
    //                     const userDoc = doc(db, "users", user.uid)

    //                     getDoc(userDoc).then((doc) => {
    //                         //if such document exist add its info to liveUser array
    //                         if (doc.exists()) {
    //                             data = {
    //                                 firebaseUID: doc.data().userId,
    //                                 uid: uid,
    //                                 name: doc.data().displayName,
    //                                 avatar: doc.data().profileURL,
    //                                 hasAudio: false,
    //                                 hasVideo: false,
    //                             }


    //                             addLiveUserToFirebase(data)

    //                             userData = {
    //                                 firebaseUID: user.uid,
    //                                 name: data.name,
    //                                 avatar: data.avatar,
    //                                 uid,
    //                                 videoTrack,
    //                                 audioTrack,
    //                                 hasVideo: false,
    //                                 hasAudio: false
    //                             }

    //                             setCurrentAgoraUID(uid)
    //                             setRemoteUsers((previousUsers) => {
    //                                 if (previousUsers !== undefined) {
    //                                     return [...previousUsers, userData]
    //                                 }
    //                             })

    //                             setLocalTracks(tracks)
    //                             agoraEngine.publish(tracks)

    //                             videoTrack.setEnabled(false);
    //                             audioTrack.setEnabled(false);
    //                             console.log("Tracks successfully published!")
    //                             setVoiceConnected(true)
    //                             setVoiceChat(true)
    //                         }
    //                     })
    //                 })

    //         });
    //     }
    // }, [config.channel])

    const handleDefen = () => {
        setDefen(!defen)
        document.getElementsByTagName("video").muted = defen
    }

    return (
        <ThemeContextProvider>
            <CssBaseline />
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/reset" element={<ResetPasswordPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route element={
                    <Box className="app-mount">
                        <Box className="app-container" >
                            <Outlet />
                        </Box>
                    </Box>
                } >
                    <Route path="/channels"
                        element={
                            <Fragment>
                                <ServerList />
                                <Outlet />
                            </Fragment>
                        }>
                        <Route index
                            element={
                                <Fragment>
                                    <Channel />
                                    {
                                        isVoiceChatPageOpen ?
                                            <VoiceChat currVoiceChannel={currVoiceChannel} />
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
                                    <DirectMessageMenu />
                                    <DirectMessageBody />
                                </Fragment>
                            } />
                    </Route>
                </Route>
            </Routes>
        </ThemeContextProvider>
    )
}

export default App;