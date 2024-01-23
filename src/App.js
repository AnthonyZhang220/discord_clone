import React, { useEffect, useState, useRef, useCallback, Fragment } from 'react'
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