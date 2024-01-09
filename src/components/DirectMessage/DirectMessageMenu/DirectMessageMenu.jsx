import React, { useEffect, Fragment } from "react";

import { Box, Typography, SvgIcon, ListItem, ListItemButton, ListItemText } from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import UserFooter from "../../Channel/UserFooter/UserFooter";
import { lighten } from '@mui/material/styles';
import FriendIcon from '../DirectMessageBody/FriendBody/friend.svg'
import { FunctionTooltip } from "../../CustomUIComponents";

import { onSnapshot, query, collection, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { setIsFriendListPageOpen, setDirectMessageChannelList, setDirectMessageChannelRefs } from "../../../redux/features/directMessageSlice";
import { DirectMessageList } from "./DirectMessageList/DirectMessageList";
import "./DirectMessageMenu.scss";


function DirectMessageMenu() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth)
    const { directMessageChannelRefs, isFriendListPageOpen, directMessageChannelList } = useSelector(state => state.directMessage)

    useEffect(() => {
        if (user.id) {
            const q = query(collection(db, "privatechannels"), where("memberRef", "array-contains", user.id))
            let data = {};
            const unsub = onSnapshot(q, (QuerySnapshot) => {
                QuerySnapshot.forEach((doc) => {
                    const userRef = doc.data().memberRef
                    const channelRef = doc.id
                    const firstUser = userRef[0];
                    const secondUser = userRef[1];
                    if (firstUser === user.id) {
                        data[secondUser] = channelRef;
                    } else if (secondUser === user.id) {
                        data[firstUser] = channelRef;
                    }
                })
                dispatch(setDirectMessageChannelRefs(data))
            })
        }
    }, [user.id])

    useEffect(() => {

        if (Object.keys(directMessageChannelRefs).length) {
            let userArr = [];
            for (const key in directMessageChannelRefs) {
                userArr.push(key)
            }
            const q = query(collection(db, "users"), where("id", "in", userArr))
            const unsub = onSnapshot(q, (QuerySnapshot) => {
                let dmList = [];
                QuerySnapshot.forEach((doc) => {
                    dmList.push(doc.data())
                })
                dispatch(setDirectMessageChannelList(dmList))
            })
        }
    }, [Object.keys(directMessageChannelRefs).length])

    return (
        <Box component="aside" className='friend-container'>
            <Box component="header" className="friend-header focusable" >
                <input placeholder="Find or start a conversation" required={true} name="search" className="form-style" autoComplete="off" />
            </Box>
            <Box component="section" className="friend-menu-container">
                <ListItem disablePadding>
                    <ListItemButton className="friend-menu-open" sx={{ borderRadius: "4px", backgroundColor: isFriendListPageOpen ? lighten("#313338", 0.1) : "inherit" }} onClick={() => dispatch(setIsFriendListPageOpen(true))}>
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
                    {directMessageChannelList?.map(({ displayName, avatar, id, status, createdAt }) => (
                        <DirectMessageList key={id} id={id} displayName={displayName} avatar={avatar} status={status} createdAt={createdAt} />
                    ))}
                </Box>
            </Box>
            <UserFooter />
        </Box>
    )
}
export default DirectMessageMenu;