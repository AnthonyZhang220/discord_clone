import React, { useEffect, useRef } from 'react'
import { Box, Tooltip, Fab } from '@mui/material'
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { AgoraManager } from '../../contexts/agora/agoraManager';
import AgoraConfig from '../../contexts/agora/config';
import AgoraClient from '../../contexts/agora/AgoraClient';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import VideocamOffRoundedIcon from '@mui/icons-material/VideocamOffRounded';
import ScreenShareRoundedIcon from '@mui/icons-material/ScreenShareRounded';
import StopScreenShareRoundedIcon from '@mui/icons-material/StopScreenShareRounded';
import HeadsetIcon from '@mui/icons-material/Headset';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import CallEndRoundedIcon from '@mui/icons-material/CallEndRounded';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import MicOffRoundedIcon from '@mui/icons-material/MicOffRounded';
import { toggleScreenShare, toggleCamera, toggleMic } from '../../handlers/voiceControlHandlers';
import { handleLeaveVoiceChannel } from '../../handlers/voiceChannelHandlers';
import { useSelector } from 'react-redux';

import "./VoiceChat.scss"

const VoiceChat = () => {
    const { currVoiceChannel } = useSelector(state => state.channel);
    const { isMicOn, isDeafen, isCameraOn } = useSelector(state => state.voiceChat)

    return (
        <AgoraClient>
            <Box className="voicechat-container">
                <Box className="voicechat-wrapper">
                    <Box className="voicechat-grid">
                        <AgoraManager config={AgoraConfig}>
                        </AgoraManager>
                    </Box>
                </Box>
                <Box className="voicechat-control">
                    <Box className="gradient-top">
                        <VolumeUpIcon sx={{ color: "#8a8e94", marginRight: "6px", alignItems: "baseline" }} />
                        <Box component="span" variant="h3" className="voicechat-header-title">
                            {currVoiceChannel.name}
                        </Box>
                    </Box>
                    <Box className="gradient-bottom">
                        <Box className="fab-group">
                            <Fab onClick={() => toggleCamera()}>
                                {isCameraOn ?
                                    <Tooltip title="Turn on Camera">
                                        <VideocamRoundedIcon />
                                    </Tooltip>
                                    :
                                    <Tooltip title="Turn Off Camera">
                                        <VideocamOffRoundedIcon />
                                    </Tooltip>
                                }
                            </Fab>
                            <Fab onClick={() => toggleMic()}>
                                {isMicOn ?
                                    <Tooltip title="Mute">
                                        <MicRoundedIcon />
                                    </Tooltip>
                                    :
                                    <Tooltip title="Unmute">
                                        <MicOffRoundedIcon />
                                    </Tooltip>
                                }
                            </Fab>
                            <Fab color="error" onClick={() => handleLeaveVoiceChannel()}>
                                <CallEndRoundedIcon />
                            </Fab>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </AgoraClient>
    )
}

export default VoiceChat;
