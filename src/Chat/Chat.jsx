import React from 'react'
import { io } from 'socket.io-client'


//material ui comp
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { Typography } from '@mui/material';
import './Chat.scss'


const URL = 'http://localhost:3000';
export const socket = io(URL);

function refreshChat() {
    const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

    return Array.from(new Array(5)).map(
        () => messageExamples[getRandomInt(messageExamples.length)],
    );
}

export default function Chat() {


    const [value, setValue] = React.useState(0);
    const ref = React.useRef();
    const formRef = React.useRef();
    const chatScroller = React.useRef();
    const [message, setMessage] = React.useState("");
    const [chatList, setChatList] = React.useState([])

    const handleSubmit = (e) => {
        e.preventDefault();

        // //get message text
        // const message = e.target.elements.message.value;
        //emit message to server
        socket.emit("chatMessage", message)
    }

    const handleForm = (e) => {
        setMessage(e.target.value)
        console.log(message)
    }

    React.useEffect(() => {

        ref.current.scrollTop = 0;

        socket.on('message', message => {
            setChatList((data) => [...data, message])
            console.log(chatList)

            //scroll new message
            chatScroller.current.scrollTop = chatScroller.current.scrollHeight;

        })

        return () => {

        }

    }, [socket, value]);

    return (
        <Box className="chat-container" ref={ref}>
            <CssBaseline />
            <Box className="chat-title" component="section">
                <Typography component="h6" variant="h6" className="chat-name">
                    general
                </Typography>
                <Box className="toolbar">

                </Box>
            </Box>
            <Box className="content">
                <Box className="chat-content" component="main">
                    <Box className="messageWrapper">
                        <Box className="messageScroller" ref={chatScroller}>
                            <Box className="scroll-content">
                                <List component="ol" className="scrollerInner">
                                    {chatList.map((message, index) => (
                                        <Box className="message" key={index} component="li">
                                            <ListItem className="message" key={index} component="li" >
                                                <ListItemAvatar>
                                                    <Avatar alt="Profile Picture" />
                                                </ListItemAvatar>
                                                <ListItemText primary={message} secondary={message} primaryTypographyProps={{ variant: "body1" }} secondaryTypographyProps={{ variant: "body2" }} />
                                            </ListItem>
                                        </Box>
                                    ))}
                                    <Box className="scrollerSpacer"></Box>
                                </List>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box className="form" component="form" ref={formRef} onSubmit={(e) => handleSubmit(e)}>
                <TextField type="chat" className="textArea" onChange={(e) => handleForm(e)} />
            </Box>
        </Box>

    )
}
