import React, { useState, useEffect } from 'react'
import { db } from "../../firebase";
import { onSnapshot, query, where, addDoc, collection, Timestamp, arrayUnion, getDocs, doc } from 'firebase/firestore';

import { Avatar, Box, Button, Modal, TextField, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Typography, IconButton, ListItemButton, ListItemText, Divider } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import ExploreIcon from '@mui/icons-material/Explore';
import { ServerNameTooltip, InfoInput } from '../CustomUIComponents';

import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { CreateServerDialog, JoinServerDialog, ServerDialog } from '../Modals/Modals';

import "./ServerList.scss"
import { setCreateServerModal } from '../../redux/features/modalSlice';
import { setServerList } from '../../redux/features/serverSlice';

const ServerList = ({ user }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { createServerModal, createServerFormModal, joinServerModal } = useSelector((state) => state.modal)
    const { serverList } = useSelector(state => state.server)

    // Get list of servers that belong to the current user
    useEffect(() => {
        if (user) {
            const q = query(collection(db, 'servers'), where('members', 'array-contains', user.serverId));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const userServers = [];
                snapshot.forEach((doc) => {
                    userServers.push({
                        serverName: doc.data().serverName,
                        serverPic: doc.data().serverPic,
                        serverId: doc.id,
                    });
                });
                dispatch(setServerList(userServers))
            });
        }

    }, [user]);

    const [friendButton, setFriendButton] = React.useState(false);

    const handleClickFriend = () => {
        setFriendButton(true);
        navigate("/channels/@me");
    }

    const [mouseDown, setMouseDown] = React.useState(false);

    useEffect(() => {
        console.log(dispatch)
    }, [dispatch])

    return (
        <Box component='aside' className="servers">
            <Box className="servers-list">
                <Box className={`server focusable server-friends ${friendButton ? "active" : ""}`} role="button" aria-label="Discord Friend" onClick={() => handleClickFriend()}>
                    <ServerNameTooltip title={<React.Fragment>
                        <Typography variant="body1" sx={{ m: 0.5 }} >Direct Messages</Typography>
                    </React.Fragment>} placement="right">
                        <Avatar className="server-icon" src="https://cdn.discordapp.com/embed/avatars/0.png" />
                    </ServerNameTooltip>
                </Box>
                <Divider variant="fullWidth" flexItem sx={{ backgroundColor: "#35363c", m: "8px", borderRadius: "1px", height: "2px" }} />
                {serverList.map(({ serverName, serverPic, serverId }) => (
                    <Box className={`server focusable ${serverId === selectedServer.serverId && !friendButton ? "active" : ""} ${mouseDown ? "transformDown" : ""}`} role="button" key={serverId} onMouseDown={() => setMouseDown(true)} onClick={() => {
                        handleSelectedServer(serverName, serverId);
                        setFriendButton(false);
                    }} >
                        <ServerNameTooltip title={
                            <React.Fragment>
                                <Typography variant="body1" sx={{ m: 0.5 }} >{serverName}</Typography>
                            </React.Fragment>
                        } placement="right">
                            <Avatar className="server-icon" src={serverPic} />
                        </ServerNameTooltip>
                    </Box>

                ))
                }
                <Box className="server" >
                    <ServerNameTooltip title={
                        <React.Fragment>
                            <Typography variant="body1" sx={{ m: 0.5 }} >Add a Server</Typography>
                        </React.Fragment>
                    } placement="right">
                        <IconButton sx={{
                            fontSize: 15, color: "#23a459", "&:hover": {
                                color: "#ffffff"
                            }
                        }} onClick={() => dispatch(setCreateServerModal(true))} >
                            <AddIcon className="server-icon" />
                        </IconButton>
                    </ServerNameTooltip>
                </Box>
                <ServerNameTooltip title={
                    <React.Fragment>
                        <Typography variant="body1" sx={{ m: 0.5 }} >Explore Public Servers</Typography>
                    </React.Fragment>
                } placement="right">
                    <Box className="server" sx={{
                        "&:hover": {
                            backgroundColor: "#23a459"
                        }
                    }}>
                        <IconButton sx={{
                            fontSize: 15, color: "#23a459", "&:hover": {
                                color: "#ffffff"
                            }
                        }} >
                            <ExploreIcon className="server-icon" />
                        </IconButton>
                    </Box>
                </ServerNameTooltip>
            </Box>
            { }
            <ServerDialog createServerModal={createServerModal} />
            <CreateServerDialog createServerFormModal={createServerFormModal} />
            <JoinServerDialog joinServerModal={joinServerModal} />
            {/* <Outlet /> */}
        </Box>
    )
}

export default ServerList;