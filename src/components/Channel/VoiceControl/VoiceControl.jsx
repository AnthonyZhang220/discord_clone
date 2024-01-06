import React from 'react'

import { SvgIcon, Box, Badge, Avatar, Tooltip, IconButton, Typog, SvgIconraphy, Typography, Link, Breadcrumbs } from '@mui/material'
import DisconnectIcon from "./disconnect.svg"
import LatencyIcon from "./latency.svg"
import { darken } from '@mui/material'
import { useSelector } from 'react-redux'


import VideocamIcon from '@mui/icons-material/Videocam';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';

import "./VoiceControl.scss"


export default function VoiceControl({ }) {
    const { isMuted, isDeafen, isCameraOn, isScreenSharingOn, isVoiceChatConnected, connectionState, latency } = useSelector(state => state.voiceChat)
    const { currVoiceChannel } = useSelector(state => state.channel)
    const { currServer } = useSelector(state => state.server)
    return (
        <Box component="footer" className="voice-control-container">
            <Box className="voice-control-upper">
                <Box className="voice-control-details" sx={{ marginRight: "auto" }}>
                    <Box className="voice-control-status" sx={{ color: connectionState.state !== "DISCONNECTED" ? "#23a459" : "white" }}>
                        <Tooltip arrow sx={{ background: latency < 100 ? "#23a55a" : latency < 300 ? "#f0b132" : "#f23f42", color: "whitesmoke" }} title={
                            <React.Fragment>
                                <Typography variant='body2'>
                                    {latency} ms
                                </Typography>
                            </React.Fragment>
                        } placement='top'>
                            <span>
                                <SvgIcon component={LatencyIcon} sx={{ height: 20, width: 20, marginRight: "2px" }} />
                            </span>
                        </Tooltip>
                        <Link underline="hover" variant='body1' sx={{ color: connectionState.state !== "DISCONNECTED" ? "#23a459" : "white" }}>
                            {connectionState.state}
                        </Link>
                    </Box>
                    <Breadcrumbs aria-label="breadcrumb" separator="/" style={{ color: "whitesmoke" }}>
                        <Link underline="hover" variant='body2'>
                            {connectionState.state !== "DISCONNECTED" ? currVoiceChannel.name : connectionState.state}
                        </Link>
                        <Link underline="hover" variant='body2'>
                            {connectionState.state !== "DISCONNECTED" ? currServer.name : connectionState.state}
                        </Link>
                    </Breadcrumbs>
                </Box>
                <Box className="voice-control-controls button-group" sx={{ ml: "auto" }}>
                    <Tooltip title="Disconnect" placement='top'>
                        <IconButton className="voice-control-button" aria-label="Defen" onClick={() => {
                            handleLeaveVoiceChannel()
                        }}
                        >
                            <SvgIcon component={DisconnectIcon} sx={{ height: 20, width: 20 }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            <Box className="voice-control-lower">
                <Box className="voice-control-controls button-group" sx={{ ml: "auto" }}>
                    <Tooltip title={isCameraOn ? "Turn Off Camera" : "Turn On Camera"} placement='top'>
                        <Box className="voice-control-button" aria-label={isCameraOn ? "Video Muted" : "Video Unmuted"} sx={{
                            backgroundColor: isCameraOn ? "#2b2d31" : "#23a459", borderRadius: "4px", width: "40px", height: "30px", "&:hover": {
                                backgroundColor: isCameraOn ? darken("#2b2d31", 0.1) : darken("#23a459", 0.1)
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
                    <Tooltip title={isScreenSharingOn ? "Close Your Screen" : "Share Your Screen"} placement='top'>
                        <Box className="voice-control-button" aria-label={isScreenSharingOn ? "sharing enabled" : "sharing disabled"} sx={{
                            backgroundColor: isScreenSharingOn ? "#23a459" : "#2b2d31", borderRadius: "4px", width: "40px", height: "30px", "&:hover": {
                                backgroundColor: isScreenSharingOn ? darken("#23a459", 0.1) : darken("#2b2d31", 0.1)
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
