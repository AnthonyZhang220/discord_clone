import React, { useRef } from "react";

import { Badge, Avatar } from "@mui/material";
import { Tooltip } from "@/components/compat/RadixCompat";
import HeadsetIcon from "@mui/icons-material/Headset";
import HeadsetOffIcon from "@mui/icons-material/HeadsetOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import StatusList from "@/components/StatusList";
import { UserDetailPopover } from "./UserDetailPopover/UserDetailPopover";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetailPopover } from "@/redux/features/popoverSlice";
import { toggleDeafen, toggleMic } from "@/handlers/voiceControlHandlers";
import "./UserFooter.scss";

const UserFooter = () => {
    const userAvatarRef = useRef(null);
    const dispatch = useDispatch();
    const { isMicOn, isDeafen } = useSelector((state) => state.voiceChat);
    const { user } = useSelector((state) => state.auth);

    return (
        <footer className="user-footer-container" ref={userAvatarRef}>
            <div
                onClick={() => dispatch(setUserDetailPopover(true))}
                className="user-footer-profile"
            >
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={<StatusList status={user?.status} size={12} />}
                >
                    <Avatar
                        alt={user?.displayName}
                        src={user?.avatar}
                        className="avatar user-footer-avatar"
                    />
                </Badge>
                <div className="user-footer-details">
                    <div className="username user-footer-username">{user?.displayName}</div>
                    <span className="tag"></span>
                </div>
            </div>
            <UserDetailPopover userAvatarRef={userAvatarRef} />
            <div className="user-footer-controls button-group">
                {isMicOn ? (
                    <Tooltip title="Mute" placement="top">
                        <IconButton
                            className="user-footer-button"
                            aria-label="Mute"
                            color="success"
                            onClick={() => {
                                toggleMic();
                            }}
                        >
                            <MicIcon className="user-footer-icon" />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Unmute" placement="top">
                        <IconButton
                            className="user-footer-button"
                            aria-label="Mute"
                            color="error"
                            onClick={() => {
                                toggleMic();
                            }}
                        >
                            <MicOffIcon className="user-footer-icon" />
                        </IconButton>
                    </Tooltip>
                )}
                {isDeafen ? (
                    <Tooltip title="Undefen" placement="top">
                        <IconButton
                            className="user-footer-button"
                            aria-label="Defen"
                            color="error"
                            onClick={() => toggleDeafen()}
                        >
                            <HeadsetOffIcon className="user-footer-icon" />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Defen" placement="top">
                        <IconButton
                            className="user-footer-button"
                            aria-label="Defen"
                            color="success"
                            onClick={() => toggleDeafen()}
                        >
                            <HeadsetIcon className="user-footer-icon" />
                        </IconButton>
                    </Tooltip>
                )}
                <Tooltip title="Settings">
                    <IconButton className="user-footer-button" aria-label="Settings">
                        <SettingsIcon className="user-footer-icon" />
                    </IconButton>
                </Tooltip>
            </div>
        </footer>
    );
};

export default UserFooter;
