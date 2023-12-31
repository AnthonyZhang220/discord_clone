import React, { createRef, useEffect, useRef, useState } from "react";

import { onSnapshot, query, where, addDoc, collection, deleteDoc, doc, updateDoc, getDocs } from 'firebase/firestore';
import { auth } from '../firebase';
import { db } from "../firebase";

import { Box, ListItemText, ListItem, Badge, ListItemButton, Popover, Avatar, Divider, ClickAwayListener, Tooltip } from '@mui/material'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import HeadsetIcon from '@mui/icons-material/Headset';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CircleIcon from '@mui/icons-material/Circle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SwapVertIcon from '@mui/icons-material/SwapVert';

import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ColorThief from "colorthief"


import StatusList from '../StatusList';
import {
    StatusMenu, MenuListItemButton
} from "../CustomUIComponents";
import "./UserFooter.scss";

// import { mute, unmute } from "../WebSocket";

//Change the format of status text
const statusFormat = (status) => {
    if (status === "online") {
        return "Online"
    }
    if (status === "offline") {
        return "Offline"
    }
    if (status === "donotdisturb") {
        return "Do Not Disturb"
    }
    if (status === "invisible") {
        return "Invisible"
    }
    if (status === "idle") {
        return "Idle"
    }
}


//user avatar click
const UserDetail = ({ currentUser, changeStatus, openUserDetail, handleUserDetailClose, userAvatarRef, signOut }) => {

    const profileRef = useRef(null);
    const [bannerColor, setBannerColor] = useState("")

    useEffect(() => {
        if (profileRef.current) {
            const colorthief = new ColorThief();
            const banner = colorthief.getColor(profileRef.current)
            const rgbColor = `rgb(${banner.join(", ")})`
            setBannerColor(rgbColor)
            console.log(banner)
        }

    }, [profileRef.current, openUserDetail])



    return (
        <Popover
            className='user-detail-paper'
            open={openUserDetail}
            onClose={handleUserDetailClose}
            anchorReference="anchorEl"
            anchorEl={userAvatarRef.current}
            PaperProps={{
                style: {
                    background: "#232428", borderRadius: "8px 8px 8px 8px", width: "340px", fontSize: 14,
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    maxHeight: "calc(100vh - 28px)",
                }
            }}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 150,
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
        >
            <Box>
                <Box className="user-detail-top">
                    <svg className="user-detail-banner">
                        <mask id="uid_347">
                            <rect></rect>
                            <circle></circle>
                        </mask>
                        <foreignObject className="user-detail-object">
                            <Box sx={{ backgroundColor: bannerColor, height: "60px", width: "100%", transition: "background-color 0.1s" }}>
                            </Box>
                        </foreignObject>
                    </svg>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        className="user-detail-avatar"
                        badgeContent={
                            <StatusList status={currentUser.status} />
                        }
                    >
                        <Avatar alt={currentUser.name} sx={{ width: "80px", height: "80px" }} src={currentUser.profileURL} imgProps={{ ref: profileRef, crossOrigin: "Anonymous" }} />
                    </Badge>
                </Box>
                <Box className="user-detail-list" sx={{ backgroundColor: "#111214" }}>
                    <ListItem dense>
                        <MenuListItemButton>
                            <ListItemText primary={currentUser.name} primaryTypographyProps={{ variant: "h3" }} />
                        </MenuListItemButton>
                    </ListItem>
                    <Divider style={{ backgroundColor: "#8a8e94" }} variant="middle" light={true} />
                    <ListItem dense>
                        <MenuListItemButton>
                            <ListItemText primary="MEMBER SINCE" primaryTypographyProps={{ variant: "h5" }} secondary={new Date(currentUser.createdAt * 1000).toLocaleDateString('en-US', { month: "short", day: "2-digit", year: "numeric" })} secondaryTypographyProps={{
                                style: {
                                    color: "white"
                                }
                            }} />
                        </MenuListItemButton>
                    </ListItem>
                    <Divider style={{ backgroundColor: "#8a8e94" }} variant="middle" light={true} />
                    <ListItem dense>
                        <StatusMenu
                            disableFocusListener disableTouchListener
                            placement="right"
                            title={
                                <React.Fragment>
                                    <ListItem sx={{ pl: 1, pr: 1 }}>
                                        <MenuListItemButton onClick={() => changeStatus("online")} sx={{
                                            "&:hover": {
                                                backgroundColor: "#5865f2",
                                                borderRadius: "4px",
                                            }
                                        }}>
                                            <CircleIcon edge="start" sx={{ mr: 2, color: "#23a55a" }} />
                                            <ListItemText primary="Online" />
                                        </MenuListItemButton>
                                    </ListItem>
                                    <Divider sx={{ backgroundColor: "white", mt: 0.5, mb: 0.5 }} variant="middle" />
                                    <ListItem sx={{ pl: 1, pr: 1 }}>
                                        <MenuListItemButton onClick={() => changeStatus("idle")} sx={{
                                            "&:hover": {
                                                backgroundColor: "#5865f2",
                                                borderRadius: "4px",
                                            }
                                        }}>
                                            <DarkModeIcon edge="start" sx={{ mr: 2, color: "#f0b132" }} />
                                            <ListItemText primary="Idle" />
                                        </MenuListItemButton>
                                    </ListItem>
                                    <ListItem sx={{ pl: 1, pr: 1 }}>
                                        <MenuListItemButton onClick={() => changeStatus("donotdisturb")} sx={{
                                            "&:hover": {
                                                backgroundColor: "#5865f2",
                                                borderRadius: "4px",
                                            }
                                        }}>
                                            <RemoveCircleIcon edge="start" sx={{ mr: 2, color: "#f23f43" }} />
                                            <ListItemText primary="Do Not Disturb" secondary="You will not receive any desktop notifications." secondaryTypographyProps={{
                                                style: {
                                                    color: "white"
                                                }
                                            }} />
                                        </MenuListItemButton>
                                    </ListItem>
                                    <ListItem sx={{ pl: 1, pr: 1 }}>
                                        <MenuListItemButton onClick={() => changeStatus("invisible")} sx={{
                                            "&:hover": {
                                                backgroundColor: "#5865f2",
                                                borderRadius: "4px",
                                            }
                                        }}>
                                            <StopCircleIcon edge="start" sx={{ color: "#80848e", mr: 2 }} />
                                            <ListItemText primary="Invisible" secondary="You will not appear online, but will have full access." secondaryTypographyProps={{
                                                style: {
                                                    color: "white"
                                                }
                                            }} />
                                        </MenuListItemButton>
                                    </ListItem>
                                </React.Fragment>
                            }>
                            <MenuListItemButton sx={{
                                "&:hover": {
                                    backgroundColor: "#5865f2",
                                    borderRadius: "4px",
                                }
                            }}>

                                <StatusList edge={"start"} status={currentUser.status} size={15} />
                                <ListItemText primary={statusFormat(currentUser.status)} sx={{ ml: 1 }} />
                                <NavigateNextIcon edge="end" sx={{ color: "white" }} />
                            </MenuListItemButton>
                        </StatusMenu>
                    </ListItem>
                    <ListItem dense >
                        <MenuListItemButton onClick={handleUserDetailClose} sx={{
                            "&:hover": {
                                backgroundColor: "#5865f2",
                                borderRadius: "4px",
                            }
                        }}>
                            <SwapVertIcon edge="start" sx={{ color: "white" }} />
                            <ListItemText primary="Switch Accounts" />
                            <NavigateNextIcon edge="end" sx={{ color: "white" }} />
                        </MenuListItemButton>
                    </ListItem>
                    <ListItem dense >
                        <MenuListItemButton onClick={signOut} sx={{
                            "&:hover": {
                                backgroundColor: "red",
                                borderRadius: "4px",
                            }
                        }}>
                            <ListItemText primary="Log Out" />
                            <LogoutIcon edge="end" sx={{ color: "white" }} />
                        </MenuListItemButton>
                    </ListItem>
                </Box>
            </Box>
        </Popover>
    )
}

