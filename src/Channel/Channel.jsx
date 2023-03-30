import React from 'react'
import { auth } from '../firebase';
import { db } from "../firebase";
import { onSnapshot, query, where, addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';


import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, ListItemText, ListItem, ListItemIcon, Paper, Badge, ClickAwayListener, List, ListItemButton, Popover } from '@mui/material'
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
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Divider } from '@mui/material';
import Fade from '@mui/material/Fade';
import Popper, { PopperPlacementType } from '@mui/material/Popper';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LogoutIcon from '@mui/icons-material/Logout';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SwapVertIcon from '@mui/icons-material/SwapVert';


import "./Channel.scss"
import { async } from '@firebase/util';



const StyledListItemButton = styled(ListItemButton)(() => ({
    padding: "2px 2px 2px 2px",
}));


const Channel = ({ currentServer, signOut, currentUser, handleAddChannel, handleCurrentChannel, channelModal, setChannelModal, handleChannelInfo, currentChannel }) => {


    const [channelList, setChannelList] = React.useState([])

    const [muted, setMuted] = React.useState(true);
    const [defen, setDefen] = React.useState(false);




    //get channel list
    React.useEffect(() => {
        if (currentServer) {
            const q = query(collection(db, "channels"), where("serverRef", "==", currentServer.uid));
            const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                let channelList = [];
                QuerySnapshot.forEach((doc) => {
                    channelList.push({ ...doc.data(), id: doc.id });
                })
                setChannelList(channelList)
            })
        }

    }, [currentServer])

    React.useEffect(() => {

        // const channelList = document.querySelectorAll(".channel-text");
        // const selected = document.querySelector(`#${currentChannel.uid}`)

        // channelList.forEach(el => {
        //     el.addEventListener("click", () => {
        //         channelList.forEach((ele) => {
        //             ele.classList.remove("active")
        //         })
        //         selected.classList.add("active");
        //     });
        // })

        // // focus/blur on channel header click
        // $(".channel-header")[0].addEventListener("click", e => {
        //     e.preventDefault();

        //     const focused = document.activeElement === e.target;
        //     focused ? e.target.blur() : e.target.focus();
        // });

        // $(".focusable, .button").forEach(el => {
        //     // blur only on mouse click
        //     // for accessibility, keep focus when keyboard focused
        //     el.addEventListener("mousedown", e => e.preventDefault());
        //     el.setAttribute("tabindex", "0");
        // });

    }, [])


    const channelHeaderRef = React.useRef(null);
    const userAvatarRef = React.useRef(null);
    const userStatusRef = React.useRef(null);
    const [openSettings, setOpenSettings] = React.useState(false);
    const [openUserDetail, setOpenUserDetails] = React.useState(false);
    const [openStatus, setOpenStatus] = React.useState(false);

    const handleUserDetailOpen = () => {
        setOpenUserDetails(true);
    }

    const handleUserDetailClose = () => {
        setOpenUserDetails(false);
    }

    const handleServerSettingsOpen = () => {
        setOpenSettings(true)
    }
    const handleServerSettingsClose = () => {
        setOpenSettings(false)
    }

    const handleDeleteServer = () => {
        handleServerSettingsClose();

        const parse = JSON.parse(localStorage.getItem(`${currentUser.uid}`))
        const newLocal = parse.filter(({ currentServer }) => currentServer != currentServer.uid);
        localStorage.setItem(`${currentUser.uid}`, JSON.stringify(newLocal))

        const serverRef = doc(db, "servers", currentServer.uid)
        deleteDoc(serverRef)
    }

    const handleStatus = () => {
        setOpenStatus(true);
    }

    const changeStatus = async (status) => {
        await updateDoc(doc(db, "users", currentUser.uid), {
            status: status
        })
    }



    //user avatar click
    const UserDetail = () => {
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
                            </foreignObject>
                        </svg>
                        <StyledBadge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                            className="user-detail-avatar"
                        >
                            <Avatar alt="Name" sx={{ width: "75px", height: "75px" }} src={currentUser.profileURL ? currentUser.profileURL : "https://cdn.discordapp.com/icons/41771983423143937/edc44e98a690a1f76c5ddec68a0a6b9e.png"} />
                        </StyledBadge>
                    </Box>
                    <Box className="user-detail-list" sx={{ backgroundColor: "#111214" }}>
                        <ListItem dense>
                            <StyledListItemButton>
                                <ListItemText primary={currentUser.name} primaryTypographyProps={{ variant: "h3" }} />
                            </StyledListItemButton>
                        </ListItem>
                        <Divider style={{ backgroundColor: "#8a8e94" }} variant="middle" light={true} />
                        <ListItem dense>
                            <StyledListItemButton>
                                <ListItemText primary="MEMBER SINCE" primaryTypographyProps={{ variant: "h5" }} secondary={new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: "short", day: "2-digit", year: "numeric" })} secondaryTypographyProps={{
                                    style: {
                                        color: "white"
                                    }
                                }} />
                            </StyledListItemButton>
                        </ListItem>
                        <Divider style={{ backgroundColor: "#8a8e94" }} variant="middle" light={true} />
                        <ListItem dense ref={userStatusRef}>
                            <StyledListItemButton onFocus={handleStatus} sx={{
                                "&:hover": {
                                    backgroundColor: "#5865f2",
                                    borderRadius: "4px",
                                }
                            }}>
                                <SwapVertIcon edge="start" sx={{ color: "white" }} />
                                <ListItemText primary={currentUser.status} />
                                <NavigateNextIcon edge="end" sx={{ color: "white" }} />
                            </StyledListItemButton>
                        </ListItem>
                        <Status />
                        <ListItem dense >
                            <StyledListItemButton onClick={handleUserDetailClose} sx={{
                                "&:hover": {
                                    backgroundColor: "#5865f2",
                                    borderRadius: "4px",
                                }
                            }}>
                                <SwapVertIcon edge="start" sx={{ color: "white" }} />
                                <ListItemText primary="Switch Accounts" />
                                <NavigateNextIcon edge="end" sx={{ color: "white" }} />
                            </StyledListItemButton>
                        </ListItem>
                        <ListItem dense >
                            <StyledListItemButton onClick={signOut} sx={{
                                "&:hover": {
                                    backgroundColor: "red",
                                    borderRadius: "4px",
                                }
                            }}>
                                <ListItemText primary="Log Out" />
                                <LogoutIcon edge="end" sx={{ color: "white" }} />
                            </StyledListItemButton>
                        </ListItem>
                    </Box>
                </Box>
            </Popover>
        )
    }

    //user status
    const Status = () => {


        return (
            <Popover
                className='user-detail-paper'
                open={openStatus}
                onClose={handleStatus}
                anchorReference="anchorEl"
                anchorEl={userStatusRef.current}
                PaperProps={{
                    style: {
                        background: "#111214", borderRadius: "4px", width: "340px", fontSize: 14,
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                        maxHeight: "calc(100vh - 28px)",
                    }
                }}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 300,
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box>
                    <ListItem dense sx={{ p: 0.75 }}>
                        <ListItemButton onClick={() => changeStatus("online")} sx={{
                            "&:hover": {
                                backgroundColor: "#5865f2",
                                borderRadius: "4px",
                            }
                        }}>
                            <ListItemText primary="Online" />
                        </ListItemButton>
                    </ListItem>
                    <Divider />
                    <ListItem dense sx={{ p: 0.75 }}>
                        <ListItemButton onClick={() => changeStatus("idle")} sx={{
                            "&:hover": {
                                backgroundColor: "#5865f2",
                                borderRadius: "4px",
                            }
                        }}>
                            <ListItemText primary="Idle" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem dense sx={{ p: 0.75 }}>
                        <ListItemButton onClick={() => changeStatus("donotdisturb")} sx={{
                            "&:hover": {
                                backgroundColor: "#5865f2",
                                borderRadius: "4px",
                            }
                        }}>
                            <ListItemText primary="Do Not Disturb" secondary="You will not receive any desktop notifications." />
                        </ListItemButton>
                    </ListItem>
                    <ListItem dense sx={{ p: 0.75 }}>
                        <ListItemButton onClick={() => changeStatus("invisible")} sx={{
                            "&:hover": {
                                backgroundColor: "#5865f2",
                                borderRadius: "4px",
                            }
                        }}>
                            <ListItemText primary="Invisible" secondary="You will not appear online, but will have full access." />
                        </ListItemButton>
                    </ListItem>
                </Box>

            </Popover>
        )
    }

    //server settings menu
    const ServerMenu = () => {

        return (
            <Popover
                open={openSettings}
                onClose={handleServerSettingsClose}
                anchorEl={channelHeaderRef.current}
                anchorReference="anchorEl"
                PaperProps={{
                    style: {
                        backgroundColor: "#111214", borderRadius: "4px", width: "220px", fontSize: 14
                    }
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >

                <ListItem dense sx={{ p: 0.75 }}>
                    <ListItemButton onClick={handleServerSettingsClose} sx={{
                        "&:hover": {
                            backgroundColor: "#5865f2",
                            borderRadius: "4px",
                        }
                    }}>
                        <ListItemText primary="Server Settings" />
                        <SettingsIcon edge="end" sx={{ color: "white" }} />
                    </ListItemButton>
                </ListItem>
                <Divider style={{ color: "#8a8e94" }} />
                <ListItem dense sx={{ p: 0.75 }}>
                    <ListItemButton onClick={handleDeleteServer} sx={{
                        "&:hover": {
                            backgroundColor: "red",
                            borderRadius: "4px",
                        }
                    }}>
                        <ListItemText color="red" primary="Delete Server" />
                        <DeleteForeverIcon edge="end" sx={{ color: "white" }} />
                    </ListItemButton>
                </ListItem>
            </Popover>
        )
    }


    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            backgroundColor: '#44b700',
            color: '#44b700',
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        },
    }));

    return (
        <Box component="aside" className='channel-container'>
            <Box component="header" className="channel-header focusable" onClick={handleServerSettingsOpen} ref={channelHeaderRef}>
                <Typography component="h6" className="channel-header-name" variant='h6'>
                    {currentServer.name}
                </Typography>
                {
                    openSettings ?
                        <IconButton aria-label="dropdown" className="channel-header-dropdown">
                            <CloseIcon />
                        </IconButton>
                        :
                        <IconButton aria-label="dropdown" className="channel-header-dropdown">
                            <ExpandMoreIcon />
                        </IconButton>
                }
            </Box>
            <ServerMenu handleServerSettingsClose={handleServerSettingsClose} openSettings={openSettings} channelHeaderRef={channelHeaderRef} handleDeleteServer={handleDeleteServer} />
            <Box component="section" className="channel-list-container">
                <Box component="header" className="channel-list-header focusable">
                    <Typography component="h6" variant="h6">
                        Text Channels
                    </Typography>
                    <AddIcon onClick={(() => setChannelModal(true))} sx={{ marginLeft: "auto", fontSize: 12 }} />
                    <Dialog className="Create-Channel-Modal" open={channelModal} onClose={() => setChannelModal(false)}>
                        <DialogTitle>Create Channel</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="CHANNEL NAME"
                                type="name"
                                name="name"
                                fullWidth
                                variant="standard"
                                onChange={e => handleChannelInfo(e)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button variant="text" onClick={() => setChannelModal(false)}>Cancel</Button>
                            <Button variant='contained' onClick={handleAddChannel}>Create Channel</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
                <Box component="ul" className="channel-list-text">
                    {channelList.map(({ name, id }) => (
                        <Box key={id} id={id} component="li" className={`channel channel-text ${id === currentChannel.uid ? "active" : ""}`} onClick={() => handleCurrentChannel(name, id)}>
                            <Box component="span" className="channel-name">{name}</Box>
                            <IconButton aria-label="settings" className="button">
                                <SettingsIcon />
                            </IconButton>
                            <IconButton aria-label="settings" className="button">
                                <SettingsIcon />
                            </IconButton>
                        </Box>
                    ))}
                </Box>

                <Box component="header" className="channel-list-header focusable">
                    <Typography component="h6" variant="h6">Voice Channels</Typography>
                </Box>
            </Box>
            <Box component="footer" className="channel-footer-container" ref={userAvatarRef}>
                <Box onClick={handleUserDetailOpen} className="channel-footer-profile" >
                    <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                    >
                        <Avatar alt="Name" sx={{ width: "30px", height: "30px" }} src={currentUser.profileURL ? currentUser.profileURL : "https://cdn.discordapp.com/icons/41771983423143937/edc44e98a690a1f76c5ddec68a0a6b9e.png"} className="avatar" />
                    </StyledBadge>
                    <Box className="channels-footer-details">
                        <Box className="username" sx={{ fontSize: 14 }}>
                            {currentUser.name ? currentUser.name : "Name"}
                        </Box>
                        <Box component="span" className="tag"></Box>
                    </Box>
                </Box>
                <UserDetail />
                <Box className="channel-footer-controls button-group">
                    {
                        muted ?
                            <Tooltip title="Unmute" placement='top'>
                                <IconButton className="channels-footer-button" aria-label="Mute" color="error" onClick={() => setMuted(!muted)}>
                                    <MicOffIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </Tooltip>
                            :
                            <Tooltip title="Mute" placement='top'>
                                <IconButton className="channels-footer-button" aria-label="Mute" color="success" onClick={() => setMuted(!muted)} >
                                    <MicIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </Tooltip>
                    }
                    {
                        defen ?
                            <Tooltip title="Undefen" placement='top'>
                                <IconButton className="channels-footer-button" aria-label="Defen" color="error" onClick={() => setDefen(!defen)}>
                                    <HeadsetOffIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </Tooltip>
                            :
                            <Tooltip title="Defen" placement='top'>
                                <IconButton className="channels-footer-button" aria-label="Defen" color="success" onClick={() => setDefen(!defen)}>
                                    <HeadsetIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </Tooltip>
                    }
                    <Tooltip title="Settings" >
                        <IconButton className="channels-footer-button" aria-label="Settings" >
                            <SettingsIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    )
}

export default Channel