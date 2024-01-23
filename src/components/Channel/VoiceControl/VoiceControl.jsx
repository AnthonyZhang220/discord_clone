import React from 'react'

import { SvgIcon, Box, Tooltip, IconButton, Typography, Link, Breadcrumbs } from '@mui/material'
import { darken } from '@mui/material'
import { useSelector } from 'react-redux'
import SignalCellularAltRoundedIcon from '@mui/icons-material/SignalCellularAltRounded';
import CallEndRoundedIcon from '@mui/icons-material/CallEndRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import ScreenShareRoundedIcon from '@mui/icons-material/ScreenShareRounded';
import { toggleScreenShare, toggleCamera } from '../../../utils/handlers/voiceControlHandlers'
import { handleLeaveVoiceChannel } from '../../../utils/handlers/voiceChannelHandlers'

import "./VoiceControl.scss"


export default function VoiceControl() {
    const { isCameraOn, isScreenSharingOn, isVoiceChatConnected, connectionState, latency } = useSelector(state => state.voiceChat)
    const { currVoiceChannel } = useSelector(state => state.channel)

    return (
        <Box component="footer" className="voice-control-container">
            <Box className="voice-control-upper">
                <Box className="voice-control-details" sx={{ marginRight: "auto" }}>
                    <Box className="voice-control-status" sx={{ color: connectionState !== "DISCONNECTED" ? "#23a459" : "white" }}>
                        <Tooltip arrow sx={{ background: latency < 100 ? "#23a55a" : latency < 300 ? "#f0b132" : "#f23f42", color: "whitesmoke" }} title={
                            <React.Fragment>
                                <Typography variant='body2'>
                                    {latency} ms
                                </Typography>
                            </React.Fragment>
                        } placement='top'>
                            <span>
                                <SignalCellularAltRoundedIcon sx={{ height: 20, width: 20 }} />
                            </span>
                        </Tooltip>
                        <Link underline="hover" variant='body1' sx={{ color: connectionState !== "DISCONNECTED" ? "#23a459" : "white" }}>
                            {connectionState}
                        </Link>
                    </Box>
                    <Breadcrumbs aria-label="breadcrumb" separator="/" style={{ color: "whitesmoke" }}>
                        <Link underline="hover" variant='body2'>
                            {connectionState !== "DISCONNECTED" ? currVoiceChannel.serverName : connectionState}
                        </Link>
                        <Link underline="hover" variant='body2'>
                            {connectionState !== "DISCONNECTED" ? currVoiceChannel.name : connectionState}
                        </Link>
                    </Breadcrumbs>
                </Box>
                <Box className="voice-control-disconnected" sx={{ ml: "auto" }}>
                    <Tooltip title="Disconnect" placement='top'>
                        <IconButton className="voice-control-button" aria-label="Defen" onClick={() => {
                            handleLeaveVoiceChannel()
                        }}
                        >
                            <CallEndRoundedIcon sx={{ height: 20, width: 20 }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            <Box className="voice-control-lower">
                <Box className="voice-control-buttons button-group" sx={{ ml: "auto" }}>
                    <Tooltip title={isCameraOn ? "Turn Off Camera" : "Turn On Camera"} placement='top'>
                        <Box className="voice-control-button" aria-label={isCameraOn ? "Camera On" : "Camera Off "} sx={{
                            backgroundColor: isCameraOn ? "#23a459" : "#2b2d31", borderRadius: "4px", width: "40px", height: "30px",
                        }} onClick={() => {
                            toggleCamera()
                        }}
                        >
                            <IconButton>
                                <VideocamRoundedIcon sx={{ height: 20, width: 20, textAlign: "center" }} />
                            </IconButton>
                        </Box>
                    </Tooltip>
                    <Tooltip title={isScreenSharingOn ? "Stop sharing Your Screen" : "Share Your Screen"} placement='top'>
                        <Box className="voice-control-button" aria-label={isScreenSharingOn ? "sharing enabled" : "sharing disabled"} sx={{
                            backgroundColor: isScreenSharingOn ? "#23a459" : "#2b2d31", borderRadius: "4px", width: "40px", height: "30px"
                        }} onClick={() => {
                            toggleScreenShare()
                        }}
                        >
                            <IconButton>
                                <ScreenShareRoundedIcon sx={{ height: 20, width: 20, textAlign: "center" }} />
                            </IconButton>
                        </Box>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    )
}
