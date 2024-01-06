import React, { useState, useRef, useEffect, useMemo, memo } from 'react'
//send meesage to db
import { onSnapshot, query, where, addDoc, collection, Timestamp, arrayUnion, setDoc, doc, getDocs, QuerySnapshot, updateDoc, getDoc, documentId, orderBy, limitToLast, arrayRemove } from 'firebase/firestore';
import { db, storage } from "../../../../firebase";
//material ui comp
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { IconButton, Input, ListItemButton, Typography, Badge, Divider } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { InputAdornment } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputBase from '@mui/material/InputBase';
import { ClickAwayListener } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';

import { FunctionTooltip } from '../../../CustomUIComponents';
import { setDraftDirectMessage } from '../../../../redux/features/draftSlice';
import { bytesToMB } from '../../../../utils/bytesToMB';
import { convertDate, convertTime, convertDateDivider } from '../../../../utils/formatter';
import { useDispatch, useSelector } from 'react-redux';
import { setDirectMessageList } from '../../../../redux/features/chatListSlice';
import UserSidebar from './UserSideBar/UserSideBar';
import './PrivateChat.scss'

export default function PrivateChat({ user, handleAddPrivateMessage }) {
    const formRef = useRef();
    const chatScroller = useRef();
    const [openUpload, setOpenUpload] = useState(false);
    const dispatch = useDispatch();
    const { draftDirectMessage } = useSelector(state => state.draft)
    const { currDirectMessageChannel, isDirectMessageSidebarOpen, currDirectMessageChannelRef } = useSelector(state => state.directMessage)
    const { isMemberListOpen } = useSelector(state => state.memberList)
    const { directMessageList } = useSelector(state => state.chatList)

    useEffect(() => {
        if (currDirectMessageChannelRef) {
            console.log("currDirectMessageChannelRef", currDirectMessageChannelRef)
            const q = query(
                collection(db, "messages"),
                where("channelRef", "==", currDirectMessageChannelRef || ""),
                orderBy("createdAt"),
                limitToLast(20)
            );

            const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                let chatList = [];
                let previousUserRef = null;
                let previousDate = null;

                QuerySnapshot.forEach((doc) => {
                    console.log(doc)
                    const chatMessage = doc.data()
                    const currentDate = convertDateDivider(chatMessage.createdAt);
                    if (previousDate === null || currentDate != previousDate) {
                        chatList.push({ dividerDate: currentDate })
                    }
                    if (previousUserRef == null || currentDate != previousDate) {
                        chatList.push(chatMessage);
                    } else if (chatMessage.userRef === previousUserRef) {
                        chatList.push({
                            userName: null,
                            avatar: null,
                            createdAt: doc.data().createdAt,
                            type: doc.data().type,
                            fileName: null,
                            content: doc.data().content,
                            userRef: doc.data().userRef,
                            id: doc.id
                        });
                    } else {
                        chatList.push(chatMessage);
                    }

                    previousUserRef = chatMessage.userRef
                    previousDate = convertDateDivider(chatMessage.createdAt)
                });
                dispatch(setDirectMessageList(chatList))
                //scroll new message
            });
        }
        // chatScroller.current.scrollIntoView({ behavior: "smooth" });
    }, [currDirectMessageChannelRef]);

    const handleUploadOpen = () => {
        setOpenUpload(true)
    }

    const ChatItem = ({ content, userName, avatar, createdAt, type, fileName, dividerDate }) => {

        const FormatChat = () => {

            if (type.indexOf("image/") != -1) {
                return <img alt={content} src={content} style={{ maxHeight: "350px", aspectRatio: "auto", borderRadius: "8px", maxWidth: "550px" }} />
            } else if (type.indexOf("audio/") != -1) {
                return (
                    <React.Fragment>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box>
                                <Typography variant='p'>{fileName}</Typography>
                            </Box>
                            <Box>
                                <audio controls src={content} preload='none' />
                            </Box>
                        </Box>
                    </React.Fragment>
                )
            } else if (type.indexOf("video/") != -1) {
                return (
                    <video controls width="400" preload='none'>
                        <source src={content} type={type} />
                    </video>
                )
            } else if (type.indexOf("text") != -1) {
                return content
            }
        }

        const [hover, setHover] = useState(false)

        return (
            <React.Fragment>
                {
                    dividerDate ?
                        <Divider sx={{ m: 2, fontSize: 12, color: "#b5bac1" }} variant='middle'>{dividerDate}</Divider>
                        :
                        avatar ?
                            <ListItem className="message" sx={{ p: 0, m: 0 }}>
                                <ListItemButton sx={{ cursor: "default", m: 0, pt: 0, pb: 0 }}>
                                    <ListItemAvatar>
                                        <Avatar alt={userName} src={avatar} />
                                    </ListItemAvatar>
                                    <ListItemText primary={
                                        <React.Fragment>
                                            {userName}
                                            <Typography
                                                sx={{ display: 'inline', color: "#b5bac1", fontSize: "0.8em" }}
                                                component="span"
                                                variant="p"
                                                color="text.primary"
                                                marginLeft="10px"
                                            >
                                                {convertDate(createdAt)}
                                            </Typography>
                                            &nbsp;
                                            <Typography
                                                sx={{ display: 'inline', color: "#b5bac1", fontSize: "0.8em" }}
                                                component="span"
                                                variant="p"
                                                color="text.primary"
                                            >
                                                {convertTime(createdAt)}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                        secondary={<React.Fragment>
                                            <FormatChat />
                                        </React.Fragment>
                                        } primaryTypographyProps={{ variant: "body1" }} secondaryTypographyProps={{ variant: "body2", color: "white" }} />
                                </ListItemButton>
                            </ListItem>
                            :
                            <ListItem className="message" sx={{ p: 0, m: 0 }}>
                                <ListItemButton sx={{ cursor: "default", m: 0, pt: 0, pb: 0 }} onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>
                                    <ListItemAvatar>
                                        <Typography variant='body2' sx={{ display: hover ? "block" : "none", fontSize: 12, color: "#b5bac1" }}>
                                            {convertTime(createdAt)}
                                        </Typography>
                                    </ListItemAvatar>
                                    <ListItemText
                                        secondary={<React.Fragment>
                                            <FormatChat />
                                        </React.Fragment>
                                        } primaryTypographyProps={{ variant: "body1" }} secondaryTypographyProps={{ variant: "body2", color: "white" }} />
                                </ListItemButton>
                            </ListItem>
                }
            </React.Fragment>
        )
    }
    const ChatList = useMemo(() => {

        return (
            <List component="ol" className="scrollerInner">
                <ListItem>
                    <Avatar alt={currDirectMessageChannel.displayName} src={currDirectMessageChannel.avatar} style={{ borderRadius: "50%", width: "80px", height: "80px" }} />
                </ListItem>
                <ListItem>
                    <Typography variant='h3'>{currDirectMessageChannel.displayName}</Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body2">This is the beginning of your direct message history with <b>
                        {currDirectMessageChannel.displayName}
                    </b>
                        .
                    </Typography>
                </ListItem>
                {directMessageList.map(({ content, userName, avatar, createdAt, type, fileName, dividerDate }, index) => (
                    <ChatItem className="message" content={content} userName={userName} fileName={fileName} avatar={avatar} createdAt={createdAt} type={type} key={index} dividerDate={dividerDate} />
                ))}
                {/* <Divider>CENTER</Divider> */}
                <Box component="span" className="scrollerSpacer" ref={chatScroller}></Box>
            </List>
        )
    }, [currDirectMessageChannel, directMessageList])



    return (
        <Box className="content">
            <Box className="friend-main-content" component="main">
                <Box className="messageWrapper">
                    <Box component="div" className="scroller">
                        <Box className="scroll-content">
                            {ChatList}
                        </Box>
                    </Box>
                </Box>
                <Box className="form" component="form" ref={formRef} onSubmit={(e) => handleAddPrivateMessage(e)} sx={{
                    position: "relative",
                    msFlexPositive: "false",
                    flexShrink: "0",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    marginTop: "-8px",
                    color: "#ffffff"
                }}>
                    <FormControl variant="standard" required fullWidth>
                        <InputBase
                            sx={{
                                color: "#ffffff",
                                borderRadius: "8px",
                                position: 'relative',
                                backgroundColor: "#383a40",
                                border: 'none',
                                fontSize: 16,
                                padding: '10px 12px',
                                display: "flex",
                                width: "100%",
                                textIndent: "0",
                                marginBottom: "24px",
                            }}
                            startAdornment={
                                <ClickAwayListener onClickAway={() => setOpenUpload(false)}>
                                    <InputAdornment position="start">
                                        <FunctionTooltip
                                            onClose={() => setOpenUpload(false)}
                                            open={openUpload}
                                            disableFocusListener
                                            disableHoverListener
                                            disableTouchListener
                                            title={
                                                <Box component="label">
                                                    <ListItemButton sx={{
                                                        m: 0,
                                                        "&:hover": {
                                                            backgroundColor: "#5865f2",
                                                            borderRadius: "4px",
                                                        }
                                                    }} >
                                                        <input id="file" name="file" type="file" accept='audio/*,video/*,image/*' style={{ display: "none" }} onChange={(e) => handleUploadFile(e)} />
                                                        <FileUploadIcon edge="start" />
                                                        <ListItemText primary="Upload a File" secondary="Accept format, image, video, audio, text. File size limit <50MB." secondaryTypographyProps={{ color: "#fff" }} />
                                                    </ListItemButton>
                                                </Box>
                                            }>
                                            <IconButton onClick={() => handleUploadOpen()}>
                                                <AddCircleIcon />
                                            </IconButton>
                                        </FunctionTooltip>
                                    </InputAdornment>
                                </ClickAwayListener>
                            }
                            id="name"
                            name="message"
                            autoComplete='off'
                            variant="outlined"
                            onChange={(e) => dispatch(setDraftDirectMessage(e.target.value))}
                            value={draftDirectMessage}
                            placeholder={`Message @${currDirectMessageChannel.displayName}`}
                        />
                    </FormControl>
                </Box>
            </Box>
            {
                isDirectMessageSidebarOpen && <UserSidebar currDirectMessageChannel={currDirectMessageChannel} />
            }
        </Box>
    )
}


