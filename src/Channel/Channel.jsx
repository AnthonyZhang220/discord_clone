import React from 'react'
import { Stack } from '@mui/system'
import { Avatar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import HeadsetIcon from '@mui/icons-material/Headset';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

import "./Channel.scss"

const Channel = () => {

    const [muted, setMuted] = React.useState(true);
    const [defen, setDefen] = React.useState(false);

    const handleHeader = (e) => {
        e.preventDefault();

        const focused = document.activeElement === e.target;
        focused ? e.target.blur() : e.target.focus();
    }

    React.useEffect(() => {
    })

    return (
        <Box component="aside" className='channel-container'>
            <Box component="header" className="channel-header" onClick={(e) => handleHeader(e)}>
                <Typography component="h3" className="channel-header-name">
                    My Server
                </Typography>
                <IconButton aria-label="dropdown" className="channel-header-dropdown">
                    <ArrowDropDownIcon />
                </IconButton>
            </Box>
            <Box component="header" className="channel-list-container">
                <Box className="channel-list-header">
                    <Typography component="h5" className="channel-list-header">
                        Text Channel
                    </Typography>
                    <Box component="ul" className="channel-list-text">
                        <Box component="li" className="channel focusable channel-text active">
                            <Typography component="span" className="channel-name">
                                general
                            </Typography>
                            <IconButton aria-label="settings">
                                <SettingsIcon />
                            </IconButton>
                            <IconButton aria-label="settings">
                                <SettingsIcon />
                            </IconButton>
                        </Box>
                        <Box component="li" className="channel focusable channel-text">
                            <Box component="span" className="channel-name">help</Box>
                            <IconButton aria-label="settings">
                                <SettingsIcon />
                            </IconButton>
                            <IconButton aria-label="settings">
                                <SettingsIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box component="footer" className="channel-footer-container">
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className="avatar" />
                <Box className="channels-footer-details">
                    <Box component="span" className="username">yourself</Box>
                    <Box component="span" className="tag">#0001</Box>
                </Box>
                <Box className="channels-footer-controls button-group">
                    {
                        muted ?
                            <IconButton aria-label="Mute" onClick={() => setMuted(!muted)}>
                                <MicOffIcon />
                            </IconButton> :
                            <IconButton aria-label="Mute" onClick={() => setMuted(!muted)} >
                                <MicIcon />
                            </IconButton>
                    }
                    {
                        defen ?
                            <IconButton aria-label="Defen" onClick={() => setDefen(!defen)}>
                                <HeadsetOffIcon />
                            </IconButton> :
                            <IconButton aria-label="Defen" onClick={() => setDefen(!defen)}>
                                <HeadsetIcon />
                            </IconButton>

                    }
                    <IconButton aria-label="Settings">
                        <SettingsIcon />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    )
}

export default Channel