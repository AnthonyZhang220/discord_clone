import React, { useRef } from 'react'
import { Box } from '@mui/material'
import VoiceChatTile from './VoiceChatTile/VoiceChatTile';
import VoiceChatVideo from './VoiceChatVideo/VoiceChatVideo';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import "./VoiceChat.scss"




const VoiceChat = ({ currentVoiceChannel }) => {
    return (
        <Box className="voicechat-container">
            <Box className="voicechat-wrapper">
                <Box className="callContainer">
                    <Box className="videoGridWrapper">
                        <Box className="voicechat-grid">
                            {remoteUser.hasVideo ?
                                <VoiceChatVideo /> :
                                <VoiceChatTile />
                            }
                        </Box>
                    </Box>
                    <Box className="voicechat-control">
                        <Box className="gradient-top">
                            <VolumeUpIcon sx={{ color: "#8a8e94", marginRight: "6px", alignItems: "baseline" }} />
                            <Box component="span" variant="h3" className="voicechat-header-title">
                                {currentVoiceChannel.name}
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
