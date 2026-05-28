import React from "react";
import { Avatar, Button, Typography, IconButton } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { Mic } from "@mui/icons-material";
import { LocalAudioTrack, LocalVideoTrack, RemoteUser } from "agora-rtc-react";
import "./VoiceChatTile.scss";

function VoiceChatTile({ user, volume, hasVideo, hasAudio, videoTrack, audioTrack, localUser }) {
    // no side-effects required
    return (
        <div className="voicechat-tile voicechat-transition">
            <div className="video-wrapper">
                {localUser ? (
                    <>
                        <LocalVideoTrack track={videoTrack} play={hasVideo} disabled={!hasVideo} />
                        <LocalAudioTrack track={audioTrack} play={false} disabled={!hasAudio} />
                    </>
                ) : (
                    <div id={user.uid}>
                        {/* <RemoteVideoTrack track={videoTrack} play={hasVideo} muted={false} />
                            <RemoteAudioTrack track={audioTrack} play={hasAudio} /> */}
                        <RemoteUser user={user} playVideo={hasVideo} playAudio={hasAudio} />
                    </div>
                )}
            </div>
            <div className="video-overlay">
                <div className="overlay-container">
                    <div className="overlay-top"></div>
                    {!hasVideo && (
                        <Avatar
                            src={user.avatar}
                            alt={user.displayName}
                            className="overlay-avatar overlay-avatar-large"
                            imgProps={{ crossOrigin: "Anonymous" }}
                        />
                    )}
                    <div className="overlay-bottom">
                        <div>
                            <Button
                                className={
                                    "voicechat-button " +
                                    (volume > 50
                                        ? "voicechat-button-high"
                                        : "voicechat-button-normal")
                                }
                                variant="outlined"
                                startIcon={hasVideo ? <VideocamIcon /> : <VideocamOffIcon />}
                            >
                                <Typography variant="h5">
                                    {user.displayName}
                                    {user.uid}
                                </Typography>
                            </Button>
                        </div>
                        <div>
                            <IconButton className="voicechat-iconbutton">
                                {hasAudio ? <Mic /> : <MicOffIcon />}
                            </IconButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VoiceChatTile;
