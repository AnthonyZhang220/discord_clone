import React, { useState, useEffect, useMemo, Fragment, useRef } from 'react'
//send meesage to db
import { collection } from "firebase/firestore";
//query get chat message from db
import {
    doc,
    getDoc,
    query,
    orderBy,
    onSnapshot,
    where,
    limitToLast,
} from "firebase/firestore";
import { db, storage } from "../../firebase";


//material ui comp
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { IconButton, Input, ListItemButton, Typography } from '@mui/material';
import { Divider } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { InputAdornment } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FormControl from '@mui/material/FormControl';
import InputBase from '@mui/material/InputBase';
import { ClickAwayListener } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import NumbersIcon from '@mui/icons-material/Numbers';
import ChannelMemberList from '../ChannelMemberList/ChannelMemberList';
import './Chat.scss'


import { FunctionTooltip } from '../CustomUIComponents';
import { convertDate, convertDateDivider, convertTime } from '../../utils/formatter';
import { useDispatch, useSelector } from 'react-redux';
import { setDraftMessage } from '../../redux/features/draftSlice';
import { setIsMemberListOpen } from '../../redux/features/memberListSlice';
import { setCurrChannel } from '../../redux/features/channelSlice';
import { handleSubmitMessage } from '../../utils/handlers/messageHandlers';
import { setMessageList } from '../../redux/features/chatListSlice';
import { handleUploadFile } from '../../utils/handlers/messageHandlers';
// const URL = 'http://localhost:3000';
// export const socket = io(URL);

