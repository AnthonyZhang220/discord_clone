import React from 'react'
import UserStatus from '../UserStatus/UserStatus';
//socket-io-client
import { io } from 'socket.io-client'

import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

//send meesage to db
import { addDoc, collection, Timestamp } from "firebase/firestore";

//query get chat message from db
import {
    query,
    orderBy,
    onSnapshot,
    where,
    limitToLast,
} from "firebase/firestore";
import { db } from "../firebase";



//material ui comp
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { IconButton, Typography } from '@mui/material';
import { Divider } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { InputAdornment } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

import './Chat.scss'



// const URL = 'http://localhost:3000';
// export const socket = io(URL);

export default function Chat({ currentMessage, currentChannel, handleAddMessage, handleChatInfo, currentServer }) {


    const formRef = React.useRef();
    const chatScroller = React.useRef();
    const [chatList, setChatList] = React.useState([]);
    const [openMember, setOpenMember] = React.useState(false);

    const handleShowMemberList = () => {
        setOpenMember(!openMember)
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
            });
        }

        //scroll new message
        chatScroller.current.scrollIntoView({ behavior: "smooth" });

    }, [currentChannel]);

    return (
        <Box className="chat-container">
            <CssBaseline />
            <Box className="chat-header" component="section">
                <Box className="chat-header-name">
                    <Typography component="h3" variant="h3" className="chat-header-hashtag">
                        {currentChannel.name}
                    </Typography>
                </Box>
                <Box className="chat-header-feature">
                    <PeopleAltIcon color="white" onClick={() => handleShowMemberList()} />
                </Box>
            </Box>
            <Box className="content">
                <Box className="chat-content" component="main">
                    <Box className="messageWrapper">
                        <Box component="div" className="scroller">
                            <Box className="scroll-content">
                                <List component="ol" className="scrollerInner">
                                    {chatList.map(({ text, name, avatar, createdAt }, index) => (
                                        <Box className="message" key={index}>
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
                                                    secondary={text} primaryTypographyProps={{ variant: "body1" }} secondaryTypographyProps={{ variant: "body2", color: "white" }} />
                                            </ListItem>
                                        </Box>
                                    ))}
                                    {/* <Divider>CENTER</Divider> */}
                                    <Box component="span" className="scrollerSpacer" ref={chatScroller}></Box>
                                </List>
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
                        <TextField className="textArea" placeholder='Enter Your Message here'
                            InputProps={{
                                startAdornment: <InputAdornment position="start">
                                    <IconButton>
                                        <AddCircleIcon />
                                    </IconButton>
                                </InputAdornment>,
                            }}
                            onChange={(e) => handleChatInfo(e)} sx={{
                                position: "relative",
                                display: "flex",
                                width: "100%",
                                textIndent: "0",
                                borderRadius: "8px",
                                marginBottom: "24px",
                                backgroundColor: "#383a40",
                            }} />
                    </Box>
                </Box>
                {
                    openMember ?
                        <UserStatus currentServer={currentServer} />
                        :
                        null
                }
            </Box>
        </Box>

    )
}
