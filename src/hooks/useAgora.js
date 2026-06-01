import { useEffect, useMemo, useRef } from "react";
import {
    useJoin,
    useLocalCameraTrack,
    useLocalMicrophoneTrack,
    useRTCClient,
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
    setIsScreenSharingActive,
    setIsScreenSharingOn,
} from "@/redux/features/voiceChatSlice";
import { useAgoraTrack } from "@/hooks/useAgoraTrack";
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
    const isConnected = connectionState === "CONNECTED";

    // ── Join ──────────────────────────────────────────────────────────────
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

    const { isLoading } = useJoin(joinConfig, shouldJoin);

    // ── Tracks：始终创建 ──────────────────────────────────────────────────
    const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack(
        true,
        {},
        "disable"
    );
    const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack(true, {}, "disable");
    const { screenTrack } = useLocalScreenTrack(isScreenSharingOn, {}, "disable");

    const volume = useVolumeLevel(localMicrophoneTrack);

    // ── Publish / unpublish（竞态安全）────────────────────────────────────
    useAgoraTrack({
        track: localMicrophoneTrack,
        shouldPublish: isMicOn && !isDeafen,
        isConnected,
        client: agoraClient,
        name: "mic",
    });

    useAgoraTrack({
        track: localCameraTrack,
        shouldPublish: isCameraOn,
        isConnected,
        client: agoraClient,
        name: "camera",
    });

    useAgoraTrack({
        track: screenTrack,
        shouldPublish: isScreenSharingOn,
        isConnected,
        client: agoraClient,
        name: "screen",
    });

    // ── Screen share active state ─────────────────────────────────────────
    useEffect(() => {
        dispatch(setIsScreenSharingActive(Boolean(screenTrack) && Boolean(isScreenSharingOn)));
    }, [dispatch, screenTrack, isScreenSharingOn]);

    // screen share 请求超时回退
    const screenTrackRef = useRef(screenTrack);
    useEffect(() => {
        screenTrackRef.current = screenTrack;
    }, [screenTrack]);

    useEffect(() => {
        if (!isScreenSharingOn || screenTrack) return;
        const timer = setTimeout(() => {
            if (!screenTrackRef.current) dispatch(setIsScreenSharingOn(false));
        }, 3000);
        return () => clearTimeout(timer);
    }, [dispatch, isScreenSharingOn, screenTrack]);

    useEffect(() => {
        if (!screenTrack) return;

        const handleTrackEnded = () => {
            dispatch(setIsScreenSharingOn(false));
            dispatch(setIsScreenSharingActive(false));
        };

        screenTrack.on("track-ended", handleTrackEnded);

        return () => {
            screenTrack.off("track-ended", handleTrackEnded);
        };
    }, [screenTrack, dispatch]);

    // ── Redux sync ────────────────────────────────────────────────────────
    useEffect(() => {
        dispatch(setIsVoiceChatConnected(isConnected));
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

    // ── Token renewal ─────────────────────────────────────────────────────
    useClientEvent(agoraClient, "token-privilege-will-expire", async () => {
        if (AgoraConfig.serverUrl && currVoiceChannel?.name) {
            try {
                const token = await fetchRTCToken(AgoraConfig, currVoiceChannel.name);
                if (token) {
                    dispatch(setAgoraConfig({ ...agoraConfig, token }));
                    agoraClient.renewToken(token);
                }
            } catch (e) {
                // ignore
            }
        }
    });

    // ── Cleanup on unmount ────────────────────────────────────────────────
    const trackRef = useRef({
        screenTrack: null,
        localCameraTrack: null,
        localMicrophoneTrack: null,
    });

    useEffect(() => {
        trackRef.current = { screenTrack, localCameraTrack, localMicrophoneTrack };
    }, [screenTrack, localCameraTrack, localMicrophoneTrack]);

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
        volume,
        isLoading,
        deviceLoading: isLoadingMic || isLoadingCam,
        isDeafen,
        isMicOn,
        isCameraOn,
        isScreenSharingOn,
    };
}
