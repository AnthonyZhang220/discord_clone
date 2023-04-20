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
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Divider } from '@mui/material';
import Fade from '@mui/material/Fade';
import Popper, { PopperPlacementType } from '@mui/material/Popper';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import NumbersIcon from '@mui/icons-material/Numbers';
import InputLabel from '@mui/material/InputLabel';
import { TextFieldProps } from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputBase from '@mui/material/InputBase';


import "./Channel.scss"

import { Outlet } from 'react-router-dom';
import UserFooter from '../UserFooter/UserFooter';

import { FunctionTooltip } from '../CustomUIComponents';




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




const Channel = ({ currentServer, signOut, currentUser, handleAddChannel, handleCurrentChannel, channelModal, setChannelModal, handleChannelInfo, currentChannel, setCurrentUser, setCurrentServer, newChannel }) => {


    const [channelList, setChannelList] = React.useState([])

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
    const [openSettings, setOpenSettings] = React.useState(false);
    const [deleteLoading, setDeleteLoading] = React.useState(false);

    const handleServerSettingsOpen = () => {
        setOpenSettings(true)
    }
    const handleServerSettingsClose = () => {
        setOpenSettings(false)
    }

    const handleDeleteServer = async () => {
        setDeleteLoading(true);

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
            setDeleteLoading(false);
            handleServerSettingsClose();
        });
    }

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
                        <FunctionTooltip title={
                            <React.Fragment>
                                <Typography variant="body1" sx={{ m: 0.5 }} >Create Channel</Typography>
                            </React.Fragment>} placement="top">
                            <AddIcon onClick={(() => setChannelModal(true))} />
                        </FunctionTooltip>
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
            <UserFooter className="user-footer-container" currentUser={currentUser} signOut={signOut} setCurrentUser={setCurrentUser} />
            <InviteDialog />
            {/* <Outlet /> */}
        </Box>
    )
}

export default Channel