import React from 'react'
import MemberStatus from '../MemberStatus/MemberStatus';
//socket-io-client
import { io } from 'socket.io-client'

import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

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
import { db, storage } from "../firebase";



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
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { TooltipProps } from '@mui/material';
import { styled } from '@mui/material/styles';
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



const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#1e2124",
    },
}));


// const URL = 'http://localhost:3000';
// export const socket = io(URL);

export default function Chat({ currentUser, currentMessage, currentChannel, handleAddMessage, handleChatInfo, currentServer }) {


    const formRef = React.useRef();
    const chatScroller = React.useRef();
    const [chatList, setChatList] = React.useState([]);
    const [openMember, setOpenMember] = React.useState(true);
    const [openUpload, setOpenUpload] = React.useState(false);
    const [fileUpload, setFileUpload] = React.useState(null);
    const [fileError, setFileError] = React.useState(false);
    const [fileErrorMessage, setFileErrorMessage] = React.useState("");

    const handleShowMemberList = () => {
        setOpenMember(!openMember)
    }

    const handleUploadOpen = () => {
        setOpenUpload(true)
    }

    function bytesToMB(bytes) {
        const mb = bytes / (1024 * 1024);
        return mb.toFixed(2);
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


        const messageMediaRef = ref(storage, `messages/${currentUser.uid}/${fileName}-${timeString}`)
        const uploadProgress = await uploadBytes(messageMediaRef, fileUploaded)
        const url = await getDownloadURL(messageMediaRef)


        await addDoc(collection(db, "messages"), {
            type: fileType,
            content: url,
            fileName: fileName,
            userName: currentUser.name,
            avatar: currentUser.profileURL,
            createdAt: Timestamp.fromDate(new Date()),
            channelRef: currentChannel.uid,
            serverRef: currentServer.uid,
            userRef: currentUser.uid,
        }).then(() => {
            setOpenUpload(false);
            setFileUpload(null);
        })

    }


    const convertDate = (date) => {
        const newDate = new Date(date.seconds * 1000)
        const formattedDate = newDate.toLocaleDateString('en-US', { month: "2-digit", day: "2-digit", year: "2-digit" })
        const now = new Date();
        const timeDiff = Math.abs(now.getTime() - newDate.getTime())

        const oneDay = 24 * 60 * 60 * 1000;

        const millisecondsInCurrentDay = now.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        if (timeDiff <= millisecondsInCurrentDay) {
            return "Today at"
        }

        if (timeDiff <= millisecondsInCurrentDay + oneDay) {
            return "Yesterday at"
        }

        return formattedDate;

    }

    const convertTime = (time) => {
        const newTime = new Date(time.seconds * 1000)
        const formattedTime = newTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

        return formattedTime;
    }

    React.useEffect(() => {
        console.log(fileUpload)
    }, [fileUpload])

    const GroupChatbyPeopleAndDate = () => {

    }

    React.useEffect(() => {
        if (currentChannel) {
            const q = query(
                collection(db, "messages"),
                where("channelRef", "==", currentChannel.uid || ""),
                orderBy("createdAt"),
                limitToLast(20)
            );

            const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                let chatList = [];
                QuerySnapshot.forEach((doc) => {
                    chatList.push({ ...doc.data(), id: doc.id });
                });

                setChatList(chatList);
                //scroll new message
            });
        }

        chatScroller.current.scrollIntoView({ behavior: "smooth" });

    }, [currentChannel]);

    const ChatItem = ({ content, userName, avatar, createdAt, type, fileName }) => {

        const FormatChat = () => {

            if (type.indexOf("image/") != -1) {
                return <img alt={content} src={content} style={{ maxHeight: "350px", aspectRatio: "auto", borderRadius: "8px", maxWidth: "550px" }} />
            } else if (type.indexOf("audio/") != -1) {
                return (
                    <React.Fragment>
                        <Typography component="div" variant='p'>{fileName}</Typography>
                        <audio controls src={content} />
                    </React.Fragment>
                )
            } else if (type.indexOf("video/") != -1) {
                return (
                    <video controls width="400" >
                        <source src={content} type={type} />
                    </video>
                )
            } else if (type.indexOf("text") != -1) {
                return content
            }
        }


        return (
            <ListItem className="message" sx={{ pl: 0, pr: 0 }}>
                <ListItemButton sx={{ cursor: "default", m: 0 }}>
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
        )
    }

    const ChatList = () => {

        React.useEffect(() => {
            chatList.forEach((message) => {
                if (!chatList[message.uid]) {
                    chatList[message.uid] = [];
                }
                chatList[message.uid].push(message)
            })
        }, [chatList])


        return (
            <List component="ol" className="scrollerInner">
                {chatList.map(({ content, userName, avatar, createdAt, type, fileName }, index) => (
                    <ChatItem className="message" content={content} userName={userName} fileName={fileName} avatar={avatar} createdAt={createdAt} type={type} key={index} />
                ))}
                {/* <Divider>CENTER</Divider> */}
                <Box component="span" className="scrollerSpacer" ref={chatScroller}></Box>
            </List>
        )
    }

    return (
        <Box className="chat-container">
            <CssBaseline />
            <Box className="chat-header" component="section">
                <Box className="chat-header-name">
                    <NumbersIcon sx={{ color: "#8a8e94", marginRight: "6px", alignItems: "baseline" }} />
                    <Box component="span" variant="h3" className="chat-header-hashtag">
                        {currentChannel.name}
                    </Box>
                </Box>
                <Box className="chat-header-feature">
                    <BootstrapTooltip title={
                        <React.Fragment>
                            <Typography variant="body1" sx={{ m: 0.5 }} >{openMember ? "Hide Member List" : "Show Member List"}</Typography>
                        </React.Fragment>} placement="bottom">
                        <PeopleAltIcon color="white" onClick={() => handleShowMemberList()} />
                    </BootstrapTooltip>
                </Box>
            </Box>
            <Box className="content">
                <Box className="chat-content" component="main">
                    <Box className="messageWrapper">
                        <Box component="div" className="scroller">
                            <Box className="scroll-content">
                                <List>
                                    <ListItem>
                                        <IconButton sx={{ color: "#ffffff" }}>
                                            <NumbersIcon sx={{ fontSize: 50 }} />
                                        </IconButton>
                                    </ListItem>
                                    <ListItem>
                                        <Typography variant='h3'>Welcome to #{currentChannel.name}!</Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography variant="body2">This is the start of the #{currentChannel.name} channel.</Typography>
                                    </ListItem>
                                </List>
                                <ChatList />
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
                                            <BootstrapTooltip
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
                                            </BootstrapTooltip>
                                        </InputAdornment>
                                    </ClickAwayListener>
                                }
                                id="name"
                                name="message"
                                autoComplete='off'
                                variant="outlined"
                                onChange={(e) => handleChatInfo(e)}
                                value={currentMessage}
                                placeholder={`Message #${currentChannel.name}`}
                            />
                        </FormControl>
                    </Box>
                </Box>
                {
                    openMember ?
                        <MemberStatus currentServer={currentServer} />
                        :
                        null
                }
                <Snackbar open={fileError} autoHideDuration={3000} onClose={() => setFileError(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                    <Alert onClose={() => setFileError(false)} severity="error" sx={{ width: '100%', fontWeight: "bold" }}>
                        {fileErrorMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    )
}
