import React, { useEffect, useRef } from "react";
import AvatarWithStatus from "@/components/AvatarWithStatus/AvatarWithStatus";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicOffIcon from "@mui/icons-material/MicOff";
import { Mic } from "@mui/icons-material";
import "./VoiceChatTile.scss";

function VoiceChatTile({
    user,
    videoTrack,
    hasVideo,
    localUser,
    isMuted,
    isDeafen,
    isScreenShare,
}) {
    const videoRef = useRef(null);

    useEffect(() => {
        if (!videoTrack || !videoRef.current) {
            // clear any previous video element
            if (videoRef.current) videoRef.current.innerHTML = "";
            return;
        }

        try {
            // Agora tracks support play(container, options)
            if (typeof videoTrack.play === "function") {
                videoTrack.play(videoRef.current, { fit: "cover" });
            } else if (videoRef.current.tagName === "VIDEO") {
                // fallback if a MediaStream is provided
                videoRef.current.srcObject = videoTrack;
                videoRef.current.play().catch(() => {});
            }
        } catch (err) {
            // non-fatal: log for debugging
            // console.warn("Failed to play video track", err);
        }

        return () => {
            try {
                if (videoTrack && typeof videoTrack.stop === "function") {
                    // don't close track here; just stop playback if supported
                    videoTrack.stop?.();
                }
            } catch (e) {
                // ignore cleanup errors
            }
        };
    }, [videoTrack]);
    const statusLabel = isScreenShare ? "Screen" : isDeafen ? "Deafen" : isMuted ? "Muted" : "Live";
    const statusIcon = isScreenShare ? (
        <VideocamIcon />
    ) : isDeafen || isMuted ? (
        <MicOffIcon />
    ) : (
        <Mic />
    );
    const statusClass = isScreenShare ? "screen" : isDeafen ? "deafen" : isMuted ? "muted" : "live";

    return (
        <div className="voicechat-tile voicechat-transition">
            <div className="video-wrapper">
                <div ref={videoRef} />
            </div>
            <div className={`video-overlay ${!hasVideo ? "no-video" : ""}`}>
                <div className="overlay-container">
                    {!hasVideo && (
                        <AvatarWithStatus
                            src={user.avatar}
                            alt={user.displayName}
                            containerClassName="overlay-avatar overlay-avatar-large"
                            imgProps={{ crossOrigin: "Anonymous" }}
                            status={user?.status}
                        />
                    )}
                    <div className="overlay-bottom">
                        <div className="tile-name">
                            <span className="tile-name-text">{user.displayName}</span>
                        </div>
                        {localUser && (
                            <div className={`tile-status-badge ${statusClass}`}>
                                {statusIcon}
                                <span>{statusLabel}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VoiceChatTile;
