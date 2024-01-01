import React, { useState, useRef, useEffect, useMemo, memo } from 'react'
import MemberStatus from '../Channel/UserFooter/UserDetailPopover/MemberStatus/MemberStatus';
//socket-io-client
import { io } from 'socket.io-client'

import { auth } from '../../firebase';
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
import { db, storage } from "../../firebase";



//material ui comp
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
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
import NumbersIcon from '@mui/icons-material/Numbers';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import { MenuListItemButton } from '../CustomUIComponents';

import StatusList from '../StatusList';
import './PrivateChat.scss'

import { Outlet } from 'react-router-dom';
import { FunctionTooltip } from '../CustomUIComponents';
import ColorThief from "colorthief"
import { setDraftDirectMessage } from '../../redux/features/directMessageSlice';

export default function PrivateChat({ user, userSideBar, currentPrivateChannel, privateMessages, handleAddPrivateMessage }) {
    const formRef = useRef();
    const chatScroller = useRef();
    const [openMember, setOpenMember] = useState(true);
    const [openUpload, setOpenUpload] = useState(false);
    const [fileUpload, setFileUpload] = useState(null);
    const [fileError, setFileError] = useState(false);
    const [fileErrorMessage, setFileErrorMessage] = useState("");
    const { draftDirectMessage } = useSelector(state => state.directMessage)

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
            channelRef: currentPrivateChannel.uid,
            userRef: user.uid,
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
                    <Avatar alt={currentPrivateChannel.name} src={currentPrivateChannel.avatar} style={{ borderRadius: "50%", width: "80px", height: "80px" }} />
                </ListItem>
                <ListItem>
                    <Typography variant='h3'>{currentPrivateChannel.name}</Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body2">This is the beginning of your direct message history with <b>
                        {currentPrivateChannel.name}
                    </b>
                        .
                    </Typography>
                </ListItem>
                {privateMessages.map(({ content, userName, avatar, createdAt, type, fileName, dividerDate }, index) => (
                    <ChatItem className="message" content={content} userName={userName} fileName={fileName} avatar={avatar} createdAt={createdAt} type={type} key={index} dividerDate={dividerDate} />
                ))}
                {/* <Divider>CENTER</Divider> */}
                <Box component="span" className="scrollerSpacer" ref={chatScroller}></Box>
            </List>
        )
    }, [privateMessages])

    const profileRef = useRef(null);
    const [bannerColor, setBannerColor] = useState("")

    useEffect(() => {
        if (profileRef.current.complete && userSideBar) {
            const colorthief = new ColorThief();
            const banner = colorthief.getColor(profileRef.current)
            const rgbColor = `rgb(${banner.join(", ")})`
            setBannerColor(rgbColor)
            console.log(banner)
        }

    }, [profileRef, userSideBar])

    const UserSideBar = useMemo(() => {
        return (
            <Box className="userSidebar-container">
                <Box component="aside" className="userSidebar-memberlist-wrapper" sx={{ backgroundColor: bannerColor, width: "100%", transition: "background-color 0.1s" }}>
                    <Box className="userSidebar-memberlist" >
                        <Box>
                            <Box className="userSidebar-detail-top">
                                <svg className="userSidebar-detail-banner">
                                    <mask id="uid_347">
                                        <rect></rect>
                                        <circle></circle>
                                    </mask>
                                    <foreignObject className="userSidebar-detail-object">
                                    </foreignObject>
                                </svg>
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    className="userSidebar-detail-avatar"
                                    badgeContent={
                                        <StatusList status={currentPrivateChannel.status} />
                                    }
                                >
                                    <Avatar alt={currentPrivateChannel.name} sx={{ width: "80px", height: "80px" }} src={currentPrivateChannel.avatar} imgProps={{ ref: profileRef, crossOrigin: "Anonymous" }} />
                                </Badge>
                            </Box>
                            <Box className="userSidebar-detail-list">
                                <ListItem dense>
                                    <MenuListItemButton>
                                        <ListItemText primary={currentPrivateChannel.name} primaryTypographyProps={{ variant: "h3" }} />
                                    </MenuListItemButton>
                                </ListItem>
                                <Divider style={{ backgroundColor: "#8a8e94" }} variant="middle" light={true} />
                                <ListItem dense>
                                    <MenuListItemButton>
                                        <ListItemText primary="MEMBER SINCE" primaryTypographyProps={{ variant: "h5" }} secondary={new Date(currentPrivateChannel.createdAt * 1000).toLocaleDateString('en-US', { month: "short", day: "2-digit", year: "numeric" })} secondaryTypographyProps={{
                                            style: {
                                                color: "white"
                                            }
                                        }} />
                                    </MenuListItemButton>
                                </ListItem>
                                <Divider style={{ backgroundColor: "#8a8e94" }} variant="middle" light={true} />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        )
    }, [currentPrivateChannel.avatar])

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
                            placeholder={`Message @${currentPrivateChannel.name}`}
                        />
                    </FormControl>
                </Box>
            </Box>
            {
                userSideBar ?
                    UserSideBar
                    :
                    null
            }
            <Snackbar open={fileError} autoHideDuration={3000} onClose={() => setFileError(false)} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                <Alert onClose={() => setFileError(false)} severity="error" sx={{ width: '100%', fontWeight: "bold" }}>
                    {fileErrorMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}


