import React from 'react'

import { SvgIcon, Box, Badge, Avatar, Tooltip, IconButton, Typog, SvgIconraphy, Typography, Link, Breadcrumbs } from '@mui/material'
import DisconnectIcon from "./disconnect.svg"
import LatencyIcon from "./latency.svg"
import { darken } from '@mui/material'


import VideocamIcon from '@mui/icons-material/Videocam';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';

import "./VoiceControl.scss"


export default function VoiceControl({ currentVoiceChannel, currentUser, voiceConnected, handleUserLeft, currentServer, isSharingEnabled, isMutedVideo, screenShareToggle, handleVideoMuted, stats }) {

    return (
        <Box component="footer" className="voice-control-container">
            <Box className="voice-control-upper">
                <Box className="voice-control-details" sx={{ marginRight: "auto" }}>
                    <Box className="voice-control-status" sx={{ color: voiceConnected ? "#23a459" : "white" }}>
                        <Tooltip arrow sx={{ backgroundColor: "#23a459", color: "whitesmoke" }} title={
                            <React.Fragment>
                                <Typography variant='body2'>
                                    {stats} ms
                                </Typography>
                            </React.Fragment>
                        } placement='top'>
                            <span>
                                <SvgIcon component={LatencyIcon} sx={{ height: 20, width: 20, marginRight: "2px" }} />
                            </span>
                        </Tooltip>
                        <Link underline="hover" variant='body1' sx={{ color: voiceConnected ? "#23a459" : "white" }}>
                            Voice Connected
                        </Link>
                    </Box>
                    <Breadcrumbs aria-label="breadcrumb" separator="/" style={{ color: "whitesmoke" }}>
                        <Link underline="hover" variant='body2'>
                            {voiceConnected ? currentVoiceChannel.name : "Loading"}
                        </Link>
                        <Link underline="hover" variant='body2'>
                            {voiceConnected ? currentServer.name : "Loading"}
                        </Link>
                    </Breadcrumbs>
                </Box>
                <Box className="voice-control-controls button-group" sx={{ ml: "auto" }}>
                    <Tooltip title="Disconnect" placement='top'>
                        <IconButton className="voice-control-button" aria-label="Defen" onClick={() => {
                            handleUserLeft()
                        }}
                        >
                            <SvgIcon component={DisconnectIcon} sx={{ height: 20, width: 20 }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            <Box className="voice-control-lower">
                <Box className="voice-control-controls button-group" sx={{ ml: "auto" }}>
                    <Tooltip title={isMutedVideo ? "Turn On Camera" : "Turn Off Camera"} placement='top'>
                        <Box className="voice-control-button" aria-label={isMutedVideo ? "Video Muted" : "Video Unmuted"} sx={{
                            backgroundColor: isMutedVideo ? "#2b2d31" : "#23a459", borderRadius: "4px", width: "40px", height: "30px", "&:hover": {
                                backgroundColor: isMutedVideo ? darken("#2b2d31", 0.1) : darken("#23a459", 0.1)
                            }
                        }} onClick={() => {
                            handleVideoMuted()
                        }}
                        >
                            <IconButton>
                                <VideocamIcon sx={{ height: 20, width: 20, textAlign: "center" }} />
                            </IconButton>
                        </Box>
                    </Tooltip>
                    <Tooltip title={isSharingEnabled ? "Close Your Screen" : "Share Your Screen"} placement='top'>
                        <Box className="voice-control-button" aria-label={isSharingEnabled ? "sharing enabled" : "sharing disabled"} sx={{
                            backgroundColor: isSharingEnabled ? "#23a459" : "#2b2d31", borderRadius: "4px", width: "40px", height: "30px", "&:hover": {
                                backgroundColor: isSharingEnabled ? darken("#23a459", 0.1) : darken("#2b2d31", 0.1)
                            }
                        }} onClick={() => {
                            screenShareToggle()
                        }}
                        >
                            <IconButton>
                                <ScreenShareIcon sx={{ height: 20, width: 20, textAlign: "center" }} />
                            </IconButton>
                        </Box>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    )
}