export default function Chat() {

    const formRef = useRef();
    const chatScroller = useRef();
    const [openUpload, setOpenUpload] = useState(false);
    const dispatch = useDispatch();
    const { selectedServer, selectedChannel } = useSelector(state => state.userSelectStore)
    const { currChannel } = useSelector(state => state.channel)
    const { user } = useSelector(state => state.auth)
    const { isMemberListOpen } = useSelector(state => state.memberList)
    const { draftMessage } = useSelector(state => state.draft)
    const { messageList } = useSelector(state => state.chatList)


    const handleUploadOpen = () => {
        setOpenUpload(true)
    }

    useEffect(() => {
        if (selectedChannel) {
            const getChannelRef = async () => {
                const channelRef = doc(db, "channels", selectedChannel || "");
                const channelDoc = await getDoc(channelRef);
                dispatch(setCurrChannel({ name: channelDoc.data().name, id: channelDoc.id }))
            }
            getChannelRef();
        }
    }, [selectedChannel])

    useEffect(() => {
        if (selectedChannel) {
            const q = query(
                collection(db, "messages"),
                where("channelRef", "==", selectedChannel || ""),
                orderBy("createdAt"),
                limitToLast(20)
            );

            const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                let chatList = [];
                let previousUserRef = null;
                let previousDate = null;

                QuerySnapshot.forEach((doc) => {
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

                dispatch(setMessageList(chatList))
                //scroll new message
            });
        }

        // chatScroller.current.scrollIntoView({ behavior: "smooth" });

    }, [selectedChannel]);

    const ChatItem = useMemo(() => ({ content, displayName, avatar, createdAt, type, fileName, dividerDate }) => {
        const FormatChat = () => {
            if (type.indexOf("image/") != -1) {
                return <img alt={content} src={content} style={{ maxHeight: "350px", aspectRatio: "auto", borderRadius: "8px", maxWidth: "550px" }} />
            } else if (type.indexOf("audio/") != -1) {
                return (
                    <Fragment>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box>
                                <Typography variant='p'>{fileName}</Typography>
                            </Box>
                            <Box>
                                <audio controls src={content} preload='metadata' />
                            </Box>
                        </Box>
                    </Fragment>
                )
            } else if (type.indexOf("video/") != -1) {
                return (
                    <video controls width="400" preload='metadata' >
                        <source src={content} type={type} />
                    </video>
                )
            } else if (type.indexOf("text") != -1) {
                return content
            }
        }

        return (
            <Fragment>
                {
                    dividerDate ?
                        <Divider sx={{ m: 2, fontSize: 12, color: "#b5bac1" }} variant='middle'>{dividerDate}</Divider>
                        :
                        avatar ?
                            <ListItem className="message" sx={{ p: 0, m: 0 }}>
                                <ListItemButton sx={{ cursor: "default", m: 0, pt: 0, pb: 0 }}>
                                    <ListItemAvatar>
                                        <Avatar alt={displayName} src={avatar} />
                                    </ListItemAvatar>
                                    <ListItemText primary={
                                        <Fragment>
                                            {displayName}
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
                                        </Fragment>
                                    }
                                        secondary={<Fragment>
                                            <FormatChat />
                                        </Fragment>
                                        } primaryTypographyProps={{ variant: "body1" }} secondaryTypographyProps={{ variant: "body2", color: "white" }} />
                                </ListItemButton>
                            </ListItem>
                            :
                            <ListItem className="message" sx={{
                                p: 0, m: 0, "&:hover": {
                                    ".timeblock": {
                                        display: "block"
                                    }
                                }
                            }}>
                                <ListItemButton sx={{ cursor: "default", m: 0, pt: 0, pb: 0 }}>
                                    <ListItemAvatar>
                                        <Typography variant='body2' className="timeblock" sx={{
                                            display: "none", fontSize: 12, color: "#b5bac1"
                                        }}>
                                            {convertTime(createdAt)}
                                        </Typography>
                                    </ListItemAvatar>
                                    <ListItemText
                                        secondary={<Fragment>
                                            <FormatChat />
                                        </Fragment>
                                        } primaryTypographyProps={{ variant: "body1" }} secondaryTypographyProps={{ variant: "body2", color: "white" }} />
                                </ListItemButton>
                            </ListItem>
                }
            </Fragment>
        )
    }, [messageList])


    const ChatList = useMemo(() => {

        // useEffect(() => {
        //     chatList.forEach((message) => {
        //         if (!chatList[message.uid]) {
        //             chatList[message.uid] = [];
        //         }
        //         chatList[message.uid].push(message)
        //     })
        // }, [chatList])
        return (
            <List component="ol" className="scrollerInner">
                <ListItem>
                    <IconButton sx={{ color: "#ffffff" }}>
                        <NumbersIcon sx={{ fontSize: 50 }} />
                    </IconButton>
                </ListItem>
                <ListItem>
                    <Typography variant='h3'>Welcome to #{currChannel.name}!</Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body2">This is the start of the #{currChannel.name} channel.</Typography>
                </ListItem>
                {
                    messageList?.map(({ content, displayName, avatar, createdAt, type, fileName, dividerDate }, index) => (
                        <ChatItem className="message" content={content} displayName={displayName} fileName={fileName} avatar={avatar} createdAt={createdAt} type={type} key={index} dividerDate={dividerDate} />
                    ))
                }
                <Box component="span" className="scrollerSpacer" ref={chatScroller}></Box>
            </List>
        )
    }, [messageList, currChannel.id])

    return (
        <Box className="chat-container">
            <CssBaseline />
            <Box className="chat-header" component="section">
                <Box className="chat-header-name">
                    <NumbersIcon sx={{ color: "#8a8e94", marginRight: "6px", alignItems: "baseline" }} />
                    <Box component="span" variant="h3" className="chat-header-hashtag">
                        {currChannel.name}
                    </Box>
                </Box>
                <Box className="chat-header-feature">
                    <FunctionTooltip title={
                        <Fragment>
                            <Typography variant="body1" sx={{ m: 0.5 }} >{isMemberListOpen ? "Hide Member List" : "Show Member List"}</Typography>
                        </Fragment>} placement="bottom">
                        <PeopleAltIcon color="white" onClick={() => dispatch(setIsMemberListOpen(!isMemberListOpen))} />
                    </FunctionTooltip>
                </Box>
            </Box>
            <Box className="content">
                <Box className="chat-content" component="main">
                    <Box className="messageWrapper">
                        <Box component="div" className="scroller">
                            <Box className="scroll-content">
                                {ChatList}
                            </Box>
                        </Box>
                    </Box>
                    <Box className="form" component="form" ref={formRef} onSubmit={(e) => handleSubmitMessage(e)} sx={{
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
                                onChange={(e) => dispatch(setDraftMessage(e.target.value))}
                                value={draftMessage}
                                placeholder={`Message #${currChannel.name}`}
                            />
                        </FormControl>
                    </Box>
                </Box>
                {
                    isMemberListOpen && <ChannelMemberList />
                }
            </Box>
            {/* <Outlet /> */}
        </Box>
    )
}
