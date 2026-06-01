import React, { useEffect, useRef, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { useRemoteUsers, useRemoteVideoTracks, useRemoteAudioTracks } from "agora-rtc-react";
import VoiceChatTile from "@/components/VoiceChat/VoiceChatTile/VoiceChatTile";
import useAgora from "@/hooks/useAgora";

export const AgoraManager = () => {
    const user = useSelector((state) => state.auth.user) || {};
    const { currVoiceChannel } = useSelector((state) => state.channel);
    const {
        localMicrophoneTrack,
        localCameraTrack,
        screenTrack,
        volume,
        isLoading,
        deviceLoading,
        isDeafen,
        isMicOn,
        isCameraOn,
        isScreenSharingOn,
    } = useAgora();

    // ── Remote tracks ─────────────────────────────────────────────────────
    const remoteUsers = useRemoteUsers();
    const { videoTracks } = useRemoteVideoTracks(remoteUsers);
    const { audioTracks } = useRemoteAudioTracks(remoteUsers);

    // 只对新加入的 track 调用 play，避免重复
    const playedTracksRef = useRef(new Set());
    useEffect(() => {
        audioTracks.forEach((track) => {
            const id = track.getTrackId?.() ?? track._ID;
            if (!playedTracksRef.current.has(id)) {
                track.play();
                playedTracksRef.current.add(id);
            }
        });
    }, [audioTracks]);

    // ── Firestore participants 实时同步 ───────────────────────────────────
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        if (!currVoiceChannel?.id) return;
        const unsub = onSnapshot(doc(db, "voicechannels", currVoiceChannel.id), (snap) => {
            if (!snap.exists()) return;
            setParticipants(snap.data().participants ?? []);
        });
        return () => unsub();
    }, [currVoiceChannel?.id]);

    const participantMap = useMemo(() => {
        const map = {};
        participants.forEach((p) => {
            map[p.id] = p;
        });
        return map;
    }, [participants]);

    if (deviceLoading || isLoading) {
        return <div>Loading voice chat devices...</div>;
    }

    return (
        <>
            {/* ── Local ── */}
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

            {/* ── Screen share ── */}
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

            {/* ── Remote users ── */}
            {remoteUsers.map((remoteUser, index) => {
                const profile = participantMap[remoteUser.uid] ?? {
                    id: remoteUser.uid,
                    displayName: `User ${remoteUser.uid}`,
                    avatar: null,
                    status: null,
                };
                return (
                    <VoiceChatTile
                        key={remoteUser.uid}
                        localUser={false}
                        user={profile}
                        videoTrack={videoTracks[index]}
                        audioTrack={audioTracks[index]}
                        hasAudio={!!audioTracks[index]}
                        hasVideo={!!videoTracks[index]}
                    />
                );
            })}
        </>
    );
};
