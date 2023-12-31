import React, { useState, useEffect, useMemo, Fragment, useRef } from 'react'
import MemberStatus from '../Channel/UserFooter/UserDetailPopover/MemberStatus/MemberStatus';

//send meesage to db
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';

//query get chat message from db
import {
    query,
    orderBy,
    onSnapshot,
    where,
    limitToLast,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { bytesToMB } from '../../utils/bytesToMB';


//material ui comp
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
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
import InputLabel from '@mui/material/InputLabel';
import { TextFieldProps } from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputBase from '@mui/material/InputBase';
import { ClickAwayListener } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import NumbersIcon from '@mui/icons-material/Numbers';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import './Chat.scss'


import { Outlet } from 'react-router-dom';
import { FunctionTooltip } from '../CustomUIComponents';
import { Message } from '@mui/icons-material';
import { convertDate, convertDateDivider, convertTime } from '../../utils/dateConverter';
import { useSelector } from 'react-redux';

// const URL = 'http://localhost:3000';
// export const socket = io(URL);

export default function Chat({ currentMessage, handleAddMessage, handleChatInfo }) {


    const formRef = useRef();
    const chatScroller = useRef();
    const [chatList, setChatList] = useState([]);
    const [openMember, setOpenMember] = useState(true);
    const [openUpload, setOpenUpload] = useState(false);
    const [fileUpload, setFileUpload] = useState(null);
    const [fileError, setFileError] = useState(false);
    const [fileErrorMessage, setFileErrorMessage] = useState("");
    const { selectedServer, selectedChannel } = useSelector(state => state.userSelectStore)
    const { user } = useSelector(state => state.auth)
    const handleShowMemberList = () => {
        setOpenMember(!openMember)
    }

    const handleUploadOpen = () => {
        setOpenUpload(true)
    }

    const handleUploadFile = async (e) => {

        const fileUploaded = e.target.files[0]

        const fileSize = fileUploaded.size;
        const fileType = fileUploaded.type;
        const fileName = fileUploaded.name;

        const mb = bytesToMB(fileSize);

        if (!fileUploaded) {
            return;
        }

        if (mb > 50) {
            setFileError(true);
            setFileErrorMessage("File exceeds 50MB.")
            return;
        }

        // if(fileType !== ){
        //     setFileError(true);
        //     setFileErrorMessage("File format unsupported.")
        //     return;
        // }

        // setFileUpload(fileUploaded)
        const date = new Date();
        const timeString = date.toISOString();


        const messageMediaRef = ref(storage, `messages/${user.uid}/${fileName}-${timeString}`)
        const uploadProgress = await uploadBytes(messageMediaRef, fileUploaded)
        const url = await getDownloadURL(messageMediaRef)


        await addDoc(collection(db, "messages"), {
            type: fileType,
            content: url,
            fileName: fileName,
            userName: user.name,
            avatar: user.profileURL,
            createdAt: Timestamp.fromDate(new Date()),
            channelRef: selectedChannel.uid,
            serverRef: selectedServer.uid,
            userRef: user.uid,
        }).then(() => {
            setOpenUpload(false);
            setFileUpload(null);
        })

    }
    const GroupChatbyPeopleAndDate = () => {

    }
    const [previousUserRef, setPreviousUserRef] = useState(null);

    useEffect(() => {
        if (selectedChannel) {
            const q = query(
                collection(db, "messages"),
                where("channelRef", "==", selectedChannel.uid || ""),
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

                setChatList(chatList);
                //scroll new message
            });
        }

        // chatScroller.current.scrollIntoView({ behavior: "smooth" });

    }, [selectedChannel]);

    const ChatItem = useMemo(() => ({ content, userName, avatar, createdAt, type, fileName, dividerDate }) => {

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
                                        <Avatar alt={userName} src={avatar} />
                                    </ListItemAvatar>
                                    <ListItemText primary={
                                        <Fragment>
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
    }, [chatList])


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
                    <Typography variant='h3'>Welcome to #{selectedChannel.name}!</Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body2">This is the start of the #{selectedChannel.name} channel.</Typography>
                </ListItem>
                {
                    chatList?.map(({ content, userName, avatar, createdAt, type, fileName, dividerDate }, index) => (
                        <ChatItem className="message" content={content} userName={userName} fileName={fileName} avatar={avatar} createdAt={createdAt} type={type} key={index} dividerDate={dividerDate} />
                    ))
                }
                <Box component="span" className="scrollerSpacer" ref={chatScroller}></Box>
            </List>
        )
    }, [chatList])

    return (
        <Box className="chat-container">
            <CssBaseline />
            <Box className="chat-header" component="section">
                <Box className="chat-header-name">
                    <NumbersIcon sx={{ color: "#8a8e94", marginRight: "6px", alignItems: "baseline" }} />
                    <Box component="span" variant="h3" className="chat-header-hashtag">
                        {selectedChannel.name}
                    </Box>
                </Box>
                <Box className="chat-header-feature">
                    <FunctionTooltip title={
                        <Fragment>
                            <Typography variant="body1" sx={{ m: 0.5 }} >{openMember ? "Hide Member List" : "Show Member List"}</Typography>
                        </Fragment>} placement="bottom">
                        <PeopleAltIcon color="white" onClick={() => handleShowMemberList()} />
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
                    <Box className="form" component="form" ref={formRef} onSubmit={(e) => handleAddMessage(e)} sx={{
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
                                onChange={(e) => handleChatInfo(e)}
                                value={currentMessage}
                                placeholder={`Message #${selectedChannel.name}`}
                            />
                        </FormControl>
                    </Box>
                </Box>
                {
                    openMember ?
                        <MemberStatus />
                        :
                        null
                }
                <Snackbar open={fileError} autoHideDuration={3000} onClose={() => setFileError(false)} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                    <Alert onClose={() => setFileError(false)} severity="error" sx={{ width: '100%', fontWeight: "bold" }}>
                        {fileErrorMessage}
                    </Alert>
                </Snackbar>
            </Box>
            {/* <Outlet /> */}
        </Box>
    )
}
