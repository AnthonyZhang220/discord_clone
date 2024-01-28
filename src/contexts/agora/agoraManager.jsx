import { useJoin, useLocalCameraTrack, useLocalMicrophoneTrack, usePublish, useRTCClient, useRemoteUsers, useClientEvent, useCurrentUID, useVolumeLevel, useNetworkQuality, useConnectionState, useRTCScreenShareClient, useLocalScreenTrack, } from "agora-rtc-react";
import { Box } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { setIsVoiceChatConnected, setLatency, setConnectionState, setIsVoiceChatLoading } from "../../redux/features/voiceChatSlice";
import { useDispatch, useSelector } from "react-redux";
import VoiceChatTile from "../../components/VoiceChat/VoiceChatTile/VoiceChatTile";
import fetchRTCToken from "../../utils/fetchToken";
import { handleLeaveVoiceChannel } from "../../handlers/voiceChannelHandlers";

export const AgoraManager = ({ config, children }) => {
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth)
    const { isMicOn, isDeafen, isCameraOn, agoraConfig, isVoiceChatConnected, isScreenSharingOn } = useSelector(state => state.voiceChat)
    const { currVoiceChannel } = useSelector(state => state.channel)

    const localUser = useMemo(() => user, [user.avatar, user.displayName])
    const agoraClient = useRTCClient();
    const agoraShareClient = useRTCScreenShareClient();
    const currAgoraUID = useCurrentUID();
    const connectionState = useConnectionState();
    const networkQuality = useNetworkQuality();
    const volume = useVolumeLevel(localMicrophoneTrack)

    const { screenTrack, screenShareError } = useLocalScreenTrack(isScreenSharingOn, {}, "disable")

    const { isConnected, isLoading, error, data } = useJoin(
        {
            appid: agoraConfig.appid,
            channel: agoraConfig.channel,
            uid: agoraConfig.uid,
            token: agoraConfig.token,
        }, isVoiceChatConnected)

    //local
    const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack(isMicOn);
    const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack(isCameraOn);
    usePublish([localMicrophoneTrack, localCameraTrack, screenTrack]);

    //remote
    const remoteUsers = useRemoteUsers();

    //remote
    // const publishedUsers = remoteUsers.filter(user => user.hasAudio || user.hasVideo);
    // audioTracks.map(track => track.play());

    // useEffect(() => {
    //     dispatch(setAgoraConfig({ ...AgoraConfig, channel: currVoiceChannel.id }))
    // }, [currVoiceChannel.id])

    // useEffect(() => {
    //     dispatch(setAgoraEngine(agoraClient))
    // }, [agoraClient])

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
        dispatch(setConnectionState(connectionState))
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
    }, [networkQuality.delay])

    useEffect(() => {
        dispatch(setIsVoiceChatLoading(isLoading))
    }, [isLoading])


    useEffect(() => {
        return () => {
            screenTrack?.close();
            localCameraTrack?.close();
            localMicrophoneTrack?.close();
            handleLeaveVoiceChannel();
        }
    }, [])

    useEffect(() => {
        console.log(remoteUsers)
    }, [remoteUsers])

    const deviceLoading = isLoadingMic || isLoadingCam;
    if (deviceLoading) return <div>Loading devices.//.</div>

    return (
        <>
            <VoiceChatTile localUser={true} videoTrack={localCameraTrack} audioTrack={localMicrophoneTrack} user={localUser} hasAudio={isMicOn} hasVideo={isCameraOn} volume={volume} />
            {isScreenSharingOn &&
                <VoiceChatTile localUser={true} videoTrack={screenTrack} user={localUser} hasVideo={isScreenSharingOn} />
            }
            {
                remoteUsers.map((remoteUser) => (
                    <VoiceChatTile key={remoteUser.uid} localUser={false} user={remoteUser} videoTrack={remoteUser.videoTrack} audioTrack={remoteUser.audioTrack} hasAudio={remoteUser.hasAudio} hasVideo={remoteUser.hasVideo} />
                ))
            }
        </>
    )
}