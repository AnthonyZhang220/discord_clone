import React, { useRef } from "react";

import { Box, Badge, Avatar, Tooltip } from '@mui/material'
import HeadsetIcon from '@mui/icons-material/Headset';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';


import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import StatusList from '../../StatusList';
import { UserDetailPopover } from "./UserDetailPopover/UserDetailPopover";
import "./UserFooter.scss"
import { useDispatch, useSelector } from "react-redux";
import { setUserDetailPopover } from "../../../redux/features/popoverSlice";
import { toggleDeafen, toggleMic } from "../../../handlers/voiceControlHandlers";


const UserFooter = () => {

    const userAvatarRef = useRef(null);
    const dispatch = useDispatch();
    const { isMicOn, isDeafen } = useSelector((state) => state.voiceChat)
    const { user } = useSelector((state) => state.auth)

    return (
        <Box component="footer" className="user-footer-container" ref={userAvatarRef}>
            <Box onClick={() => dispatch(setUserDetailPopover(true))} className="user-footer-profile" >
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                        <StatusList status={user?.status} size={12} />
                    }
                >
                    <Avatar alt={user?.displayName} sx={{ width: "30px", height: "30px" }} src={user?.avatar} className="avatar" />
                </Badge>
                <Box className="user-footer-details">
                    <Box className="username" sx={{ fontSize: 14 }}>
                        {user?.displayName}
                    </Box>
                    <Box component="span" className="tag"></Box>
                </Box>
            </Box>
            <UserDetailPopover userAvatarRef={userAvatarRef} />
            <Box className="user-footer-controls button-group">
                {
                    isMicOn ?
                        <Tooltip title="Mute" placement='top'>
                            <IconButton className="user-footer-button" aria-label="Mute" color="success" onClick={() => {
                                toggleMic()
                            }} >
                                <MicIcon sx={{ height: 20, width: 20 }} />
                            </IconButton>
                        </Tooltip>
                        :
                        <Tooltip title="Unmute" placement='top'>
                            <IconButton className="user-footer-button" aria-label="Mute" color="error" onClick={() => {
                                toggleMic()
                            }}>
                                <MicOffIcon sx={{ height: 20, width: 20 }} />
                            </IconButton>
                        </Tooltip>
                }
                {
                    isDeafen ?
                        <Tooltip title="Undefen" placement='top'>
                            <IconButton className="user-footer-button" aria-label="Defen" color="error" onClick={() =>
                                toggleDeafen()
                            } >
                                <HeadsetOffIcon sx={{ height: 20, width: 20 }} />
                            </IconButton>
                        </Tooltip>
                        :
                        <Tooltip title="Defen" placement='top'>
                            <IconButton className="user-footer-button" aria-label="Defen" color="success" onClick={() =>
                                toggleDeafen()
                            }
                            >
                                <HeadsetIcon sx={{ height: 20, width: 20 }} />
                            </IconButton>
                        </Tooltip>
                }
                <Tooltip title="Settings" >
                    <IconButton className="user-footer-button" aria-label="Settings" >
                        <SettingsIcon sx={{ height: 20, width: 20 }} />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    )
}

export default UserFooter;