const UserFooter = ({ currentUser, signOut, setCurrentUser, handleLeaveRoom, muted, defen, handleDefen, handleVoiceMuted }) => {

    const userAvatarRef = React.useRef(null);
    const [openUserDetail, setOpenUserDetails] = React.useState(false);
    const [openStatus, setOpenStatus] = React.useState(false);

    const handleStatusOpen = () => {
        setOpenStatus(true);
    }

    const handleStatusClose = () => {
        setOpenStatus(false);
    }

    const handleUserDetailOpen = () => {
        setOpenUserDetails(true);
    }

    const handleUserDetailClose = () => {
        setOpenUserDetails(false);
    }


    const changeStatus = async (status) => {
        const userObj = JSON.parse(localStorage.getItem(`${currentUser.uid}`))

        localStorage.setItem(`${currentUser.uid}`, JSON.stringify({ ...userObj, status: status }))

        await updateDoc(doc(db, "users", currentUser.uid), {
            status: status
        })
        setCurrentUser({ ...currentUser, status: status })
    }


    return (
        <Box component="footer" className="user-footer-container" ref={userAvatarRef}>
            <Box onClick={handleUserDetailOpen} className="user-footer-profile" >
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                        <StatusList status={currentUser.status} size={12} />
                    }
                >
                    <Avatar alt={currentUser.name} sx={{ width: "30px", height: "30px" }} src={currentUser.profileURL} className="avatar" />
                </Badge>
                <Box className="user-footer-details">
                    <Box className="username" sx={{ fontSize: 14 }}>
                        {currentUser.name}
                    </Box>
                    <Box component="span" className="tag"></Box>
                </Box>
            </Box>
            <UserDetail currentUser={currentUser} changeStatus={changeStatus} openUserDetail={openUserDetail} handleUserDetailClose={handleUserDetailClose} userAvatarRef={userAvatarRef} signOut={signOut} />
            <Box className="user-footer-controls button-group">
                {
                    muted ?
                        <Tooltip title="Unmute" placement='top'>
                            <IconButton className="user-footer-button" aria-label="Mute" color="error" onClick={() => {
                                handleVoiceMuted()
                            }}>
                                <MicOffIcon sx={{ height: 20, width: 20 }} />
                            </IconButton>
                        </Tooltip>
                        :
                        <Tooltip title="Mute" placement='top'>
                            <IconButton className="user-footer-button" aria-label="Mute" color="success" onClick={() => {
                                handleVoiceMuted()
                            }} >
                                <MicIcon sx={{ height: 20, width: 20 }} />
                            </IconButton>
                        </Tooltip>
                }
                {
                    defen ?
                        <Tooltip title="Undefen" placement='top'>
                            <IconButton className="user-footer-button" aria-label="Defen" color="error" onClick={() => handleDefen()} >
                                <HeadsetOffIcon sx={{ height: 20, width: 20 }} />
                            </IconButton>
                        </Tooltip>
                        :
                        <Tooltip title="Defen" placement='top'>
                            <IconButton className="user-footer-button" aria-label="Defen" color="success" onClick={() => handleDefen()}>
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