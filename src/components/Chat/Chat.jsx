import React, { useState, useEffect, useMemo, Fragment, useRef } from "react";
//send meesage to db
import { collection } from "firebase/firestore";
//query get chat message from db
import { doc, getDoc, query, orderBy, onSnapshot, where, limitToLast } from "firebase/firestore";
import { db } from "@/firebase";

//material ui comp
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { IconButton, ListItemButton, Typography } from "@mui/material";
import { Divider } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { InputAdornment } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import FormControl from "@mui/material/FormControl";
import InputBase from "@mui/material/InputBase";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import NumbersIcon from "@mui/icons-material/Numbers";
import ChannelMemberList from "@/components/ChannelMemberList/ChannelMemberList";
import "./Chat.scss";

import { FunctionTooltip } from "@/components/CustomUIComponents";
import { convertDate, convertDateDivider, convertTime } from "@/utils/formatter";
import { useDispatch, useSelector } from "react-redux";
import { setDraftMessage } from "@/redux/features/draftSlice";
import { setIsMemberListOpen } from "@/redux/features/memberListSlice";
import { setCurrChannel } from "@/redux/features/channelSlice";
import { handleSubmitMessage } from "@/handlers/messageHandlers";
import { setMessageList } from "@/redux/features/chatListSlice";
import { handleUploadFile } from "@/handlers/messageHandlers";
// const URL = 'http://localhost:3000';
// export const socket = io(URL);

