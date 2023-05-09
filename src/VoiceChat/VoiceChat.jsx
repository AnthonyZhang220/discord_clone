import React, { useEffect, useRef, useState, forwardRef } from 'react'
import { Box, Avatar, Grid } from '@mui/material'
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import "./VoiceChat.scss"
import VideoPlayer from '../VideoPlayer/VideoPlayer';

const VoiceChat = forwardRef(({ currentVoiceChannel, isMutedVideo, currentUser, liveUsers }, ref) => {

    return (
        <Box className="voicechat-container">
            <Box className="voicechat-header">
                <VolumeUpIcon sx={{ color: "#8a8e94", marginRight: "6px", alignItems: "baseline" }} />
                <Box component="span" variant="h3" className="voicechat-header-title">
                    {currentVoiceChannel.name}
                </Box>
            </Box>
            <Box className="voicechat-content">
                <Box className="voicechat-wrapper">
                    <Grid className="voicechat-list">
                        {liveUsers?.map((liveUser) => (
                            <VideoPlayer liveUser={liveUser} key={liveUser.uid} />
                        ))}
                        <Box className="voicechat-row">
                            <Box className="voicechat-tile">
                                <video style={{ position: "relative", opacity: 1, left: 0, top: 0 }} />
                            </Box>
                        </Box>
                    </Grid>
                </Box>
            </Box>
            <Box className="voicechat-footer">
            </Box>
        </Box>
    )
})

export default VoiceChat;
