import { LocalVideoTrack, RemoteUser, useJoin, useLocalCameraTrack, useLocalMicrophoneTrack, usePublish, useRTCClient, useRemoteUsers, useClientEvent } from "agora-rtc-react";
import { Box } from "@mui/material";
import React, { createContext, useContext, useState, useEffect } from "react";
import { IMicrophoneAudioTrack, ICameraVideoTrack } from "agora-rtc-react";
import { AgoraConfig } from "../../Agora";

const AgoraContext = createContext(null);

export const AgoraProvider = ({ children, localCameraTrack, localMicrophoneTrack }) => {
    <AgoraContext.Provider value={{ localCameraTrack, localMicrophoneTrack, children }}>
        {children}
    </AgoraContext.Provider>
}

export const useAgoraContext = () => {
    const context = useContext(AgoraContext);
    if (!context) throw new Error("useAgoraContext must be used within an AgoraProvider");
    return context;
}
export const AgoraManager = ({ config, children }) => {
    const agoraEngine = useRTCClient();
    const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
    const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();
    const remoteUsers = useRemoteUsers();

    const [role, setRole] = useState("host");

    usePublish([localMicrophoneTrack, localCameraTrack]);

    const { isConnected } = useJoin({
        appid: config.appid,
        channel: config.channelName,
        token: config, rtcToken,
        uid: config.uid,
    })

    useClientEvent(agoraEngine, "user-joined", (user) => {

    })

    useClientEvent(agoraEngine, "user-left", (user) => {

    })

    useClientEvent(agoraEngine, "user-published", (user, mediaType) => {

    })

    useEffect(() => {
        return () => {
            localCameraTrack?.close();
            localMicrophoneTrack?.close();
        }
    }, [])

    const deviceLoading = isLoadingMic || isLoadingCam;
    if (deviceLoading) return <div>Loading devices.//.</div>


    return (
        <AgoraProvider localCameraTrack={localCameraTrack} localMicrophoneTrack={localMicrophoneTrack} >
            {children}
            <Box id="videos">
                <Box className="vid" style={{ height: 300, width: 600 }}>
                    <LocalVideoTrack track={localCameraTrack} play={true} />
                </Box>
                {remoteUsers.map((remoteUser) => (
                    <Box className="vid" style={{ height: 300, width: 600 }} key={remoteUser.uid}>
                        <RemoteUser user={remoteUser} playVideo={true} playAudio={true} />
                    </Box>
                ))}
            </Box>
        </AgoraProvider>
    )
}