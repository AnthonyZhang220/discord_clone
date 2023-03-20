import React from 'react'
import { auth } from '../firebase';



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
import { Tooltip } from '@mui/material';
import { Button } from '@mui/material';


import "./Channel.scss"



const Channel = ({ currentUser, signOut }) => {



    const [muted, setMuted] = React.useState(true);
    const [defen, setDefen] = React.useState(false);


    React.useEffect(() => {

        const $ = document.querySelectorAll.bind(document);

        $(".channel-text").forEach(el => {
            el.addEventListener("click", () => {
                $(".channel-text.active")[0].classList.remove("active");
                el.classList.add("active");
            });
        })

        // focus/blur on channel header click
        $(".channel-header")[0].addEventListener("click", e => {
            e.preventDefault();

            const focused = document.activeElement === e.target;
            focused ? e.target.blur() : e.target.focus();
        });

        $(".focusable, .button").forEach(el => {
            // blur only on mouse click
            // for accessibility, keep focus when keyboard focused
            el.addEventListener("mousedown", e => e.preventDefault());
            el.setAttribute("tabindex", "0");
        });
    }, [])

    return (
        <Box component="aside" className='channel-container'>
            <Box component="header" className="channel-header focusable">
                <Typography component="h3" className="channel-header-name" variant='h3'>
                    My Server
                </Typography>
                <IconButton aria-label="dropdown" className="channel-header-dropdown">
                    <ArrowDropDownIcon />
                </IconButton>
            </Box>
            <Box component="section" className="channel-list-container">
                <Box component="header" className="channel-list-header focusable">
                    <Typography component="h6" variant="h6">
                        Text Channels
                    </Typography>
                    <Box component="ul" className="channel-list-text">
                        <Box component="li" className="channel focusable channel-text active">
                            <Box component="span" className="channel-name">general</Box>
                            <IconButton aria-label="settings" className="button">
                                <SettingsIcon />
                            </IconButton>
                            <IconButton aria-label="settings" className="button">
                                <SettingsIcon />
                            </IconButton>
                        </Box>
                        <Box component="li" className="channel focusable channel-text">
                            <Box component="span" className="channel-name">help</Box>
                            <IconButton aria-label="settings" className="button">
                                <SettingsIcon />
                            </IconButton>
                            <IconButton aria-label="settings" className="button">
                                <SettingsIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
                <Box component="header" className="channel-list-header focusable">
                    <Typography component="h6" variant="h6">Voice Channels</Typography>
                </Box>
            </Box>
            <Box component="footer" className="channel-footer-container">
                <Button className="channel-footer-profile" onClick={signOut}>
                    <Avatar alt="Name" src={currentUser.profileURL ? currentUser.profileURL : "https://cdn.discordapp.com/icons/41771983423143937/edc44e98a690a1f76c5ddec68a0a6b9e.png"} className="avatar" />
                    <Box className="channels-footer-details">
                        <Box component="span" className="username">{currentUser.name ? currentUser.name : "Name"}</Box>
                        <Box component="span" className="tag"></Box>
                    </Box>
                </Button>
                <Box className="channels-footer-controls button-group">
                    {
                        muted ?
                            <Tooltip title="Unmute" placement='top'>
                                <IconButton aria-label="Mute" color="error" onClick={() => setMuted(!muted)}>
                                    <MicOffIcon />
                                </IconButton>
                            </Tooltip>
                            :
                            <Tooltip title="Mute" placement='top'>
                                <IconButton aria-label="Mute" color="success" onClick={() => setMuted(!muted)}>
                                    <MicIcon />
                                </IconButton>
                            </Tooltip>
                    }
                    {
                        defen ?
                            <Tooltip title="Undefen" placement='top'>
                                <IconButton aria-label="Defen" color="error" onClick={() => setDefen(!defen)}>
                                    <HeadsetOffIcon />
                                </IconButton>
                            </Tooltip>
                            :
                            <Tooltip title="Defen" placement='top'>
                                <IconButton aria-label="Defen" color="success" onClick={() => setDefen(!defen)}>
                                    <HeadsetIcon />
                                </IconButton>
                            </Tooltip>
                    }
                    <Tooltip title="Settings" >
                        <IconButton aria-label="Settings">
                            <SettingsIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    )
}

export default Channel