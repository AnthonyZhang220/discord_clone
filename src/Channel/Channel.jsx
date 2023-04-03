import React from 'react'
import { auth } from '../firebase';
import { db } from "../firebase";
import { onSnapshot, query, where, addDoc, collection, deleteDoc, doc, updateDoc, getDocs } from 'firebase/firestore';


import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, ListItemText, ListItem, ListItemIcon, Paper, Badge, ClickAwayListener, List, ListItemButton, Popover, InputAdornment } from '@mui/material'
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
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

import CircleIcon from '@mui/icons-material/Circle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import NumbersIcon from '@mui/icons-material/Numbers';
import InputLabel from '@mui/material/InputLabel';
import { TextFieldProps } from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputBase from '@mui/material/InputBase';


import "./Channel.scss"
import { async } from '@firebase/util';
import { Circle } from '@mui/icons-material';

import StatusList from '../StatusList';



const StyledListItemButton = styled(ListItemButton)(() => ({
    padding: "2px 2px 2px 2px",
}));

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: "#1e1f22",
        border: 'none',
        fontSize: 16,
        padding: '10px 12px',
        color: "#ffffff"
    },
}));

const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#1e2124",
    },
}));


const Channel = ({ currentServer, signOut, currentUser, handleAddChannel, handleCurrentChannel, channelModal, setChannelModal, handleChannelInfo, currentChannel, setCurrentUser, setCurrentServer, newChannel }) => {


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

    const handleDeleteServer = async () => {

        const parse = JSON.parse(localStorage.getItem(`${currentUser.uid}`))
        const newLocal = parse.filter(({ currentServer }) => currentServer != currentServer.uid);
        localStorage.setItem(`${currentUser.uid}`, JSON.stringify(newLocal))

        const serverRef = doc(db, "servers", currentServer.uid)
        const channelRef = query(collection(db, 'channels'), where('serverRef', '==', currentServer.uid));
        const messageRef = query(collection(db, 'messages'), where('serverRef', '==', currentServer.uid));

        await getDocs(messageRef)
            .then((querySnapshot) => {
                // Iterate through the documents and delete them
                querySnapshot.forEach((doc) => {
                    deleteDoc(doc.ref);
                });
            })
            .catch((error) => {
                console.error('Error deleting documents: ', error);
            });

        await getDocs(channelRef)
            .then((querySnapshot) => {
                // Iterate through the documents and delete them
                querySnapshot.forEach((doc) => {
                    deleteDoc(doc.ref);
                });
                setChannelList([])
            })
            .catch((error) => {
                console.error('Error deleting documents: ', error);
            });

        await deleteDoc(serverRef).then(() => {
            setCurrentServer({ ...currentServer, name: "" })
            handleServerSettingsClose();
        });


    }

    const handleStatusOpen = () => {
        setOpenStatus(true);
    }

    const handleStatusClose = () => {
        setOpenStatus(false);
    }

    const changeStatus = async (status) => {
        await updateDoc(doc(db, "users", currentUser.uid), {
            status: status
        })
        setCurrentUser({ ...currentUser, status: status })
    }

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
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            className="user-detail-avatar"
                            badgeContent={
                                <StatusList status={currentUser.status} />
                            }
                        >
                            <Avatar alt={currentUser.name} sx={{ width: "75px", height: "75px" }} src={currentUser.profileURL} />
                        </Badge>
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
                        <ListItem dense>
                            <HtmlTooltip
                                disableFocusListener disableTouchListener
                                placement="right"
                                title={
                                    <React.Fragment>
                                        <ListItem sx={{ pl: 1, pr: 1 }}>
                                            <StyledListItemButton onClick={() => changeStatus("online")} sx={{
                                                "&:hover": {
                                                    backgroundColor: "#5865f2",
                                                    borderRadius: "4px",
                                                }
                                            }}>
                                                <CircleIcon edge="start" sx={{ mr: 2, color: "#23a55a" }} />
                                                <ListItemText primary="Online" />
                                            </StyledListItemButton>
                                        </ListItem>
                                        <Divider sx={{ backgroundColor: "white", mt: 0.5, mb: 0.5 }} variant="middle" />
                                        <ListItem sx={{ pl: 1, pr: 1 }}>
                                            <StyledListItemButton onClick={() => changeStatus("idle")} sx={{
                                                "&:hover": {
                                                    backgroundColor: "#5865f2",
                                                    borderRadius: "4px",
                                                }
                                            }}>
                                                <DarkModeIcon edge="start" sx={{ mr: 2, color: "#f0b132" }} />
                                                <ListItemText primary="Idle" />
                                            </StyledListItemButton>
                                        </ListItem>
                                        <ListItem sx={{ pl: 1, pr: 1 }}>
                                            <StyledListItemButton onClick={() => changeStatus("donotdisturb")} sx={{
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
                                            </StyledListItemButton>
                                        </ListItem>
                                        <ListItem sx={{ pl: 1, pr: 1 }}>
                                            <StyledListItemButton onClick={() => changeStatus("invisible")} sx={{
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
                                            </StyledListItemButton>
                                        </ListItem>
                                    </React.Fragment>
                                }>
                                <StyledListItemButton sx={{
                                    "&:hover": {
                                        backgroundColor: "#5865f2",
                                        borderRadius: "4px",
                                    }
                                }}>

                                    <StatusList edge={"start"} status={currentUser.status} size={15} />
                                    <ListItemText primary={statusFormat(currentUser.status)} sx={{ ml: 1 }} />
                                    <NavigateNextIcon edge="end" sx={{ color: "white" }} />
                                </StyledListItemButton>
                            </HtmlTooltip>
                        </ListItem>
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


    const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(() => ({
        [`& .${tooltipClasses.tooltip}`]: {
            background: "#111214", borderRadius: "4px", width: "340px", fontSize: 12,
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            maxHeight: "calc(100vh - 28px)",
        },
    }));

    const handleInvite = () => {
        handleServerSettingsClose()
        setInviteDialog(true)
    }

    const [inviteDialog, setInviteDialog] = React.useState(false);
    const [copyed, setCopyed] = React.useState(false);

    const copyToClip = () => {
        navigator.clipboard.writeText(currentServer.uid).then(() => {
            setCopyed(true);
        })
    }

    //invite people
    const InviteDialog = () => {
        return (
            <Dialog className="Create-Channel-Modal" open={inviteDialog} onClose={() => setInviteDialog(false)} PaperProps={{
                style: {
                    textAlign: "start",
                    backgroundColor: "#313338",
                    width: "440px"
                }
            }}>
                <DialogTitle sx={{ color: "#ffffff" }} variant='h3'>Invite friends to {currentServer.name}</DialogTitle>
                <DialogContent>
                    <Box component="form">
                        <FormControl variant="standard" required fullWidth>
                            <InputLabel shrink sx={{
                                color: "#ffffff"
                            }}>
                                OR, SEND A SERVER ID TO A FRIEND
                            </InputLabel>
                            <BootstrapInput
                                id="name"
                                name="name"
                                variant="outlined"
                                autoComplete="off"
                                defaultValue={currentServer.uid}
                                readOnly
                                endAdornment={
                                    <InputAdornment position="end">
                                        <Button onClick={() => copyToClip()}>Copy</Button>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </Box>
                </DialogContent>
            </Dialog>
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
                        backgroundColor: "#111214", borderRadius: "4px", width: "220px"
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
                <ListItem sx={{
                    p: 0.75
                }}>
                    <ListItemButton onClick={handleInvite} sx={{
                        color: "#949cf7",
                        borderRadius: "4px",
                        "&:hover": {
                            backgroundColor: "#5865f2",
                            color: "#ffffff"
                        }
                    }}>
                        <Typography variant='h6' sx={{ color: "inherit", marginRight: "auto" }}>
                            Invite People
                        </Typography>
                        <PersonAddAlt1Icon sx={{ marginLeft: "auto", fontSize: 20 }} />
                    </ListItemButton>
                </ListItem>
                <ListItem sx={{ p: 0.75 }}>
                    <ListItemButton onClick={handleServerSettingsClose} sx={{
                        color: "#ffffff",
                        borderRadius: "4px",
                        "&:hover": {
                            backgroundColor: "#5865f2",
                            color: "#ffffff"
                        }
                    }}>
                        <Typography variant='h6' sx={{ color: "inherit", marginRight: "auto" }}>
                            Server Settings
                        </Typography>
                        <SettingsIcon sx={{ marginLeft: "auto", fontSize: 20 }} />
                    </ListItemButton>
                </ListItem>
                <Divider sx={{ backgroundColor: "#8a8e94" }} variant="middle" light={true} />
                <ListItem sx={{ p: 0.75 }}>
                    <ListItemButton onClick={handleDeleteServer} sx={{
                        color: "#f23f42",
                        borderRadius: "4px",
                        "&:hover": {
                            backgroundColor: "#f23f42",
                            color: "#ffffff"
                        }
                    }}>
                        <Typography variant='h6' sx={{ color: "inherit", marginRight: "auto" }}>
                            Delete Server
                        </Typography>
                        <DeleteForeverIcon sx={{ marginLeft: "auto", fontSize: 20 }} />
                    </ListItemButton>
                </ListItem>
            </Popover>
        )
    }

    React.useEffect(() => {
        console.log(currentUser.status)
    }, [currentUser.status])

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
                    <Box>
                        <Typography component="h6" variant="h6">
                            Text Channels
                        </Typography>
                    </Box>
                    <Box sx={{ marginLeft: "auto", fontSize: 12 }}>
                        <BootstrapTooltip title={
                            <React.Fragment>
                                <Typography variant="body1" sx={{ m: 0.5 }} >Create Channel</Typography>
                            </React.Fragment>} placement="top">
                            <AddIcon onClick={(() => setChannelModal(true))} />
                        </BootstrapTooltip>
                    </Box>
                    <Dialog className="Create-Channel-Modal" open={channelModal} onClose={() => setChannelModal(false)} PaperProps={{
                        style: {
                            textAlign: "start",
                            backgroundColor: "#313338",
                            width: "440px"
                        }
                    }}>
                        <DialogTitle sx={{ color: "#ffffff" }} variant='h3'>Create Channel</DialogTitle>
                        <DialogContent>
                            <Box component="form">
                                <FormControl variant="standard" required fullWidth>
                                    <InputLabel shrink sx={{
                                        color: "#ffffff"
                                    }}>
                                        CHANNEL NAME
                                    </InputLabel>
                                    <BootstrapInput
                                        id="name"
                                        name="name"
                                        variant="outlined"
                                        autoComplete="off"
                                        onChange={e => handleChannelInfo(e)}
                                        placeholder="new-channel"
                                    />
                                </FormControl>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button variant='text' sx={{ marginRight: "auto", color: "#4e5058" }} onClick={() => setChannelModal(false)}>Cancel</Button>
                            <Button variant='contained' onClick={handleAddChannel}>Create Channel</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
                <Box component="ul" className="channel-list-text">
                    {channelList.map(({ name, id }) => (
                        <Box key={id} id={id} component="li" className={`channel channel-text ${id === currentChannel.uid ? "active" : ""}`} onClick={() => handleCurrentChannel(name, id)}>
                            <NumbersIcon sx={{ color: "#8a8e94", marginRight: "6px" }} />
                            <Box component="span" className="channel-name">{name}</Box>
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
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                            <StatusList status={currentUser.status} size={12} />
                        }
                    >
                        <Avatar alt={currentUser.name} sx={{ width: "30px", height: "30px" }} src={currentUser.profileURL} className="avatar" />
                    </Badge>
                    <Box className="channels-footer-details">
                        <Box className="username" sx={{ fontSize: 14 }}>
                            {currentUser.name}
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
            <InviteDialog />
        </Box>
    )
}

export default Channel