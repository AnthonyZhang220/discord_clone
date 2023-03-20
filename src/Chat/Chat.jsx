import React from 'react'
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

import './Chat.scss'



// const URL = 'http://localhost:3000';
// export const socket = io(URL);

export default function Chat() {


    const formRef = React.useRef();
    const chatScroller = React.useRef();
    const [message, setMessage] = React.useState("");
    const [chatList, setChatList] = React.useState([]);


    //send message
    const handleSubmit = (e) => {
        e.preventDefault();

        if (message.trim() === "") {
            return;
        }

        const { uid, displayName, photoURL } = auth.currentUser;

        console.log(auth.currentUser)

        addDoc(collection(db, "messages"), {
            text: message,
            name: displayName,
            avatar: photoURL,
            createdAt: Timestamp.fromDate(new Date()),
            uid,
        }).then(() => {
            setMessage("")
        })

        //scroll on new message
        // chatScroller.current.scrollIntoView({ behavior: "smooth" });

        // //get message text
        // const message = e.target.elements.message.value;
        //emit message to server
        // socket.emit("chatMessage", message)
    }

    const handleForm = (e) => {
        setMessage(e.target.value)
    }

    React.useEffect(() => {

        const q = query(
            collection(db, "messages"),
            orderBy("createdAt"),
            limitToLast(10)
        );

        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            let chatList = [];
            QuerySnapshot.forEach((doc) => {
                chatList.push({ ...doc.data(), id: doc.id });
            });
            setChatList(chatList);
        });



        // socket.on('message', message => {
        //     setChatList((data) => [...data, message])
        //     console.log(chatList)

        //     //scroll new message
        chatScroller.current.scrollIntoView({ behavior: "smooth" });

        // })


        return () => {
            unsubscribe();
        }

    }, []);

    return (
        <Box className="chat-container">
            <CssBaseline />
            <Box className="chat-title" component="section">
                <Typography component="h6" variant="h6" className="chat-name">
                    general
                </Typography>
            </Box>
            <Box className="content">
                <Box className="chat-content" component="main">
                    <Box className="messageWrapper">
                        <Box className="scroller">
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
                </Box>
            </Box>
            <Box className="form" component="form" ref={formRef} onSubmit={(e) => handleSubmit(e)} sx={{
                position: "relative",
                msFlexPositive: "false",
                flexShrink: "0",
                paddingLeft: "16px",
                paddingRight: "16px",
                marginTop: "-8px",
                color: "#ffffff"
            }}>
                <TextField type="chat" className="textArea" placeholder='Enter Your Message here'
                    InputProps={{
                        startAdornment: <InputAdornment position="start">
                            <IconButton>
                                <AddCircleIcon />
                            </IconButton>
                        </InputAdornment>,
                    }}
                    onChange={(e) => handleForm(e)} sx={{
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

    )
}
