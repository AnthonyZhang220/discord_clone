import AgoraRTC, { LocalVideoTrack, RemoteUser, useJoin, useLocalCameraTrack, useLocalMicrophoneTrack, usePublish, useRTCClient, useRemoteUsers, useClientEvent, useCurrentUID, useVolumeLevel, useNetworkQuality } from "agora-rtc-react";
import { Box } from "@mui/material";
import React, { createContext, useContext, useState, useEffect } from "react";
import { IMicrophoneAudioTrack, ICameraVideoTrack } from "agora-rtc-react";
import { setIsVoiceChatConnected, setRemoteUsers, setAgoraEngine, setAgoraConfig, setIsCameraOn, setLatency } from "../../redux/features/voiceChatSlice";
import { useDispatch, useSelector } from "react-redux";
import { handleJoinVoiceChannel } from "../../utils/handlers/voiceChannelHandlers";

const AgoraContext = createContext(null);

export const AgoraProvider = ({ children, localCameraTrack, localMicrophoneTrack }) => (
    <AgoraContext.Provider value={{ localCameraTrack, localMicrophoneTrack, children }}>
        {children}
    </AgoraContext.Provider>
)

export const useAgoraContext = () => {
    const context = useContext(AgoraContext);
    if (!context) throw new Error("useAgoraContext must be used within an AgoraProvider");
    return context;
}

export const AgoraManager = ({ config, children }) => {
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth)
    const { isMuted, isDeafen, isCameraOn, isVoiceChatConnected, agoraConfig, remoteUsers } = useSelector(state => state.voiceChat)
    const { currVoiceChannel } = useSelector(state => state.channel)

    const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));
    const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
    const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();

    usePublish([localMicrophoneTrack, localCameraTrack]);
    const networkQuality = useNetworkQuality();

    const { isConnected, data } = useJoin(
        async () => {
            const { uid, channel } = await handleJoinVoiceChannel()

            return {
                appid: config.appId,
                channel: channel,
                token: config.token,
                uid: uid,
            }
        }, isVoiceChatConnected)

    const volume = useVolumeLevel(localMicrophoneTrack)

    const currAgoraUID = useCurrentUID();

    useEffect(() => {
        dispatch(setAgoraConfig({ ...AgoraConfig, channel: currVoiceChannel.id }))
    }, [currVoiceChannel.id])

    useEffect(() => {
        dispatch(setAgoraEngine(agoraEngine))
    }, [agoraEngine])

    useEffect(() => {
        if (isConnected) {
            dispatch(setIsVoiceChatConnected(true))
        } else {
            dispatch(setIsVoiceChatConnected(false))
        }
    }, [isConnected])

    useEffect(() => {
        dispatch(setLatency(networkQuality))
    }, [networkQuality])

    useClientEvent(agoraEngine, "user-joined", (user) => {

        dispatch(setRemoteUsers([...remoteUsers, { ...user, id: user.uid, hasAudio: user.hasAudio, hasVideo: user.hasVideo }]))
    })

    useClientEvent(agoraEngine, "user-left", (user) => {
        dispatch(setRemoteUsers)
    })

    useClientEvent(agoraEngine, "user-published", (user, mediaType) => {

    })

    useClientEvent(agoraEngine, "connection-state-change", () => {

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
                    {isCameraOn ?
                        <LocalVideoTrack track={localCameraTrack} play={true} muted={isCameraOn} />
                        : <VoiceChatTile user={user} volume={volume} />
                    }
                </Box>
                {remoteUsers.map((remoteUser) => (
                    <Box className="vid" style={{ height: 300, width: 600 }} key={remoteUser.uid}>
                        {
                            remoteUser.hasVideo ?
                                <RemoteUser user={remoteUser} playVideo={remoteUser.hasVideo} playAudio={remoteUser.hasAudio} /> :
                                <VoiceChatTile user={remoteUser} />
                        }
                    </Box>
                ))}
            </Box>
        </AgoraProvider>
    )
}