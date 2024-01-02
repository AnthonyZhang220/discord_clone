import React from 'react'
import { Box, Avatar, Grid, Button, Typography, IconButton } from '@mui/material'
import VideocamIcon from '@mui/icons-material/Videocam';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

function VoiceChatTile() {
    return (
        <Box key={remoteUser.uid} className="voicechat-row" sx={{ transition: "background-color 0.1s" }} >
            <Box className="videoWrapper">
            </Box>
            {remoteUser.hasVideo ?
                null :
                <Avatar src={remoteUser.avatar} alt={remoteUser.name} sx={{ position: "absolute", left: "50%", top: "50%", width: 100, height: 100, mt: "-50px", ml: "-50px" }} imgProps={{ crossOrigin: "Anonymous" }} />
            }
            <Box className="overlayContainer">
                <Box className="overlayTop">

                </Box>
                <Box className="overlayBottom">
                    <Button sx={{ position: "absolute", left: 5, bottom: 5, color: remoteUser.volume > 50 ? "green" : "white" }} variant="outlined" startIcon={
                        remoteUser.hasVideo ?
                            <VideocamIcon />
                            :
                            <VideocamOffIcon />
                    }>
                        <Typography variant='h5'>
                            {remoteUser.name}
                        </Typography>
                    </Button>
                    {remoteUser.hasAudio ? null : (
                        <IconButton sx={{ color: "white", position: "absolute", right: 5, bottom: 5, border: "solid 1px" }} >
                            <MicOffIcon />
                        </IconButton>
                    )}
                </Box>
            </Box>
        </Box>
    )
}

export default VoiceChatTile