export default function Chat() {
    const formRef = useRef();
    const chatScroller = useRef();
    const [openUpload, setOpenUpload] = useState(false);
    const dispatch = useDispatch();
    const { selectedChannel } = useSelector((state) => state.userSelectStore);
    const { currChannel } = useSelector((state) => state.channel);
    // user from auth slice not used in this component
    const { isMemberListOpen } = useSelector((state) => state.memberList);
    const { draftMessage } = useSelector((state) => state.draft);
    const { messageList } = useSelector((state) => state.chatList);
    const uploadAdornmentRef = useRef(null);

    const handleUploadOpen = () => {
        setOpenUpload(true);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                openUpload &&
                uploadAdornmentRef.current &&
                !uploadAdornmentRef.current.contains(event.target)
            ) {
                setOpenUpload(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [openUpload]);

    useEffect(() => {
        if (selectedChannel) {
            const getChannelRef = async () => {
                const channelRef = doc(db, "channels", selectedChannel || "");
                const channelDoc = await getDoc(channelRef);
                dispatch(setCurrChannel({ name: channelDoc.data().name, id: channelDoc.id }));
            };
            getChannelRef();
        }
    }, [selectedChannel, dispatch]);

    useEffect(() => {
        if (selectedChannel) {
            const q = query(
                collection(db, "messages"),
                where("channelRef", "==", selectedChannel || ""),
                orderBy("createdAt"),
                limitToLast(20)
            );

            onSnapshot(q, (QuerySnapshot) => {
                let chatList = [];
                let previousUserRef = null;
                let previousDate = null;

                QuerySnapshot.forEach((doc) => {
                    const chatMessage = doc.data();
                    const currentDate = convertDateDivider(chatMessage.createdAt);

                    if (previousDate === null || currentDate != previousDate) {
                        chatList.push({ dividerDate: currentDate });
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
                            id: doc.id,
                        });
                    } else {
                        chatList.push(chatMessage);
                    }

                    previousUserRef = chatMessage.userRef;
                    previousDate = convertDateDivider(chatMessage.createdAt);
                });

                dispatch(setMessageList(chatList));
                //scroll new message
            });
        }

        // chatScroller.current.scrollIntoView({ behavior: "smooth" });
    }, [selectedChannel, dispatch]);

    function ChatItem({ content, displayName, avatar, createdAt, type, fileName, dividerDate }) {
        const FormatChat = () => {
            if (type.indexOf("image/") != -1) {
                return (
                    <img
                        alt={content}
                        src={content}
                        style={{
                            maxHeight: "350px",
                            aspectRatio: "auto",
                            borderRadius: "8px",
                            maxWidth: "550px",
                        }}
                    />
                );
            } else if (type.indexOf("audio/") != -1) {
                return (
                    <Fragment>
                        <div className="format-audio-column">
                            <div>
                                <Typography variant="p">{fileName}</Typography>
                            </div>
                            <div>
                                <audio controls src={content} preload="metadata" />
                            </div>
                        </div>
                    </Fragment>
                );
            } else if (type.indexOf("video/") != -1) {
                return (
                    <video controls width="400" preload="metadata">
                        <source src={content} type={type} />
                    </video>
                );
            } else if (type.indexOf("text") != -1) {
                return content;
            }
        };

        return (
            <Fragment>
                {dividerDate ? (
                    <Divider className="chat-divider" variant="middle">
                        {dividerDate}
                    </Divider>
                ) : avatar ? (
                    <ListItem className="message">
                        <ListItemButton className="message-button">
                            <ListItemAvatar>
                                <Avatar alt={displayName} src={avatar} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Fragment>
                                        {displayName}
                                        <Typography
                                            className="message-date"
                                            component="span"
                                            variant="p"
                                        >
                                            {convertDate(createdAt)}
                                        </Typography>
                                        &nbsp;
                                        <Typography
                                            className="message-date"
                                            component="span"
                                            variant="p"
                                        >
                                            {convertTime(createdAt)}
                                        </Typography>
                                    </Fragment>
                                }
                                secondary={
                                    <Fragment>
                                        <FormatChat />
                                    </Fragment>
                                }
                                primaryTypographyProps={{ variant: "body1" }}
                                secondaryTypographyProps={{
                                    variant: "body2",
                                    color: "text.primary",
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ) : (
                    <ListItem className="message">
                        <ListItemButton className="message-button">
                            <ListItemAvatar>
                                <Typography variant="body2" className="timeblock">
                                    {convertTime(createdAt)}
                                </Typography>
                            </ListItemAvatar>
                            <ListItemText
                                secondary={
                                    <Fragment>
                                        <FormatChat />
                                    </Fragment>
                                }
                                primaryTypographyProps={{ variant: "body1" }}
                                secondaryTypographyProps={{
                                    variant: "body2",
                                    color: "white",
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                )}
            </Fragment>
        );
    }

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
                    <IconButton className="chat-numbers-button">
                        <NumbersIcon className="chat-numbers-icon" />
                    </IconButton>
                </ListItem>
                <ListItem>
                    <Typography variant="h3">Welcome to #{currChannel.name}!</Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body2">
                        This is the start of the #{currChannel.name} channel.
                    </Typography>
                </ListItem>
                {messageList?.map(
                    (
                        { content, displayName, avatar, createdAt, type, fileName, dividerDate },
                        index
                    ) => (
                        <ChatItem
                            className="message"
                            content={content}
                            displayName={displayName}
                            fileName={fileName}
                            avatar={avatar}
                            createdAt={createdAt}
                            type={type}
                            key={index}
                            dividerDate={dividerDate}
                        />
                    )
                )}
                <span className="scrollerSpacer" ref={chatScroller}></span>
            </List>
        );
    }, [messageList, currChannel.name]);

    return (
        <div className="chat-container">
            <CssBaseline />
            <section className="chat-header">
                <div className="chat-header-name">
                    <NumbersIcon className="chat-header-icon" />
                    <span className="chat-header-hashtag">{currChannel.name}</span>
                </div>
                <div className="chat-header-feature">
                    <FunctionTooltip
                        title={
                            <Fragment>
                                <Typography variant="body1" className="tooltip-text">
                                    {isMemberListOpen ? "Hide Member List" : "Show Member List"}
                                </Typography>
                            </Fragment>
                        }
                        placement="bottom"
                    >
                        <PeopleAltIcon
                            color="white"
                            onClick={() => dispatch(setIsMemberListOpen(!isMemberListOpen))}
                        />
                    </FunctionTooltip>
                </div>
            </section>
            <div className="content">
                <main className="chat-content">
                    <div className="messageWrapper">
                        <div className="scroller">
                            <div className="scroll-content">{ChatList}</div>
                        </div>
                    </div>
                    <form className="form" ref={formRef} onSubmit={(e) => handleSubmitMessage(e)}>
                        <FormControl variant="standard" required fullWidth>
                            <InputBase
                                className="message-input"
                                startAdornment={
                                    <span ref={uploadAdornmentRef}>
                                        <InputAdornment position="start">
                                            <FunctionTooltip
                                                onClose={() => setOpenUpload(false)}
                                                open={openUpload}
                                                disableFocusListener
                                                disableHoverListener
                                                disableTouchListener
                                                title={
                                                    <label>
                                                        <ListItemButton className="upload-listitembutton">
                                                            <input
                                                                id="file"
                                                                name="file"
                                                                type="file"
                                                                accept="audio/*,video/*,image/*"
                                                                style={{ display: "none" }}
                                                                onChange={(e) =>
                                                                    handleUploadFile(e)
                                                                }
                                                            />
                                                            <FileUploadIcon edge="start" />
                                                            <ListItemText
                                                                primary="Upload a File"
                                                                secondary="Accept format, image, video, audio, text. File size limit <50MB."
                                                                secondaryTypographyProps={{
                                                                    color: "text.primary",
                                                                }}
                                                            />
                                                        </ListItemButton>
                                                    </label>
                                                }
                                            >
                                                <IconButton onClick={() => handleUploadOpen()}>
                                                    <AddCircleIcon />
                                                </IconButton>
                                            </FunctionTooltip>
                                        </InputAdornment>
                                    </span>
                                }
                                id="name"
                                name="message"
                                autoComplete="off"
                                variant="outlined"
                                onChange={(e) => dispatch(setDraftMessage(e.target.value))}
                                value={draftMessage}
                                placeholder={`Message #${currChannel.name}`}
                            />
                        </FormControl>
                    </form>
                </main>
                {isMemberListOpen && <ChannelMemberList />}
            </div>
            {/* <Outlet /> */}
        </div>
    );
}
