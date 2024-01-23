import AgoraRTC, { LocalVideoTrack, RemoteUser, useJoin, useLocalCameraTrack, useLocalMicrophoneTrack, usePublish, useRTCClient, useRemoteUsers, useClientEvent, useCurrentUID, useVolumeLevel, useNetworkQuality, useConnectionState, useIsConnected, AgoraRTCProvider, RemoteVideoTrack, LocalAudioTrack, RemoteAudioTrack } from "agora-rtc-react";
import { Box } from "@mui/material";
import React, { useEffect, useState, createContext, useContext, useMemo } from "react";
import { setIsVoiceChatConnected, setRemoteUsers, setAgoraEngine, setAgoraConfig, setIsCameraOn, setLatency, setConnectionState } from "../../redux/features/voiceChatSlice";
import { useDispatch, useSelector } from "react-redux";
import VoiceChatTile from "../../components/VoiceChat/VoiceChatTile/VoiceChatTile";
import fetchRTCToken from "../../utils/fetchToken";
import AgoraConfig from "./config";

export const AgoraManager = ({ config, children }) => {
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth)
    const { isMicOn, isDeafen, isCameraOn, agoraConfig, isVoiceChatConnected } = useSelector(state => state.voiceChat)
    const { currVoiceChannel } = useSelector(state => state.channel)

    const localUser = useMemo(() => user, [user.avatar, user.displayName])
    const agoraClient = useRTCClient();
    const currAgoraUID = useCurrentUID();
    const connectionState = useConnectionState();
    const networkQuality = useNetworkQuality();
    const volume = useVolumeLevel(localMicrophoneTrack)

    const { isConnected, isLoading, error, data } = useJoin(
        async () => {
            const token = await fetchRTCToken(config, currVoiceChannel.id)
            return {
                appid: config.appId,
                channel: currVoiceChannel.id,
                uid: user.id,
                token: token ? token : null,
            }
        }, isVoiceChatConnected)

    //local
    const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack(isMicOn);
    const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack(isCameraOn);
    usePublish([localMicrophoneTrack, localCameraTrack], isCameraOn || isMicOn);

    //remote
    const remoteUsers = useRemoteUsers();





    useEffect(() => {
        console.error("isConnected", isConnected)

        console.error("isLoading", isLoading)
        console.error("error", error)
        console.error("data", data)

    }, [isConnected, isLoading, error, data])

    useEffect(() => {
        console.log("isLoadingCam", isLoadingCam);
        console.log("localCameraTrack", localCameraTrack);
    }, [isLoadingCam, localCameraTrack]);

    //remote
    // const publishedUsers = remoteUsers.filter(user => user.hasAudio || user.hasVideo);
    // const { videoTracks } = useRemoteVideoTracks(remoteUsers);
    // const { audioTracks } = useRemoteAudioTracks(remoteUsers);
    // audioTracks.map(track => track.play());

    // useEffect(() => {
    //     dispatch(setAgoraConfig({ ...AgoraConfig, channel: currVoiceChannel.id }))
    // }, [currVoiceChannel.id])

    // useEffect(() => {
    //     dispatch(setAgoraEngine(agoraClient))
    // }, [agoraClient])

    // useEffect(() => {
    //     console.log("isConnected", isConnected)
    //     console.log("data", data)
    //     if (isConnected) {
    //         dispatch(setIsVoiceChatConnected(true))
    //     } else {
    //         dispatch(setIsVoiceChatConnected(false))
    //     }
    // }, [isConnected])

    useEffect(() => {
        dispatch(setConnectionState(connectionState))
        console.log(connectionState)
    }, [connectionState])

    useClientEvent(agoraClient, "token-privilege-will-expire", () => {
        if (config.serverUrl !== "") {
            fetchRTCToken(config, currVoiceChannel.name)
                .then((token) => {
                    console.log("RTC token fetched from server: ", token);
                    if (token) return agoraClient.renewToken(token);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            console.log("Please make sure you specified the token server URL in the configuration file");
        }
    });

    useEffect(() => {
        dispatch(setLatency(networkQuality.delay))
        console.log(networkQuality.delay)
    }, [networkQuality.delay])


    useEffect(() => {
        return () => {
            localCameraTrack?.close();
            localMicrophoneTrack?.close();
        }
    }, [])

    useEffect(() => {
        console.log(remoteUsers)
    }, [remoteUsers.length])

    const deviceLoading = isLoadingMic || isLoadingCam;
    if (deviceLoading) return <div>Loading devices.//.</div>

    return (
        <Box id="videos">
            <Box className="vid" style={{ height: 300, width: 600 }}>
                {isCameraOn ?
                    <LocalVideoTrack track={localCameraTrack} play={isCameraOn} muted={isCameraOn ? false : true} />
                    : <VoiceChatTile user={localUser} hasAudio={isMicOn} hasVideo={isCameraOn} volume={volume} />
                }
            </Box>
            {remoteUsers.map((remoteUser) => (
                <Box className="vid" style={{ height: 300, width: 600 }} key={remoteUser.uid}>
                    {
                        remoteUser.hasVideo ?
                            <>
                                <RemoteVideoTrack track={remoteUser.videoTrack} play={true} />
                                <RemoteAudioTrack track={remoteUser.audioTrack} play />
                            </>
                            :
                            <VoiceChatTile user={remoteUser} hasAudio={remoteUser.hasAudio} hasVideo={remoteUser.hasVideo} />
                    }
                </Box>
            ))}
        </Box>
    )
}