import AgoraRTC, { LocalVideoTrack, RemoteUser, useJoin, useLocalCameraTrack, useLocalMicrophoneTrack, usePublish, useRTCClient, useRemoteUsers, useClientEvent, useCurrentUID, useVolumeLevel, useNetworkQuality, useConnectionState } from "agora-rtc-react";
import { Box } from "@mui/material";
import React, { createContext, useContext, useState, useEffect } from "react";
import { IMicrophoneAudioTrack, ICameraVideoTrack } from "agora-rtc-react";
import { setIsVoiceChatConnected, setRemoteUsers, setAgoraEngine, setAgoraConfig, setIsCameraOn, setLatency, setConnectionState } from "../../redux/features/voiceChatSlice";
import { useDispatch, useSelector } from "react-redux";
import VoiceChatTile from "../../components/VoiceChat/VoiceChatTile/VoiceChatTile";
import { handleJoinVoiceChannel } from "../../utils/handlers/voiceChannelHandlers";
import fetchRTCToken from "../../utils/fetchToken";

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

    const agoraEngine = useRTCClient();
    const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
    const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();

    usePublish([localMicrophoneTrack, localCameraTrack]);
    const networkQuality = useNetworkQuality();

    const { isConnected, data } = useJoin(
        async () => {
            const token = await fetchRTCToken(config, currVoiceChannel.id)
            return {
                appid: config.appId,
                channel: currVoiceChannel.id,
                token: token,
                uid: user.id,
            }
        }, isVoiceChatConnected)

    const volume = useVolumeLevel(localMicrophoneTrack)

    const currAgoraUID = useCurrentUID();
    const connectionState = useConnectionState();

    // useEffect(() => {
    //     dispatch(setAgoraConfig({ ...AgoraConfig, channel: currVoiceChannel.id }))
    // }, [currVoiceChannel.id])

    useEffect(() => {
        dispatch(setAgoraEngine(agoraEngine))
    }, [agoraEngine])

    useEffect(() => {
        console.log("isConnected", isConnected)
        console.log("data", data)
        if (isConnected) {
            dispatch(setIsVoiceChatConnected(true))
        } else {
            dispatch(setIsVoiceChatConnected(false))
        }
    }, [isConnected])

    useEffect(() => {
        if (connectionState) {
            dispatch(setConnectionState(connectionState))
        }
    }, [connectionState])

    useEffect(() => {
        dispatch(setLatency(networkQuality))
    }, [networkQuality])

    useClientEvent(agoraEngine, "token-privilege-will-expire", () => {
        if (config.serverUrl !== "") {
            fetchRTCToken(config.channelName)
                .then((token) => {
                    console.log("RTC token fetched from server: ", token);
                    if (token) return agoraEngine.renewToken(token);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            console.log("Please make sure you specified the token server URL in the configuration file");
        }
    });

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