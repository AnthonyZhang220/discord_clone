import React from "react";
import { Fab } from "@mui/material";
import { Tooltip } from "@/components/compat/RadixCompat";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { AgoraManager } from "@/contexts/agora/agoraManager";
import AgoraConfig from "@/contexts/agora/config";
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
                        <AgoraManager config={AgoraConfig}></AgoraManager>
                    </div>
                </div>
                <div className="voicechat-control">
                    <div className="gradient-top">
                        <VolumeUpIcon className="voicechat-volume-icon" />
                        <span className="voicechat-header-title">{currVoiceChannel.name}</span>
                    </div>
                    <div className="gradient-bottom">
                        <div className="fab-group">
                            <Fab onClick={() => toggleCamera()}>
                                {isCameraOn ? (
                                    <Tooltip title="Turn on Camera">
                                        <VideocamRoundedIcon />
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Turn Off Camera">
                                        <VideocamOffRoundedIcon />
                                    </Tooltip>
                                )}
                            </Fab>
                            <Fab onClick={() => toggleMic()}>
                                {isMicOn ? (
                                    <Tooltip title="Mute">
                                        <MicRoundedIcon />
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Unmute">
                                        <MicOffRoundedIcon />
                                    </Tooltip>
                                )}
                            </Fab>
                            <Fab color="error" onClick={() => handleLeaveVoiceChannel()}>
                                <CallEndRoundedIcon />
                            </Fab>
                        </div>
                    </div>
                </div>
            </div>
        </AgoraClient>
    );
};

export default VoiceChat;
