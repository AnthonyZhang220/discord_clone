import React from 'react'
import { Box, Avatar, Grid, Button, Typography, IconButton } from '@mui/material'
import VideocamIcon from '@mui/icons-material/Videocam';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { Mic } from '@mui/icons-material';
import { useSelector } from 'react-redux';

function VoiceChatTile({ user, volume, hasVideo, hasAudio }) {
    return (
        <Box key={user.id} className="voicechat-row" sx={{ transition: "background-color 0.1s" }} >
            <Box className="videoWrapper">
            </Box>
            <Avatar src={user.avatar} alt={user.displayName} sx={{ position: "absolute", left: "50%", top: "50%", width: 100, height: 100, mt: "-50px", ml: "-50px" }} imgProps={{ crossOrigin: "Anonymous" }} />
            <Box className="overlayContainer">
                <Box className="overlayTop">
                </Box>
                <Box className="overlayBottom">
                    <Button sx={{ position: "absolute", left: 5, bottom: 5, color: volume > 50 ? "green" : "white" }} variant="outlined" startIcon={hasVideo ? <VideocamIcon /> : <VideocamOffIcon />}>
                        <Typography variant='h5'>
                            {user.displayName}
                        </Typography>
                    </Button>
                    <IconButton sx={{ color: "white", position: "absolute", right: 5, bottom: 5, border: "solid 1px" }} >
                        {
                            hasAudio ?
                                <Mic />
                                :
                                <MicOffIcon />
                        }
                    </IconButton>
                </Box>
            </Box>
        </Box>
    )
}

export default VoiceChatTile