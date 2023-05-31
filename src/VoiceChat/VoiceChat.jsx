import React, { useEffect, useRef, useState, forwardRef } from 'react'
import { Box, Avatar, Grid, Button, Typography, IconButton } from '@mui/material'
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import "./VoiceChat.scss"
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import { VideoPlayerHolder } from '../VideoPlayer/VideoPlayer';
import { Query, onSnapshot, query, where, collection } from 'firebase/firestore';
import { db } from '../firebase';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import ColorThief from "colorthief"



const VoiceChat = ({ currentVoiceChannel, isMutedVideo, currentUser, liveUsers, setLiveUsers, currentAgoraUID }) => {

    const profileRef = useRef(null);
    const [bannerColor, setBannerColor] = useState("")

    // useEffect(() => {
    //     if (liveUsers && profileRef.current) {
    //         const colorthief = new ColorThief();
    //         const banner = colorthief.getColor(profileRef.current)
    //         const rgbColor = `rgb(${banner.join(", ")})`
    //         setBannerColor(rgbColor)
    //         console.log(banner)
    //     }

    // }, [liveUsers])

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
                    <Box className="voicechat-list">
                        {liveUsers !== null && liveUsers?.length != 0 && liveUsers?.map((liveUser) =>
                        (
                            liveUser ?
                                <Box key={liveUser.uid} className="voicechat-tile" sx={{ backgroundColor: bannerColor, transition: "background-color 0.1s" }}>
                                    <VideoPlayer liveUser={liveUser} currentAgoraUID={currentAgoraUID} />
                                    <Button sx={{ position: "absolute", left: 5, bottom: 5, color: liveUser.volume > 50 ? "green" : "white" }} variant="outlined" startIcon={
                                        liveUser.videoTrack?.enabled
                                            ?
                                            <VideocamIcon />
                                            :
                                            <VideocamOffIcon />
                                    }>
                                        <Typography variant='h5'>
                                            {liveUser.name}
                                        </Typography>
                                    </Button>
                                    {liveUser.audioTrack?.enabled ? null : (
                                        <IconButton sx={{ color: "white", position: "absolute", right: 5, bottom: 5, border: "solid 1px" }} >
                                            <MicOffIcon />
                                        </IconButton>
                                    )}
                                    {liveUser.videoTrack?.enabled ?
                                        null :
                                        <Avatar src={liveUser.avatar} alt={liveUser.name} sx={{ position: "absolute", left: "50%", top: "50%", width: 100, height: 100, mt: "-50px", ml: "-50px" }} imgProps={{ ref: profileRef, crossOrigin: "Anonymous" }} />
                                    }
                                </Box>
                                :
                                null
                        )
                        )}
                    </Box>
                </Box>
            </Box>
            <Box className="voicechat-footer">
            </Box>
        </Box>
    )
}

export default VoiceChat;
