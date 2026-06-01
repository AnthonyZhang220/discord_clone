import React, { useEffect, Fragment, useRef, useCallback } from "react";
import { db } from "@/firebase";
import { onSnapshot, query, where, collection, doc, getDoc } from "firebase/firestore";

import AvatarWithStatus from "@/components/AvatarWithStatus/AvatarWithStatus";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NumbersIcon from "@mui/icons-material/Numbers";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import ServerSettings from "./ServerSettings/ServerSettings";
import UserFooter from "../AccountTray/AccountTray";

import { Tooltip } from "@/components/compat/RadixCompat";
import {
    CreateTextChannelDialog,
    CreateVoiceChannelDialog,
    InviteServerDialog,
} from "@/components/dialogs/server";
import { useDispatch, useSelector } from "react-redux";
import { setCreateChannelModal, setCreateVoiceChannelModal } from "@/redux/features/modalSlice";
import { setCurrChannelList, setCurrVoiceChannelList } from "@/redux/features/channelSlice";
import { toggleServerSettings } from "@/redux/features/popoverSlice";
import { handleSelectChannel } from "@/handlers/channelHandlers";
import { handleJoinVoiceChannel } from "@/handlers/voiceChannelHandlers";
import { setCurrServer } from "@/redux/features/serverSlice";
import "./Channel.scss";

const ChannelListItem = React.memo(function ChannelListItem({
    id,
    name,
    isActive,
    onSelect,
    onSettings,
    Icon,
}) {
    return (
        <li key={id} id={id} className={`channel-list-item ${isActive ? "active" : ""}`}>
            <button
                type="button"
                className={`sidebar-item ${isActive ? "active" : ""}`}
                onClick={() => onSelect(name, id)}
            >
                {Icon ? (
                    <Icon className="channel-item-icon" />
                ) : (
                    <NumbersIcon className="channel-item-icon" />
                )}
                <span className="channel-name">{name}</span>
            </button>
            <button
                type="button"
                aria-label="settings"
                className="channel-action button"
                onClick={(e) => {
                    e.stopPropagation();
                    if (onSettings) onSettings(id);
                }}
            >
                <SettingsIcon />
            </button>
        </li>
    );
});

const ParticipantItem = React.memo(function ParticipantItem({
    displayName,
    avatar,
    id,
    status,
    onOpen,
    setRef,
}) {
    return (
        <li key={id} id={id} className="participant-item" ref={(ele) => setRef(id, ele)}>
            <button
                type="button"
                className={`sidebar-item participant-button`}
                onClick={() => onOpen(id)}
            >
                <AvatarWithStatus
                    containerClassName="participant-avatar-wrap"
                    avatarClassName="participant-avatar"
                    alt={displayName}
                    src={avatar}
                    status={status}
                />
                <div className="participant-text">{displayName}</div>
            </button>
        </li>
    );
});

