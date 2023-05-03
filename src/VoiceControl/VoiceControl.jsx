import React from 'react'

import { SvgIcon, Box, Badge, Avatar, Tooltip, IconButton, Typog, SvgIconraphy, Typography } from '@mui/material'
import DisconnectIcon from "./disconnect.svg"
import LatencyIcon from "./latency.svg"
import { getPing } from '../WebSocket'

import { leaveVoiceChatRoom } from '../WebSocket'

import "./VoiceControl.scss"


export default function VoiceControl({ currentVoiceChannel, currentUser, setConnected, handleLeaveRoom }) {

    return (
        <Box component="footer" className="voice-control-container">
            <Box className="voice-control-details">
                <Tooltip title={
                    <React.Fragment>
                        <Typography>
                            {getPing()}
                        </Typography>
                    </React.Fragment>
                } placement='top'>
                    <IconButton>
                        <SvgIcon component={LatencyIcon} sx={{ height: 20, width: 20 }} />
                    </IconButton>
                </Tooltip>
            </Box>
            <Box className="voice-control-details" sx={{ mr: "auto" }}>
                <Typography variant='body1'>
                    Voice Connected
                </Typography>
            </Box>
            <Box className="voice-control-controls button-group" sx={{ ml: "auto" }}>
                <Tooltip title="Disconnect" placement='top'>
                    <IconButton className="voice-control-button" aria-label="Defen" onClick={() => {
                        handleLeaveRoom(currentVoiceChannel.uid, currentUser)
                        setConnected(false)
                    }}
                    >
                        <SvgIcon component={DisconnectIcon} sx={{ height: 20, width: 20 }} />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    )
}
