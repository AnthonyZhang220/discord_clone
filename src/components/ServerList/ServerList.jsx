import React, { useState, useEffect } from 'react'
import { db } from "../../firebase";
import { onSnapshot, query, where, addDoc, collection, Timestamp, arrayUnion, getDocs, doc } from 'firebase/firestore';

import { Avatar, Box, Typography, IconButton, Divider } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import ExploreIcon from '@mui/icons-material/Explore';
import { ServerNameTooltip, InfoInput } from '../CustomUIComponents';

import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { CreateServerDialog, JoinServerDialog, ServerDialog } from '../Modals/Modals';

import { handleSelectServer } from '../../utils/handlers/serverHandlers';
import { setCreateServerModal } from '../../redux/features/modalSlice';
import { setCurrServerList } from '../../redux/features/serverSlice';
import "./ServerList.scss"
import { setIsDirectMessagePageOpen } from '../../redux/features/directMessageSlice';

const ServerList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { createServerModal, createServerFormModal, joinServerModal } = useSelector((state) => state.modal)
    const { currServerList } = useSelector(state => state.server)
    const { user } = useSelector(state => state.auth)
    const { selectedServer } = useSelector(state => state.userSelectStore)
    const { isDirectMessagePageOpen } = useSelector(state => state.directMessage)

    // Get list of servers that belong to the current user
    useEffect(() => {
        if (user.id) {
            const q = query(collection(db, 'servers'), where('members', 'array-contains', user.id));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const userServers = [];
                snapshot.forEach((doc) => {
                    userServers.push({
                        name: doc.data().name,
                        avatar: doc.data().avatar,
                        id: doc.id,
                    });
                });
                dispatch(setCurrServerList(userServers))
            });
        }
    }, [user.id]);

    useEffect(() => {
        if (isDirectMessagePageOpen) {
            navigate("/channels/@me")
        } else {
            navigate("/channels")
        }
    }, [isDirectMessagePageOpen])

    const [mouseDown, setMouseDown] = React.useState(false);

    return (
        <Box component='aside' className="servers">
            <Box className="servers-list">
                <Box className={`server focusable server-friends ${isDirectMessagePageOpen ? "active" : ""}`} role="button" aria-label="Discord Friend" onClick={() => dispatch(setIsDirectMessagePageOpen(true))}>
                    <ServerNameTooltip title={<React.Fragment>
                        <Typography variant="body1" sx={{ m: 0.5 }} >Direct Messages</Typography>
                    </React.Fragment>} placement="right">
                        <Avatar className="server-icon" src="https://cdn.discordapp.com/embed/avatars/0.png" />
                    </ServerNameTooltip>
                </Box>
                <Divider variant="fullWidth" flexItem sx={{ backgroundColor: "#35363c", m: "8px", borderRadius: "1px", height: "2px" }} />
                {currServerList.map(({ name, avatar, id }) => (
                    <Box className={`server focusable ${id === selectedServer && !isDirectMessagePageOpen ? "active" : ""} ${mouseDown ? "transformDown" : ""}`} role="button" key={id} onMouseDown={() => setMouseDown(true)} onClick={() => {
                        handleSelectServer(name, id);
                    }} >
                        <ServerNameTooltip title={
                            <React.Fragment>
                                <Typography variant="body1" sx={{ m: 0.5 }} >{name}</Typography>
                            </React.Fragment>
                        } placement="right">
                            <Avatar className="server-icon" src={avatar} />
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