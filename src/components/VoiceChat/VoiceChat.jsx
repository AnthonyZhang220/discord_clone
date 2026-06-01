import React from "react";
import { Tooltip } from "@/components/compat/RadixCompat";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { AgoraManager } from "@/contexts/agora/agoraManager";
import AgoraClient from "@/contexts/agora/AgoraClient";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import VideocamOffRoundedIcon from "@mui/icons-material/VideocamOffRounded";
import CallEndRoundedIcon from "@mui/icons-material/CallEndRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";
import { toggleCamera, toggleMic } from "@/handlers/voiceControlHandlers";
import { handleLeaveVoiceChannel } from "@/handlers/voiceChannelHandlers";
import { useSelector } from "react-redux";

import "./VoiceChat.scss";

const VoiceChat = () => {
    const { currVoiceChannel } = useSelector((state) => state.channel);
    const { isMicOn, isCameraOn } = useSelector((state) => state.voiceChat);

    return (
        <AgoraClient>
            <div className="voicechat-container">
                <div className="voicechat-wrapper">
                    <div className="voicechat-grid">
                        <AgoraManager />
                    </div>
                </div>
                <div className="voicechat-control">
                    <div className="gradient-top">
                        <VolumeUpIcon className="voicechat-volume-icon" />
                        <span className="voicechat-header-title">{currVoiceChannel.name}</span>
                    </div>
                    <div className="gradient-bottom">
                        <div className="fab-group">
                            <Tooltip title={isCameraOn ? "Turn off Camera" : "Turn on Camera"}>
                                <span>
                                    <button
                                        type="button"
                                        className="fab"
                                        onClick={() => toggleCamera()}
                                    >
                                        {isCameraOn ? (
                                            <VideocamRoundedIcon />
                                        ) : (
                                            <VideocamOffRoundedIcon />
                                        )}
                                    </button>
                                </span>
                            </Tooltip>
                            <Tooltip title={isMicOn ? "Mute" : "Unmute"}>
                                <span>
                                    <button
                                        type="button"
                                        className="fab"
                                        onClick={() => toggleMic()}
                                    >
                                        {isMicOn ? <MicRoundedIcon /> : <MicOffRoundedIcon />}
                                    </button>
                                </span>
                            </Tooltip>
                            <button
                                type="button"
                                className="fab fab-error"
                                onClick={() => handleLeaveVoiceChannel()}
                            >
                                <CallEndRoundedIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AgoraClient>
    );
};

export default VoiceChat;