const Channel = () => {
    const channelHeaderRef = useRef(null);
    const dispatch = useDispatch();
    const onSelectChannel = useCallback((name, id) => {
        handleSelectChannel(name, id);
    }, []);

    const onJoinVoice = useCallback((name, id) => {
        handleJoinVoiceChannel(name, id);
    }, []);

    const openCreateChannelModal = useCallback(
        () => dispatch(setCreateChannelModal(true)),
        [dispatch]
    );
    const openCreateVoiceChannelModal = useCallback(
        () => dispatch(setCreateVoiceChannelModal(true)),
        [dispatch]
    );
    const setParticipantRef = useCallback((id, el) => {
        if (el) {
            // maintain ref mapping
            // memberRefs are external in original file; we store on document for compatibility
            // but Channel uses a local ref map via closure
            // to keep parity we attach to window (non-ideal) — instead keep as noop if not used
        }
    }, []);
    const createChannelModal = useSelector((state) => state.modal.createChannelModal);
    const createVoiceChannelModal = useSelector((state) => state.modal.createVoiceChannelModal);
    const inviteModal = useSelector((state) => state.modal.inviteModal);
    // `user` from auth slice not used here
    const selectedServer = useSelector((state) => state.userSelectStore.selectedServer);
    const selectedChannel = useSelector((state) => state.userSelectStore.selectedChannel);
    const currVoiceChannel = useSelector((state) => state.channel.currVoiceChannel);
    const currChannelList = useSelector((state) => state.channel.currChannelList);
    const currVoiceChannelList = useSelector((state) => state.channel.currVoiceChannelList);
    const currServer = useSelector((state) => state.server.currServer);
    const serverSettingsPopover = useSelector((state) => state.popover.serverSettingsPopover);

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

    // Auto-select the first text channel for the server if none selected
    useEffect(() => {
        if (
            selectedServer &&
            (!selectedChannel || selectedChannel === "") &&
            Array.isArray(currChannelList) &&
            currChannelList.length > 0
        ) {
            const first = currChannelList[0];
            if (first && first.id) {
                // use existing handler which updates redux + localStorage
                handleSelectChannel(first.name, first.id);
            }
        }
    }, [selectedServer, selectedChannel, currChannelList]);

    return (
        <aside className="channel-container">
            <header className="channel-header" ref={channelHeaderRef}>
                <button
                    type="button"
                    aria-label="open servers"
                    className="mobile-servers-toggle"
                    onClick={(e) => {
                        e.stopPropagation();
                        document.body.classList.toggle("mobile-sidebar-open");
                        document.body.classList.add("mobile-app");
                    }}
                >
                    <MenuIcon />
                </button>

                <DropdownMenu.Root
                    open={serverSettingsPopover}
                    onOpenChange={() => dispatch(toggleServerSettings())}
                >
                    <DropdownMenu.Trigger asChild>
                        <button type="button" className="channel-header-name-button">
                            <span className="channel-header-name">{currServer.name}</span>
                            <span className="channel-header-dropdown">
                                {serverSettingsPopover ? <CloseIcon /> : <ExpandMoreIcon />}
                            </span>
                        </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            sideOffset={8}
                            align="start"
                            className="server-settings-paper"
                        >
                            <ServerSettings onClose={() => dispatch(toggleServerSettings())} />
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </header>
            <section className="channel-list-container">
                <header className="channel-list-header focusable">
                    <span>Text Channels</span>
                    <div className="channel-header-actions">
                        <Tooltip
                            title={
                                <Fragment>
                                    <span className="tooltip-text">Create Channel</span>
                                </Fragment>
                            }
                            placement="top"
                        >
                            <AddIcon onClick={openCreateChannelModal} />
                        </Tooltip>
                    </div>
                </header>
                <ul className="channel-list-text">
                    {currChannelList.map(({ name, id }) => (
                        <ChannelListItem
                            key={id}
                            id={id}
                            name={name}
                            isActive={id === selectedChannel}
                            onSelect={onSelectChannel}
                            onSettings={() => {}}
                        />
                    ))}
                </ul>
                <header className="channel-list-header focusable">
                    <span>Voice Channels</span>
                    <div className="channel-header-actions">
                        <Tooltip
                            title={
                                <Fragment>
                                    <span className="tooltip-text">Create Voice Channel</span>
                                </Fragment>
                            }
                            placement="top"
                        >
                            <AddIcon onClick={openCreateVoiceChannelModal} />
                        </Tooltip>
                    </div>
                </header>
                <ul className="channel-list-text">
                    {currVoiceChannelList.map(({ name, id, participants }) => (
                        <Fragment key={id}>
                            <ChannelListItem
                                key={id}
                                id={id}
                                name={name}
                                isActive={id === currVoiceChannel.id}
                                onSelect={onJoinVoice}
                                onSettings={() => {}}
                                Icon={VolumeUpIcon}
                            />
                            <ul className="participant-list">
                                {participants.map(
                                    ({ displayName, avatar, id: memberId, status }) => (
                                        <ParticipantItem
                                            key={memberId}
                                            displayName={displayName}
                                            avatar={avatar}
                                            id={memberId}
                                            status={status}
                                            onOpen={() => {}}
                                            setRef={setParticipantRef}
                                        />
                                    )
                                )}
                            </ul>
                        </Fragment>
                    ))}
                </ul>
            </section>
            {/* VoiceControl merged into UserFooter */}
            <UserFooter className="channel-user-footer" />
            <InviteServerDialog open={inviteModal} />
            <CreateTextChannelDialog open={createChannelModal} />
            <CreateVoiceChannelDialog open={createVoiceChannelModal} />
            {/* <Outlet /> */}
        </aside>
    );
};

export default Channel;
