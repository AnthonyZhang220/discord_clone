import { useEffect, useMemo, useRef } from "react";
import {
    useJoin,
    useLocalCameraTrack,
    useLocalMicrophoneTrack,
    usePublish,
    useRTCClient,
    useRemoteUsers,
    useClientEvent,
    useVolumeLevel,
    useNetworkQuality,
    useConnectionState,
    useLocalScreenTrack,
} from "agora-rtc-react";
import { useDispatch, useSelector } from "react-redux";
import {
    setIsVoiceChatConnected,
    setLatency,
    setConnectionState,
    setIsVoiceChatLoading,
    setAgoraConfig,
} from "@/redux/features/voiceChatSlice";
import { setIsScreenSharingActive, setIsScreenSharingOn } from "@/redux/features/voiceChatSlice";
import fetchRTCToken from "@/utils/fetchToken";
import AgoraConfig from "@/contexts/agora/config";

export default function useAgora() {
    const dispatch = useDispatch();
    const { isMicOn, isCameraOn, isScreenSharingOn, isDeafen, agoraConfig, isVoiceChatPageOpen } =
        useSelector((state) => state.voiceChat);
    const { currVoiceChannel } = useSelector((state) => state.channel);

    const agoraClient = useRTCClient();
    const connectionState = useConnectionState();
    const networkQuality = useNetworkQuality();

    const { screenTrack } = useLocalScreenTrack(isScreenSharingOn, {}, "disable");

    const shouldJoin =
        isVoiceChatPageOpen &&
        Boolean(agoraConfig?.appid && agoraConfig?.channel && agoraConfig?.token);

    const joinConfig = useMemo(
        () => ({
            appid: agoraConfig.appid,
            channel: agoraConfig.channel,
            uid: agoraConfig.uid,
            token: agoraConfig.token,
        }),
        [agoraConfig]
    );

    const { isConnected, isLoading } = useJoin(joinConfig, shouldJoin);

    const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack(
        isMicOn && !isDeafen,
        {},
        "disable"
    );
    const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack(
        isCameraOn,
        {},
        "disable"
    );
    const volume = useVolumeLevel(localMicrophoneTrack);
    const remoteUsers = useRemoteUsers();

    const trackRef = useRef({
        screenTrack: null,
        localCameraTrack: null,
        localMicrophoneTrack: null,
    });

    useEffect(() => {
        trackRef.current = {
            screenTrack,
            localCameraTrack,
            localMicrophoneTrack,
        };
    }, [screenTrack, localCameraTrack, localMicrophoneTrack]);

    // Reflect actual screen sharing active state when a local screen track appears/disappears.
    // Only mark active when a track exists AND the UI requested sharing, otherwise treat as inactive.
    useEffect(() => {
        try {
            dispatch(setIsScreenSharingActive(Boolean(screenTrack) && Boolean(isScreenSharingOn)));
        } catch (e) {
            // ignore
        }
    }, [dispatch, screenTrack, isScreenSharingOn]);

    // If the UI requested screen sharing but no screenTrack appears within a short timeout,
    // roll back the request so UI doesn't remain in 'on' state when sharing failed/was denied.
    useEffect(() => {
        if (!isScreenSharingOn) return undefined;
        if (screenTrack) return undefined; // already active

        const timer = setTimeout(() => {
            // still no track -> revert the request
            if (!screenTrack) {
                try {
                    dispatch(setIsScreenSharingOn(false));
                } catch (e) {
                    // ignore
                }
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [dispatch, isScreenSharingOn, screenTrack]);

    const publishedTracks = [
        isMicOn && !isDeafen ? localMicrophoneTrack : null,
        isCameraOn ? localCameraTrack : null,
        isScreenSharingOn ? screenTrack : null,
    ].filter(Boolean);
    usePublish(publishedTracks);

    useEffect(() => {
        if (localCameraTrack?.setEnabled) {
            localCameraTrack.setEnabled(isCameraOn);
        }
    }, [localCameraTrack, isCameraOn]);

    useEffect(() => {
        if (localMicrophoneTrack?.setEnabled) {
            localMicrophoneTrack.setEnabled(isMicOn && !isDeafen);
        }
    }, [localMicrophoneTrack, isMicOn, isDeafen]);

    useEffect(() => {
        dispatch(setIsVoiceChatConnected(Boolean(isConnected)));
    }, [dispatch, isConnected]);

    useEffect(() => {
        dispatch(setConnectionState(connectionState));
    }, [dispatch, connectionState]);

    useEffect(() => {
        dispatch(setLatency(networkQuality.delay));
    }, [dispatch, networkQuality.delay]);

    useEffect(() => {
        dispatch(setIsVoiceChatLoading(isLoading));
    }, [dispatch, isLoading]);

    useClientEvent(agoraClient, "token-privilege-will-expire", async () => {
        if (AgoraConfig.serverUrl && currVoiceChannel?.name) {
            try {
                const token = await fetchRTCToken(AgoraConfig, currVoiceChannel.name);
                if (token) {
                    dispatch(setAgoraConfig({ ...agoraConfig, token }));
                    return agoraClient.renewToken(token);
                }
            } catch (error) {
                // Token renewal failed, connection may be interrupted.
            }
        }
    });

    useEffect(() => {
        if (!isScreenSharingOn) {
            trackRef.current.screenTrack?.close();
            try {
                dispatch(setIsScreenSharingActive(false));
            } catch (e) {
                // ignore
            }
        }
    }, [isScreenSharingOn, dispatch]);

    useEffect(() => {
        return () => {
            trackRef.current.screenTrack?.close();
            trackRef.current.localCameraTrack?.close();
            trackRef.current.localMicrophoneTrack?.close();
        };
    }, []);

    return {
        localMicrophoneTrack,
        localCameraTrack,
        screenTrack,
        remoteUsers,
        volume,
        isLoading,
        deviceLoading: isLoadingMic || isLoadingCam,
        isDeafen,
        isMicOn,
        isCameraOn,
        isScreenSharingOn,
    };
}
