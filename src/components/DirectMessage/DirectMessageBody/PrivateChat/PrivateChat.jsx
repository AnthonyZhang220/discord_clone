import React, { useState, useRef, useEffect, useMemo, memo } from 'react'
//send meesage to db
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';
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
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import { MenuListItemButton } from '../../../CustomUIComponents';

import StatusList from '../../../StatusList';
import './PrivateChat.scss'

import { FunctionTooltip } from '../../../CustomUIComponents';
import { setDraftDirectMessage } from '../../../../redux/features/draftSlice';
import { bytesToMB } from '../../../../utils/bytesToMB';
import { convertDate, convertTime, convertDateDivider } from '../../../../utils/formatter';
import { useSelector } from 'react-redux';

export default function PrivateChat({ user, userSideBar, currentPrivateChannel, privateMessages, handleAddPrivateMessage }) {
    const formRef = useRef();
    const chatScroller = useRef();
    const [openUpload, setOpenUpload] = useState(false);
    const { draftDirectMessage } = useSelector(state => state.draft)
    const { isMemberListOpen } = useSelector(state => state.memberList)


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

    const UserSideBar = useMemo(() => {
        return (
            <Box className="userSidebar-container">
                <Box component="aside" className="userSidebar-memberlist-wrapper" sx={{ width: "100%", transition: "background-color 0.1s" }}>
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
                                    <Avatar alt={currentPrivateChannel.name} sx={{ width: "80px", height: "80px" }} src={currentPrivateChannel.avatar} imgProps={{ crossOrigin: "Anonymous" }} />
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
        </Box>
    )
}


