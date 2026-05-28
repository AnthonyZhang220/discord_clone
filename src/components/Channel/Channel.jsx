import React, { useEffect, Fragment, useRef } from "react";
import { db } from "@/firebase";
import { onSnapshot, query, where, collection, doc, getDoc } from "firebase/firestore";

import { ListItemText, ListItem, ListItemButton, ListItemAvatar } from "@mui/material";
import { Avatar, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NumbersIcon from "@mui/icons-material/Numbers";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import "./Channel.scss";

import ServerSettings from "./ServerSettings/ServerSettings";
import UserFooter from "./UserFooter/UserFooter";
import VoiceControl from "./VoiceControl/VoiceControl";

import { FunctionTooltip } from "@/components/CustomUIComponents";
import {
    CreateChannelDialog,
    CreateVoiceChannelDialog,
    InviteDialog,
} from "@/components/Modals/Modals";
import { useDispatch, useSelector } from "react-redux";
import { setCreateChannelModal, setCreateVoiceChannelModal } from "@/redux/features/modalSlice";
import { setCurrChannelList, setCurrVoiceChannelList } from "@/redux/features/channelSlice";
import { toggleServerSettings } from "@/redux/features/popoverSlice";
import { handleSelectChannel } from "@/handlers/channelHandlers";
import { handleJoinVoiceChannel } from "@/handlers/voiceChannelHandlers";
import { setCurrServer } from "@/redux/features/serverSlice";

const Channel = () => {
    const channelHeaderRef = useRef(null);
    const dispatch = useDispatch();
    const { createChannelModal, createVoiceChannelModal, inviteModal } = useSelector(
        (state) => state.modal
    );
    // `user` from auth slice not used here
    const { selectedServer, selectedChannel } = useSelector((state) => state.userSelectStore);
    const { currVoiceChannel, currChannelList, currVoiceChannelList } = useSelector(
        (state) => state.channel
    );
    const { currServer } = useSelector((state) => state.server);
    const { serverSettingsPopover } = useSelector((state) => state.popover);
    const { isVoiceChatConnected, isVoiceChatLoading } = useSelector((state) => state.voiceChat);

    //get channel list by server UID
    useEffect(() => {
        let unsubscribe;
        if (selectedServer) {
            const q = query(collection(db, "channels"), where("serverRef", "==", selectedServer));
            unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                let list = [];
                QuerySnapshot.forEach((doc) => {
                    list.push({ ...doc.data(), id: doc.id });
                });
                dispatch(setCurrChannelList(list));
            });
        }
        return () => {
            if (typeof unsubscribe === "function") unsubscribe();
        };
    }, [selectedServer, dispatch]);

    //get all the voice channels by server UID
    useEffect(() => {
        let unsubscribe;
        if (selectedServer) {
            const q = query(
                collection(db, "voicechannels"),
                where("serverRef", "==", selectedServer)
            );
            unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                let list = [];
                QuerySnapshot.forEach((doc) => {
                    list.push({ ...doc.data(), id: doc.id });
                });
                dispatch(setCurrVoiceChannelList(list));
            });
        }
        return () => {
            if (typeof unsubscribe === "function") unsubscribe();
        };
    }, [selectedServer, dispatch]);

    useEffect(() => {
        if (selectedServer) {
            const serverRef = doc(db, "servers", selectedServer);
            getDoc(serverRef).then((doc) => {
                dispatch(setCurrServer({ name: doc.data().name, id: doc.data().id }));
            });
        }
    }, [selectedServer, dispatch]);

    return (
        <aside className="channel-container">
            <header
                className="channel-header focusable"
                onClick={() => dispatch(toggleServerSettings())}
                ref={channelHeaderRef}
            >
                <IconButton
                    aria-label="open servers"
                    className="mobile-servers-toggle"
                    onClick={(e) => {
                        e.stopPropagation();
                        document.body.classList.toggle("mobile-sidebar-open");
                        document.body.classList.add("mobile-app");
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography component="h6" className="channel-header-name" variant="h6">
                    {currServer.name}
                </Typography>
                {serverSettingsPopover ? (
                    <IconButton aria-label="dropdown" className="channel-header-dropdown">
                        <CloseIcon />
                    </IconButton>
                ) : (
                    <IconButton aria-label="dropdown" className="channel-header-dropdown">
                        <ExpandMoreIcon />
                    </IconButton>
                )}
            </header>
            <ServerSettings
                serverSettingsPopover={serverSettingsPopover}
                channelHeaderRef={channelHeaderRef}
            />
            <section className="channel-list-container">
                <header className="channel-list-header focusable">
                    <div>
                        <Typography component="h6" variant="h6">
                            Text Channels
                        </Typography>
                    </div>
                    <div className="channel-header-actions">
                        <FunctionTooltip
                            title={
                                <Fragment>
                                    <Typography variant="body1" className="tooltip-text">
                                        Create Channel
                                    </Typography>
                                </Fragment>
                            }
                            placement="top"
                        >
                            <AddIcon onClick={() => dispatch(setCreateChannelModal(true))} />
                        </FunctionTooltip>
                    </div>
                </header>
                <ul className="channel-list-text">
                    {currChannelList.map(({ name, id }) => (
                        <li
                            key={id}
                            id={id}
                            className={`channel channel-text ${id === selectedChannel ? "active" : ""}`}
                            onClick={() => {
                                handleSelectChannel(name, id);
                            }}
                        >
                            <NumbersIcon className="channel-item-icon" />
                            <span className="channel-name">{name}</span>
                            <IconButton aria-label="settings" className="button">
                                <SettingsIcon />
                            </IconButton>
                        </li>
                    ))}
                </ul>
                <header className="channel-list-header focusable">
                    <div>
                        <Typography component="h6" variant="h6">
                            Voice Channels
                        </Typography>
                    </div>
                    <div className="channel-header-actions">
                        <FunctionTooltip
                            title={
                                <Fragment>
                                    <Typography variant="body1" className="tooltip-text">
                                        Create Voice Channel
                                    </Typography>
                                </Fragment>
                            }
                            placement="top"
                        >
                            <AddIcon onClick={() => dispatch(setCreateVoiceChannelModal(true))} />
                        </FunctionTooltip>
                    </div>
                </header>
                <ul className="channel-list-text">
                    {currVoiceChannelList.map(({ name, id, participants }) => (
                        <Fragment key={id}>
                            <li
                                key={id}
                                id={id}
                                className={`channel channel-text ${id === currVoiceChannel.id ? "active" : ""}`}
                                onClick={() => {
                                    handleJoinVoiceChannel(name, id);
                                }}
                            >
                                <VolumeUpIcon className="channel-item-icon" />
                                <span className="channel-name">{name}</span>
                                <IconButton aria-label="settings" className="button">
                                    <SettingsIcon />
                                </IconButton>
                            </li>
                            {participants.map(({ displayName, avatar, id }) => (
                                <ListItem key={id} id={id} className="participant-item">
                                    <ListItemButton>
                                        <ListItemAvatar className="participant-avatar-wrap">
                                            <Avatar
                                                alt={displayName}
                                                src={avatar}
                                                className="participant-avatar"
                                            />
                                        </ListItemAvatar>
                                        <ListItemText primary={displayName} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </Fragment>
                    ))}
                </ul>
            </section>
            {(isVoiceChatConnected || isVoiceChatLoading) && <VoiceControl />}
            <UserFooter className="user-footer-container" />
            <InviteDialog selectedServer={selectedServer} inviteModal={inviteModal} />
            <CreateChannelDialog createChannelModal={createChannelModal} />
            <CreateVoiceChannelDialog createVoiceChannelModal={createVoiceChannelModal} />
            {/* <Outlet /> */}
        </aside>
    );
};

export default Channel;
