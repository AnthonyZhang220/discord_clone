import React from "react";
import { useSelector } from "react-redux";
import VoiceChatTile from "@/components/VoiceChat/VoiceChatTile/VoiceChatTile";
import useAgora from "@/hooks/useAgora";

export const AgoraManager = () => {
    const user = useSelector((state) => state.auth.user) || {};
    const {
        localMicrophoneTrack,
        localCameraTrack,
        screenTrack,
        remoteUsers,
        volume,
        isLoading,
        deviceLoading,
        isDeafen,
        isMicOn,
        isCameraOn,
        isScreenSharingOn,
    } = useAgora();

    if (deviceLoading || isLoading) {
        return <div>Loading voice chat devices...</div>;
    }

    return (
        <>
            <VoiceChatTile
                localUser={true}
                videoTrack={localCameraTrack}
                audioTrack={localMicrophoneTrack}
                user={user}
                hasAudio={isMicOn && !isDeafen}
                hasVideo={isCameraOn}
                isMuted={!isMicOn}
                isDeafen={isDeafen}
                volume={volume}
            />
            {screenTrack && isScreenSharingOn && (
                <VoiceChatTile
                    localUser={true}
                    videoTrack={screenTrack}
                    user={user}
                    hasVideo={true}
                    hasAudio={false}
                    isMuted={!isMicOn}
                    isDeafen={isDeafen}
                    isScreenShare={true}
                    volume={volume}
                />
            )}
            {remoteUsers.map((remoteUser) => (
                <VoiceChatTile
                    key={remoteUser.uid}
                    localUser={false}
                    user={remoteUser}
                    videoTrack={remoteUser.videoTrack}
                    audioTrack={remoteUser.audioTrack}
                    hasAudio={remoteUser.hasAudio}
                    hasVideo={remoteUser.hasVideo}
                />
            ))}
        </>
    );
};
