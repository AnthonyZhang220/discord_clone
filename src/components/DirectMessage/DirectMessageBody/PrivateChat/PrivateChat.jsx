import React, { useState, useRef, useEffect, useMemo } from "react";
//send meesage to db
import { onSnapshot, query, where, collection, orderBy, limitToLast } from "firebase/firestore";
import { db } from "@/firebase";
//material ui comp
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { IconButton, ListItemButton, Typography, Divider } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { InputAdornment } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputBase from "@mui/material/InputBase";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { FunctionTooltip } from "@/components/CustomUIComponents";
import { setDraftDirectMessage } from "@/redux/features/draftSlice";
import { convertDate, convertTime, convertDateDivider } from "@/utils/formatter";
import { useDispatch, useSelector } from "react-redux";
import { setDirectMessageList } from "@/redux/features/chatListSlice";
import { handleSubmitDirectMessage } from "@/handlers/messageHandlers";
import { handleUploadFile } from "@/handlers/messageHandlers";
import { UserSidebar } from "@/components/DirectMessage/DirectMessageBody/UserSidebar/UserSidebar";

import "./PrivateChat.scss";

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
                <React.Fragment>
                    <div className="audio-file">
                        <div>
                            <Typography variant="p">{fileName}</Typography>
                        </div>
                        <div>
                            <audio controls src={content} preload="none" />
                        </div>
                    </div>
                </React.Fragment>
            );
        } else if (type.indexOf("video/") != -1) {
            return (
                <video controls width="400" preload="none">
                    <source src={content} type={type} />
                </video>
            );
        } else if (type.indexOf("text") != -1) {
            return content;
        }
        return null;
    };

    return (
        <React.Fragment>
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
                                <React.Fragment>
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
                                </React.Fragment>
                            }
                            secondary={
                                <React.Fragment>
                                    <FormatChat />
                                </React.Fragment>
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
                                <React.Fragment>
                                    <FormatChat />
                                </React.Fragment>
                            }
                            primaryTypographyProps={{ variant: "body1" }}
                            secondaryTypographyProps={{
                                variant: "body2",
                                color: "text.primary",
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            )}
        </React.Fragment>
    );
}

export default function PrivateChat() {
    const formRef = useRef();
    const chatScroller = useRef();
    const uploadAdornmentRef = useRef(null);
    const [openUpload, setOpenUpload] = useState(false);
    const dispatch = useDispatch();
    const { draftDirectMessage } = useSelector((state) => state.draft);
    const { currDirectMessageChannel, isDirectMessageSidebarOpen, currDirectMessageChannelRef } =
        useSelector((state) => state.directMessage);
    // removed unused `isMemberListOpen` to satisfy ESLint
    const { directMessageList } = useSelector((state) => state.chatList);

    useEffect(() => {
        let unsubscribe;
        if (currDirectMessageChannelRef) {
            const q = query(
                collection(db, "messages"),
                where("channelRef", "==", currDirectMessageChannelRef || ""),
                orderBy("createdAt"),
                limitToLast(20)
            );

            unsubscribe = onSnapshot(q, (QuerySnapshot) => {
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
                            displayName: null,
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
                dispatch(setDirectMessageList(chatList));
                //scroll new message
            });
        }

        return () => {
            if (typeof unsubscribe === "function") unsubscribe();
        };
        // chatScroller.current.scrollIntoView({ behavior: "smooth" });
    }, [currDirectMessageChannelRef, dispatch]);

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

    const ChatList = useMemo(() => {
        return (
            <List component="ol" className="scrollerInner">
                <ListItem>
                    <Avatar
                        alt={currDirectMessageChannel.displayName}
                        src={currDirectMessageChannel.avatar}
                        style={{ borderRadius: "50%", width: "80px", height: "80px" }}
                    />
                </ListItem>
                <ListItem>
                    <Typography variant="h3">{currDirectMessageChannel.displayName}</Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="body2">
                        This is the beginning of your direct message history with{" "}
                        <b>{currDirectMessageChannel.displayName}</b>.
                    </Typography>
                </ListItem>
                {directMessageList.map(
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
                {/* <Divider>CENTER</Divider> */}
                <span className="scrollerSpacer" ref={chatScroller}></span>
            </List>
        );
    }, [currDirectMessageChannel.displayName, currDirectMessageChannel.avatar, directMessageList]);

    return (
        <div className="content">
            <main className="friend-main-content">
                <div className="messageWrapper">
                    <div className="scroller">
                        <div className="scroll-content">{ChatList}</div>
                    </div>
                </div>
                <form className="form" ref={formRef} onSubmit={(e) => handleSubmitDirectMessage(e)}>
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
                                                            onChange={(e) => handleUploadFile(e)}
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
                            onChange={(e) => dispatch(setDraftDirectMessage(e.target.value))}
                            value={draftDirectMessage}
                            placeholder={`Message @${currDirectMessageChannel.displayName}`}
                        />
                    </FormControl>
                </form>
            </main>
            {isDirectMessageSidebarOpen && (
                <UserSidebar currDirectMessageChannel={currDirectMessageChannel} />
            )}
        </div>
    );
}
