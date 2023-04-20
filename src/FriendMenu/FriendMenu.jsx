import React from "react";

import { Box, IconButton, Input, Typography, SvgIcon, List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Badge, Avatar } from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import NumbersIcon from '@mui/icons-material/Numbers';
import SettingsIcon from '@mui/icons-material/Settings';
import UserFooter from "../UserFooter/UserFooter";
import { lighten, styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import FriendIcon from '../FriendBody/friend.svg'
import { FunctionTooltip } from "../CustomUIComponents";
import StatusList from "../StatusList";

import "./FriendMenu.scss";
import { QuerySnapshot, onSnapshot, query, collection, where } from "firebase/firestore";
import { db } from "../firebase";


const FriendMenu = ({ currentUser, changeStatus, signOut, setCurrentUser, handleOpenFriend, handleCurrentPrivateChannel, currentPrivateChannel }) => {

    const [privateChannelList, setPrivateChannelList] = React.useState([]);
    const [privateChannelId, setPrivateChannelId] = React.useState([]);


    React.useEffect(() => {
        if (currentUser) {
            const q = query(collection(db, "privatechannels"), where("memberRef", "array-contains", currentUser.uid))
            const unsub = onSnapshot(q, (QuerySnapshot) => {
                let data = [];
                QuerySnapshot.forEach((doc) => {
                    const userRef = doc.data().memberRef
                    if (userRef[0] === currentUser.uid) {
                        data.push(userRef[1])
                    } else if (userRef[1] === currentUser.uid) {
                        data.push(userRef[0])
                    }
                })
                setPrivateChannelId(data);
            })
        }

    }, [currentUser])

    React.useEffect(() => {
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

    React.useEffect(() => {
        console.log(privateChannelList)
    }, [privateChannelList])

    const PrivateChannelList = ({ userId, status, name, avatar }) => {
        return (
            <ListItem id={userId} disablePadding sx={{ p: 0, m: 0, backgroundColor: currentPrivateChannel.uid === userId ? lighten("#313338", 0.1) : "inherit" }} className="friend-conversation-item">
                <ListItemButton onClick={() => handleCurrentPrivateChannel(userId)}>
                    <ListItemAvatar sx={{ minWidth: "0", mr: 1 }}>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                                <StatusList status={status} size={12} />
                            }
                        >
                            <Avatar alt={name} src={avatar} sx={{ width: 32, height: 32 }} />
                        </Badge>
                    </ListItemAvatar>
                    <ListItemText primary={name} />
                </ListItemButton>
            </ListItem>
        )
    }

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
                            <React.Fragment>
                                <Typography variant="body1" sx={{ m: 0.5 }} >Create DM</Typography>
                            </React.Fragment>} placement="top">
                            <AddIcon />
                        </FunctionTooltip>
                    </Box>
                </Box>
                <Box component="ul" className="friend-menu-conversation">
                    {privateChannelList?.map(({ name, avatar, userId, status }) => (
                        <PrivateChannelList key={userId} name={name} avatar={avatar} userId={userId} status={status} />
                    ))}
                </Box>
            </Box>
            <UserFooter currentUser={currentUser} changeStatus={changeStatus} signOut={signOut} setCurrentUser={setCurrentUser} />
        </Box>
    )
}

export default FriendMenu;