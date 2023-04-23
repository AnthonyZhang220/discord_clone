import React from 'react'

import { SvgIcon, Box, Badge, Avatar, Tooltip, IconButton, Typog, SvgIconraphy, Typography } from '@mui/material'
import DisconnectIcon from "./disconnect.svg"
import PingIcon from "./ping.svg"
import { getPing } from '../WebSocket'

import { leaveVoiceChatRoom } from '../WebSocket'

import "./VoiceControl.scss"


export default function VoiceControl({ currentVoiceChannel, currentUser }) {

    return (
        <Box component="footer" className="voice-control-container">
            <Box className="voice-control-details">
                <Tooltip title={`${getPing}`} placement='top'>
                    <SvgIcon inheritViewBox component={PingIcon} />
                </Tooltip>
                <Box className="text" sx={{ fontSize: 14 }}>
                    <Typography variant='body1'>
                        Voice Connected
                    </Typography>
                </Box>
            </Box>
            <Box className="voice-control-controls button-group">
                <Tooltip title="Disconnect" placement='top'>
                    <IconButton className="voice-control-button" aria-label="Defen" color="error" onClick={() => {
                        leaveVoiceChatRoom(currentVoiceChannel.uid, currentUser)
                    }}
                    >
                        <SvgIcon inheritViewBox component={DisconnectIcon} />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    )
}
