import React, { useRef } from 'react'
import { Box } from '@mui/material'
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useSelector } from 'react-redux';
import "./VoiceChat.scss"
import { AgoraManager } from '../../contexts/agora/agoraManager';
import AgoraConfig from '../../contexts/agora/config';
import AgoraRTC, { AgoraRTCProvider, useRTCClient } from 'agora-rtc-react';




const VoiceChat = ({ currVoiceChannel }) => {
    const { agoraConfig, isVoiceChatConnected } = useSelector(state => state.voiceChat)
    const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: AgoraConfig.selectedProduct }))
    return (
        <Box className="voicechat-container">
            <Box className="voicechat-wrapper">
                <Box className="callContainer">
                    <Box className="videoGridWrapper">
                        <Box className="voicechat-grid">
                            {
                                isVoiceChatConnected &&
                                <AgoraRTCProvider client={agoraEngine}>
                                    <AgoraManager config={AgoraConfig} ></AgoraManager>
                                </AgoraRTCProvider>
                            }
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
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default VoiceChat;