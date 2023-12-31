import React, { useId, useMemo, useEffect, useState, Fragment, useRef } from 'react'
import { auth } from '../../firebase';
import { db } from "../../firebase";
import { onSnapshot, query, where, addDoc, collection, deleteDoc, doc, updateDoc, getDocs, QuerySnapshot, getDoc } from 'firebase/firestore';


import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, ListItemText, ListItem, ListItemIcon, Paper, Badge, ClickAwayListener, List, ListItemButton, Popover, InputAdornment, ListItemAvatar } from '@mui/material'
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
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import "./Channel.scss"

import { Outlet } from 'react-router-dom';
import UserFooter from './UserFooter/UserFooter';
import VoiceControl from './VoiceControl/VoiceControl';

import { FunctionTooltip } from '../CustomUIComponents';
import { CreateChannelDialog, InviteDialog } from '../Modals/Modals';
import { useDispatch, useSelector } from 'react-redux';
import { setCreateChannelModal } from '../../redux/features/modalSlice';
import { setChannelList, setVoiceChannelList } from '../../redux/features/channelSlice';

const Channel = () => {


    const [liveList, setLiveList] = useState([])
    const dispatch = useDispatch()
    const { createChannelModal, inviteModal } = useSelector((state) => state.modal)
    const { user } = useSelector(state => state.auth)
    const { selectedServer, selectedChannel } = useSelector(state => state.userSelectStore)
    const { channelList, voiceChannelList } = useSelector(state => state.channel)

    //get channel list by server UID
    useEffect(() => {
        console.log(selectedServer)
        if (selectedServer) {
            const q = query(collection(db, "channels"), where("serverRef", "==", selectedServer.serverId));
            const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                let list = [];
                QuerySnapshot.forEach((doc) => {
                    list.push({ ...doc.data(), id: doc.id });
                })
                dispatch(setChannelList(list))
            })
        }
    }, [selectedServer])

    //get all the voice channels by server UID
    useEffect(() => {
        if (selectedServer) {
            const q = query(collection(db, "voicechannels"), where("serverRef", "==", selectedServer.serverId));
            const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                let list = [];
                QuerySnapshot.forEach((doc) => {
                    list.push({ ...doc.data(), id: doc.id });
                })
                dispatch(setVoiceChannelList(list))
            })
        }

    }, [selectedServer])


    useEffect(() => {
        console.log(selectedServer.uid)
    }, [selectedServer])

    const channelHeaderRef = useRef(null);
    const [openSettings, setOpenSettings] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleServerSettingsOpen = () => {
        setOpenSettings(true)
    }
    const handleServerSettingsClose = () => {
        setOpenSettings(false)
    }

    const handleDeleteServer = async () => {
        setDeleteLoading(true);

        const parse = JSON.parse(localStorage.getItem(`${user.uid}`))
        const newLocal = parse.filter(({ selectedServer }) => selectedServer != selectedServer.uid);
        localStorage.setItem(`${user.uid}`, JSON.stringify(newLocal))

        const serverRef = doc(db, "servers", selectedServer.uid)
        const channelRef = query(collection(db, 'channels'), where('serverRef', '==', selectedServer.uid));
        const messageRef = query(collection(db, 'messages'), where('serverRef', '==', selectedServer.uid));

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
            setCurrentServer({ ...selectedServer, name: "" })
            setDeleteLoading(false);
            handleServerSettingsClose();
        });
    }

    const handleInvite = () => {
        handleServerSettingsClose()
    }

    //server settings menu
    const ServerMenu = useMemo(() => () => {

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
    }, [openSettings])

    return (
        <Box component="aside" className='channel-container'>
            <Box component="header" className="channel-header focusable" onClick={handleServerSettingsOpen} ref={channelHeaderRef}>
                <Typography component="h6" className="channel-header-name" variant='h6'>
                    {selectedServer.serverName}
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
            <ServerMenu handleServerSettingsClose={handleServerSettingsClose} openSettings={openSettings} handleDeleteServer={handleDeleteServer} />
            <Box component="section" className="channel-list-container">
                <Box component="header" className="channel-list-header focusable">
                    <Box>
                        <Typography component="h6" variant="h6">
                            Text Channels
                        </Typography>
                    </Box>
                    <Box sx={{ marginLeft: "auto", fontSize: 12 }}>
                        <FunctionTooltip title={
                            <Fragment>
                                <Typography variant="body1" sx={{ m: 0.5 }} >Create Channel</Typography>
                            </Fragment>} placement="top">
                            <AddIcon onClick={(() => dispatch(setCreateChannelModal(true)))} />
                        </FunctionTooltip>
                    </Box>
                </Box>
                <Box component="ul" className="channel-list-text">
                    {channelList.map(({ name, id }) => (
                        <Box key={id} id={id} component="li" className={`channel channel-text ${id === currentChannel.uid ? "active" : ""}`}
                            onClick={() => {
                                handleCurrentChannel(name, id)
                                setVoiceChat(false)
                            }}
                        >
                            <NumbersIcon sx={{ color: "#8a8e94", marginRight: "6px" }} />
                            <Box component="span" className="channel-name">{name}</Box>
                            <IconButton aria-label="settings" className="button">
                                <SettingsIcon />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
                <Box component="header" className="channel-list-header focusable">
                    <Box>
                        <Typography component="h6" variant="h6">Voice Channels</Typography>
                    </Box>
                    <Box sx={{ marginLeft: "auto", fontSize: 12 }}>
                        <FunctionTooltip title={
                            <Fragment>
                                <Typography variant="body1" sx={{ m: 0.5 }} >Create Voice Channel</Typography>
                            </Fragment>} placement="top">
                            <AddIcon onClick={(() => dispatch(setCreateChannelModal(true)))} />
                        </FunctionTooltip>
                    </Box>
                </Box>
                <Box component="ul" className="channel-list-text">
                    {voiceChannelList.map(({ name, id, liveUser }) => (
                        <Box key={id}>
                            <Box key={id} id={id} component="li" className={`channel channel-text ${id === currentVoiceChannel.uid ? "active" : ""}`} onClick={() => {
                                setCurrentVoiceChannel({ name: name, uid: id })
                                setVoiceChat(true)
                            }}>
                                <VolumeUpIcon sx={{ color: "#8a8e94", marginRight: "6px" }} />
                                <Box component="span" className="channel-name">{name}</Box>
                                <IconButton aria-label="settings" className="button">
                                    <SettingsIcon />
                                </IconButton>
                            </Box>
                            {
                                liveUser.map(({ avatar, name, uid }, index) => (
                                    <ListItem key={uid + index} id={uid} disablePadding sx={{ p: 0, m: 0 }} className="friend-conversation-item">
                                        <ListItemButton>
                                            <ListItemAvatar sx={{ minWidth: "0", mr: 1, ml: "auto" }}>
                                                <Avatar alt={name} src={avatar} sx={{ width: 20, height: 20 }} />
                                            </ListItemAvatar>
                                            <ListItemText primary={name} />
                                        </ListItemButton>
                                    </ListItem>
                                ))
                            }
                        </Box>
                    ))}
                </Box>
            </Box>
            {/* {connectionState.state != "DISCONNECTED" && typeof (connectionState.state) == "string" ?
                <VoiceControl />
                :
                null
            } */}
            <UserFooter className="user-footer-container" />
            <InviteDialog selectedServer={selectedServer} inviteModal={inviteModal} />
            <CreateChannelDialog createChannelModal={createChannelModal} />
            {/* <Outlet /> */}
        </Box>
    )
}

export default Channel