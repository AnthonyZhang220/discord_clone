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
import { useDispatch, useSelector } from "react-redux";
import { setDirectMessageList } from "../../../redux/features/chatListSlice";
import { setIsFriendListPageOpen } from "../../../redux/features/directMessageSlice";
import { DirectMessageList } from "./DirectMessageList/DirectMessageList";
import "./DirectMessageMenu.scss";


function DirectMessageMenu() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth)
    const { directMessageList, currDirectMessageChannel } = useSelector(state => state.directMessage)
    const [privateChannelId, setPrivateChannelId] = useState([]);


    useEffect(() => {
        if (user.id) {
            const q = query(collection(db, "privatechannels"), where("memberRef", "array-contains", user.id))
            const unsub = onSnapshot(q, (QuerySnapshot) => {
                let data = [];
                QuerySnapshot.forEach((doc) => {
                    const userRef = doc.data().memberRef
                    if (userRef[0] === user.id) {
                        data.push(userRef[1])
                    } else if (userRef[1] === user.id) {
                        data.push(userRef[0])
                    }
                })
                setPrivateChannelId(data);
            })
        }

    }, [user.id])

    useEffect(() => {
        if (privateChannelId.length > 0) {
            const q = query(collection(db, "users"), where("userId", "in", privateChannelId))
            const unsub = onSnapshot(q, (QuerySnapshot) => {
                let dmList = [];
                QuerySnapshot.forEach((doc) => {
                    dmList.push(doc.data())
                })
                dispatch(setDirectMessageList(dmList))
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
                    <ListItemButton sx={{ borderRadius: "4px", backgroundColor: currDirectMessageChannel.id == null ? lighten("#313338", 0.1) : "inherit" }} onClick={() => dispatch(setIsFriendListPageOpen(true))}>
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
                    {directMessageList?.map(({ name, avatar, id, status }) => (
                        <DirectMessageList key={id} name={name} avatar={avatar} status={status} />
                    ))}
                </Box>
            </Box>
            <UserFooter />
        </Box>
    )
}
export default DirectMessageMenu;