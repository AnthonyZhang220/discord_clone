import React, { useMemo, useEffect, useState, Fragment } from "react";

import { Box, IconButton, Input, Typography, SvgIcon, List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Badge, Avatar } from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import NumbersIcon from '@mui/icons-material/Numbers';
import SettingsIcon from '@mui/icons-material/Settings';
import UserFooter from "../../Channel/UserFooter/UserFooter";
import { lighten, styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import FriendIcon from '../DirectMessageBody/FriendBody/friend.svg'
import { FunctionTooltip } from "../../CustomUIComponents";
import StatusList from "../../StatusList";

import { QuerySnapshot, onSnapshot, query, collection, where } from "firebase/firestore";
import { db } from "../../../firebase";
import "./DirectMessageMenu.scss";


function DirectMessageMenu({ user, changeStatus, signOut, setCurrentUser, handleOpenFriend, handleCurrentPrivateChannel, currentPrivateChannel, muted, defen, handleDefen, handleMuted }) {

    const [privateChannelList, setPrivateChannelList] = useState([]);
    const [privateChannelId, setPrivateChannelId] = useState([]);


    useEffect(() => {
        if (user) {
            const q = query(collection(db, "privatechannels"), where("memberRef", "array-contains", user.uid))
            const unsub = onSnapshot(q, (QuerySnapshot) => {
                let data = [];
                QuerySnapshot.forEach((doc) => {
                    const userRef = doc.data().memberRef
                    if (userRef[0] === user.uid) {
                        data.push(userRef[1])
                    } else if (userRef[1] === user.uid) {
                        data.push(userRef[0])
                    }
                })
                setPrivateChannelId(data);
            })
        }

    }, [user])

    useEffect(() => {
        if (privateChannelId.length > 0) {
            const q = query(collection(db, "users"), where("userId", "in", privateChannelId))
            const unsub = onSnapshot(q, (QuerySnapshot) => {
                let data = [];
                QuerySnapshot.forEach((doc) => {
                    data.push({
                        name: doc.data().displayName,
                        avatar: doc.data().profileURL,
                        status: doc.data().status,
                        userId: doc.data().userId,
                    })
                })
                setPrivateChannelList(data)
            })
        }
    }, [privateChannelId])




    return (
        <Box component="aside" className='friend-container'>
            <Box component="header" className="friend-header focusable" >
                <input placeholder="Find or start a conversation" required={true} name="search" className="form-style" autoComplete="off" />
            </Box>
            <Box component="section" className="friend-menu-container">
                <ListItem disablePadding>
                    <ListItemButton sx={{ borderRadius: "4px", backgroundColor: currentPrivateChannel.uid == null ? lighten("#313338", 0.1) : "inherit" }} onClick={() => handleOpenFriend()}>
                        <SvgIcon edge="start" component={FriendIcon} sx={{ mr: 1 }} />
                        <ListItemText primary="Friends" />
                    </ListItemButton>
                </ListItem>
                <Box component="header" className="friend-menu-header focusable">
                    <Box>
                        <Typography component="h6" variant="h6">
                            Direct Messages
                        </Typography>
                    </Box>
                    <Box sx={{ marginLeft: "auto", fontSize: 12 }}>
                        <FunctionTooltip title={
                            <Fragment>
                                <Typography variant="body1" sx={{ m: 0.5 }} >Create DM</Typography>
                            </Fragment>} placement="top">
                            <AddIcon />
                        </FunctionTooltip>
                    </Box>
                </Box>
                <Box component="ul" className="friend-menu-conversation">
                    {privateChannelList?.map(({ name, avatar, userId, status }) => (
                        <DirectMessageList key={userId} name={name} avatar={avatar} userId={userId} status={status} />
                    ))}
                </Box>
            </Box>
            <UserFooter user={user} changeStatus={changeStatus} signOut={signOut} setCurrentUser={setCurrentUser} muted={muted} handleDefen={handleDefen}
                handleMuted={handleMuted}
                defen={defen} />
        </Box>
    )
}
export default DirectMessageMenu;