import React, { useEffect, useState, useRef, useCallback, Fragment } from 'react'
import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore'
import Chat from './components/Chat/Chat'
import ServerList from './components/ServerList/ServerList'
import Channel from './components/Channel/Channel'
import { Box } from '@mui/system'
import { Routes, Route, useNavigate } from 'react-router-dom'
import LoginPage, { ResetPasswordPage } from './components/LoginPage/LoginPage'
import { RegisterPage } from './components/LoginPage/LoginPage'
import { db, auth, realtimedb } from './firebase'
import { Outlet } from 'react-router-dom'
// import { RtcRole } from "agora-token"
import VoiceChat from './components/VoiceChat/VoiceChat'
import { useDispatch, useSelector } from 'react-redux'
import ThemeContextProvider from './contexts/ThemeContextProvider'
import CssBaseline from '@mui/material/CssBaseline';
import DirectMessageMenu from "./components/DirectMessage/DirectMessageMenu/DirectMessageMenu";
import DirectMessageBody from './components/DirectMessage/DirectMessageBody/DirectMessageBody';
import PageNotFound from './components/PageNotFound/PageNotFound'
import { onAuthStateChanged, getRedirectResult, GoogleAuthProvider } from 'firebase/auth'
import { getSelectStore } from './utils/userSelectStore'
import { setUser, setIsLoggedIn } from './redux/features/authSlice'
import { getBannerColor } from './utils/getBannerColor'
import Error from './components/Error/Error'
import "./App.scss";

function App() {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { isVoiceChatPageOpen } = useSelector(state => state.voiceChat)
    const { currVoiceChannel } = useSelector(state => state.channel)

    const navigate = useNavigate();

    useEffect(() => {
        // Handle OAuth redirect results (optional: access tokens, credentials)
        (async () => {
            try {
                const result = await getRedirectResult(auth).catch(() => null)
                if (result) {
                    try {
                        const credential = GoogleAuthProvider.credentialFromResult(result)
                        if (credential) {
                            console.log('OAuth credential from redirect:', credential)
                        }
                    } catch (e) {
                        // provider-specific parsing failed, ignore
                        console.warn('Could not parse OAuth credential from redirect result', e)
                    }
                }
            } catch (err) {
                console.warn('getRedirectResult failed', err)
            }
        })()

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    const userRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        console.log("userData", userData)
                        dispatch(setUser({
                            displayName: userData.displayName,
                            avatar: userData.avatar,
                            id: userData.id,
                            createdAt: userData.createdAt?.seconds ? userData.createdAt.seconds : null,
                            status: userData.status,
                            email: userData.email,
                            bannerColor: userData.bannerColor,
                            friends: userData.friends || []
                        }))
                    } else {
                        const newUser = {
                            displayName: user.displayName,
                            email: user.email ? user.email : "",
                            avatar: user.photoURL,
                            id: user.uid,
                            createdAt: Timestamp.fromDate(new Date()),
                            status: "online",
                            friends: [],
                            bannerColor: await getBannerColor(user.photoURL)
                        }

                        await setDoc(userRef, newUser)

                        dispatch(setUser({
                            displayName: newUser.displayName,
                            avatar: newUser.avatar,
                            id: newUser.id,
                            createdAt: newUser.createdAt.seconds,
                            status: newUser.status,
                            email: newUser.email,
                            bannerColor: newUser.bannerColor,
                            friends: newUser.friends
                        }))
                    }

                    getSelectStore()
                    dispatch(setIsLoggedIn(true))
                    navigate("/channels")
                } else {
                    dispatch(setUser(null))
                    dispatch(setIsLoggedIn(false))
                    navigate("/")
                }
            } catch (error) {
                console.error("Error fetching user data", error)
            }
        })

        return unsubscribe;

    }, [auth])

    return (
        <ThemeContextProvider>
            <CssBaseline />
            <Error />
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
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </ThemeContextProvider>
    )
}

export default App;