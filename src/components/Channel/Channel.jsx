import React, { useId, useMemo, useEffect, useState, Fragment, useRef } from 'react'
import { auth } from '../../firebase';
import { db } from "../../firebase";
import { onSnapshot, query, where, collection, doc, getDoc } from 'firebase/firestore';

import { ListItemText, ListItem, ListItemButton, ListItemAvatar } from '@mui/material'
import { Avatar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NumbersIcon from '@mui/icons-material/Numbers';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import "./Channel.scss"

import { Outlet } from 'react-router-dom';
import ServerSettings from './ServerSettings/ServerSettings';
import UserFooter from './UserFooter/UserFooter';
import VoiceControl from './VoiceControl/VoiceControl';

import { FunctionTooltip } from '../CustomUIComponents';
import { CreateChannelDialog, CreateVoiceChannelDialog, InviteDialog } from '../Modals/Modals';
import { useDispatch, useSelector } from 'react-redux';
import { setCreateChannelModal, setCreateVoiceChannelModal } from '../../redux/features/modalSlice';
import { setCurrChannelList, setCurrVoiceChannelList } from '../../redux/features/channelSlice';
import { toggleServerSettings } from '../../redux/features/popoverSlice';
import { handleSelectChannel } from '../../handlers/channelHandlers';
import { handleJoinVoiceChannel } from '../../handlers/voiceChannelHandlers';
import { setCurrServer } from '../../redux/features/serverSlice';

const Channel = () => {
    const channelHeaderRef = useRef(null);
    const dispatch = useDispatch()
    const { createChannelModal, createVoiceChannelModal, inviteModal } = useSelector((state) => state.modal)
    const { user } = useSelector(state => state.auth)
    const { selectedServer, selectedChannel } = useSelector(state => state.userSelectStore)
    const { currVoiceChannel, currChannelList, currVoiceChannelList } = useSelector(state => state.channel)
    const { currServer } = useSelector(state => state.server)
    const { serverSettingsPopover } = useSelector(state => state.popover)
    const { isVoiceChatConnected, isVoiceChatLoading } = useSelector(state => state.voiceChat)

    //get channel list by server UID
    useEffect(() => {
        if (selectedServer) {
            const q = query(collection(db, "channels"), where("serverRef", "==", selectedServer));
            const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                let list = [];
                QuerySnapshot.forEach((doc) => {
                    list.push({ ...doc.data(), id: doc.id });
                })
                dispatch(setCurrChannelList(list))
            })

        }
    }, [selectedServer])

    //get all the voice channels by server UID
    useEffect(() => {
        if (selectedServer) {
            const q = query(collection(db, "voicechannels"), where("serverRef", "==", selectedServer));
            const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                let list = [];
                QuerySnapshot.forEach((doc) => {
                    list.push({ ...doc.data(), id: doc.id });
                })
                dispatch(setCurrVoiceChannelList(list))
            })
        }

    }, [selectedServer])

    useEffect(() => {
        if (selectedServer) {
            const serverRef = doc(db, "servers", selectedServer)
            getDoc(serverRef).then((doc) => {
                dispatch(setCurrServer({ name: doc.data().name, id: doc.data().id }))
            })
        }
    }, [selectedServer])

    return (
        <Box component="aside" className='channel-container'>
            <Box component="header" className="channel-header focusable" onClick={() => dispatch(toggleServerSettings())} ref={channelHeaderRef}>
                <Typography component="h6" className="channel-header-name" variant='h6'>
                    {currServer.name}
                </Typography>
                {
                    serverSettingsPopover ?
                        <IconButton aria-label="dropdown" className="channel-header-dropdown">
                            <CloseIcon />
                        </IconButton>
                        :
                        <IconButton aria-label="dropdown" className="channel-header-dropdown">
                            <ExpandMoreIcon />
                        </IconButton>
                }
            </Box>
            <ServerSettings serverSettingsPopover={serverSettingsPopover} channelHeaderRef={channelHeaderRef} />
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
                    {currChannelList.map(({ name, id }) => (
                        <Box key={id} id={id} component="li" className={`channel channel-text ${id === selectedChannel ? "active" : ""}`}
                            onClick={() => {
                                handleSelectChannel(name, id)
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
                            <AddIcon onClick={(() => dispatch(setCreateVoiceChannelModal(true)))} />
                        </FunctionTooltip>
                    </Box>
                </Box>
                <Box component="ul" className="channel-list-text">
                    {currVoiceChannelList.map(({ name, id, participants }) => (
                        <Box key={id}>
                            <Box key={id} id={id} component="li" className={`channel channel-text ${id === currVoiceChannel.id ? "active" : ""}`} onClick={() => {
                                handleJoinVoiceChannel(name, id)
                            }}>
                                <VolumeUpIcon sx={{ color: "#8a8e94", marginRight: "6px" }} />
                                <Box component="span" className="channel-name">{name}</Box>
                                <IconButton aria-label="settings" className="button">
                                    <SettingsIcon />
                                </IconButton>
                            </Box>
                            {
                                participants.map(({ displayName, avatar, id }) => (
                                    <ListItem key={id} id={id} disablePadding sx={{ p: 0, m: 0 }} className="friend-conversation-item">
                                        <ListItemButton>
                                            <ListItemAvatar sx={{ minWidth: "0", mr: 1, ml: "auto" }}>
                                                <Avatar alt={displayName} src={avatar} sx={{ width: 20, height: 20 }} />
                                            </ListItemAvatar>
                                            <ListItemText primary={displayName} />
                                        </ListItemButton>
                                    </ListItem>
                                ))
                            }
                        </Box>
                    ))}
                </Box>
            </Box>
            {(isVoiceChatConnected || isVoiceChatLoading) && <VoiceControl />}
            <UserFooter className="user-footer-container" />
            <InviteDialog selectedServer={selectedServer} inviteModal={inviteModal} />
            <CreateChannelDialog createChannelModal={createChannelModal} />
            <CreateVoiceChannelDialog createVoiceChannelModal={createVoiceChannelModal} />
            {/* <Outlet /> */}
        </Box>
    )
}

export default Channel