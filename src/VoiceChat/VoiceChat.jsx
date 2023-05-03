import React, { useEffect, useRef, useState, forwardRef } from 'react'
import { Box } from '@mui/material'
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
// import { LocalVideo, RemoteVideo } from '../WebSocket';
import "./VoiceChat.scss"
import { rtcProps } from '../AgoraConfig';

const VoiceChat = forwardRef(({ currentVoiceChannel, options }, ref) => {

    const { localPlayerRef, remotePlayerRef } = ref;

    return (
        <Box className="voicechat-container">
            <Box className="voicechat-header">
                <VolumeUpIcon sx={{ color: "#8a8e94", marginRight: "6px", alignItems: "baseline" }} />
                <Box component="span" variant="h3" className="voicechat-header-title">
                    {currentVoiceChannel.name}
                </Box>
            </Box>
            <Box className="voicechat-content">
                <Box className="voicechat-list">
                </Box>
            </Box>
            <Box className="voicechat-footer">
                <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
                    <video ref={localPlayerRef} autoPlay id={options.id ? options.id : ""} style={{ width: "640px", height: "480px", padding: "15px 5px 5px 5px" }} ></video>
                    <video ref={remotePlayerRef} style={{ width: "640px", height: "480px", padding: "15px 5px 5px 5px" }} ></video>
                </Box>
            </Box>

        </Box>
    )
})

export default VoiceChat;
