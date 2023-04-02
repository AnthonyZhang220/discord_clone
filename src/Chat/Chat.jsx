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

    const handleShowMemberList = () => {
        setOpenMember(!openMember)
    }

    const handleUploadOpen = () => {
        setOpenUpload(true)
    }

    const handleUploadFile = async (e) => {

        const fileUploaded = e.target.files[0]

        if (!fileUploaded) {
            return;
        }

        // setFileUpload(fileUploaded)
        const date = new Date();
        const timeString = date.toISOString();

        const fileType = fileUploaded.type;
        const fileName = fileUploaded.name;

        const messageMediaRef = ref(storage, `messages/${currentUser.uid}/${fileName}-${timeString}`)
        const uploadProgress = await uploadBytes(messageMediaRef, fileUploaded)
        const url = await getDownloadURL(messageMediaRef)


        await addDoc(collection(db, "messages"), {
            type: fileType,
            content: url,
            name: currentUser.name,
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

    React.useEffect(() => {
        console.log(fileUpload)
    }, [fileUpload])

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
            });
        }

        //scroll new message
        // chatScroller.current.scrollIntoView({ behavior: "smooth" });

    }, [currentChannel]);

    const ChatItem = ({ content, name, avatar, createdAt, type }) => {

        const FormatChat = () => {

            if (type.indexOf("image/") != -1) {
                return <img alt={content} src={content} />
            } else if (type.indexOf("video/") != -1) {
                return <audio controls src={content} />
            } else if (type.indexOf("audio/") != -1) {
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
            <ListItem className="message" >
                <ListItemAvatar>
                    <Avatar alt="Profile Picture" src={avatar} />
                </ListItemAvatar>
                <ListItemText primary={
                    <React.Fragment>
                        {name}
                        <Typography
                            sx={{ display: 'inline', color: "#b5bac1", fontSize: "0.8em" }}
                            component="span"
                            variant="p"
                            color="text.primary"
                            marginLeft="10px"
                        >
                            {new Date(createdAt.seconds * 1000).toLocaleDateString('en-US', { month: "2-digit", day: "2-digit", year: "2-digit" })}
                        </Typography>
                        &nbsp;
                        <Typography
                            sx={{ display: 'inline', color: "#b5bac1", fontSize: "0.8em" }}
                            component="span"
                            variant="p"
                            color="text.primary"
                        >
                            {new Date(createdAt.seconds * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </Typography>
                    </React.Fragment>
                }
                    secondary={<React.Fragment>
                        <FormatChat />
                    </React.Fragment>
                    } primaryTypographyProps={{ variant: "body1" }} secondaryTypographyProps={{ variant: "body2", color: "white" }} />
            </ListItem>
        )
    }

    const ChatList = () => {
        return (
            <List component="ol" className="scrollerInner">
                {chatList.map(({ content, name, avatar, createdAt, type }, index) => (
                    <Box className="message" key={index}>
                        <ChatItem content={content} name={name} avatar={avatar} createdAt={createdAt} type={type} />
                    </Box>
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
                                                            <ListItemText primary="Upload a File" secondary="Accept format, image, video, audio, text." secondaryTypographyProps={{ color: "#fff" }} />
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
            </Box>
        </Box>
    )
}
