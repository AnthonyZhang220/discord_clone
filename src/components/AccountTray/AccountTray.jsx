import React, { useRef, useState, useCallback } from "react";

import { Tooltip } from "@/components/compat/RadixCompat";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import AvatarWithStatus from "@/components/AvatarWithStatus/AvatarWithStatus";
import HeadsetIcon from "@mui/icons-material/Headset";
import HeadsetOffIcon from "@mui/icons-material/HeadsetOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

import SettingsIcon from "@mui/icons-material/Settings";
import { UserMenu } from "./UserMenu/UserMenu";
import UserSettingsDialog from "./UserSettingsDialog";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetailPopover } from "@/redux/features/popoverSlice";
import { toggleDeafen, toggleMic } from "@/handlers/voiceControlHandlers";
import CallControls from "@/components/CallControls/CallControls";
import "./AccountTray.scss";

const ProfileButton = React.memo(
    React.forwardRef(function ProfileButton({ user, tag, refObj }, ref) {
        return (
            <DropdownMenu.Trigger asChild>
                <button ref={ref} type="button" className="user-footer-profile">
                    <AvatarWithStatus
                        ref={refObj}
                        containerClassName="user-footer-avatar"
                        avatarClassName="avatar"
                        alt={user?.displayName}
                        src={user?.avatar}
                        status={user?.status}
                    />
                    <div className="user-footer-details">
                        <div className="username user-footer-username">{user?.displayName}</div>
                        <span className="user-footer-tag">{tag}</span>
                    </div>
                </button>
            </DropdownMenu.Trigger>
        );
    })
);

const Controls = React.memo(function Controls({
    isMicOn,
    isDeafen,
    onToggleMic,
    onToggleDeafen,
    onOpenSettings,
}) {
    return (
        <div className="user-footer-controls button-group">
            {isMicOn ? (
                <Tooltip title="Mute" placement="top">
                    <button
                        type="button"
                        className="user-footer-button"
                        aria-label="Mute"
                        onClick={onToggleMic}
                    >
                        <MicIcon className="user-footer-icon" />
                    </button>
                </Tooltip>
            ) : (
                <Tooltip title="Unmute" placement="top">
                    <button
                        type="button"
                        className="user-footer-button"
                        aria-label="Mute"
                        onClick={onToggleMic}
                    >
                        <MicOffIcon className="user-footer-icon" />
                    </button>
                </Tooltip>
            )}
            {isDeafen ? (
                <Tooltip title="Undefen" placement="top">
                    <button
                        type="button"
                        className="user-footer-button"
                        aria-label="Defen"
                        onClick={onToggleDeafen}
                    >
                        <HeadsetOffIcon className="user-footer-icon" />
                    </button>
                </Tooltip>
            ) : (
                <Tooltip title="Defen" placement="top">
                    <button
                        type="button"
                        className="user-footer-button"
                        aria-label="Defen"
                        onClick={onToggleDeafen}
                    >
                        <HeadsetIcon className="user-footer-icon" />
                    </button>
                </Tooltip>
            )}
            <Tooltip title="Settings">
                <button
                    type="button"
                    className="user-footer-button"
                    aria-label="Settings"
                    onClick={onOpenSettings}
                >
                    <SettingsIcon className="user-footer-icon" />
                </button>
            </Tooltip>
        </div>
    );
});

const AccountTray = ({ className = "" }) => {
    const userAvatarRef = useRef(null);
    const dispatch = useDispatch();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { userDetailPopover } = useSelector((state) => state.popover);
    const { isMicOn, isDeafen, isVoiceChatConnected, isVoiceChatLoading } = useSelector(
        (state) => state.voiceChat
    );
    const { user } = useSelector((state) => state.auth);
    const userFooterTag = user?.id ? `#${user.id.slice(-4)}` : "#0000";

    const isVoiceActive = Boolean(isVoiceChatConnected || isVoiceChatLoading);

    // open/close handled by Radix DropdownMenu via redux state
    const toggleMicCb = useCallback(() => toggleMic(), []);
    const toggleDeafenCb = useCallback(() => toggleDeafen(), []);
    const openSettings = useCallback(() => setSettingsOpen(true), []);

    return (
        <>
            <div className={`user-footer-wrapper ${className}`}>
                {isVoiceActive && (
                    <div className="user-footer-voice">
                        <CallControls />
                    </div>
                )}

                <footer className={`user-footer-container`}>
                    <DropdownMenu.Root
                        open={userDetailPopover}
                        onOpenChange={(value) => dispatch(setUserDetailPopover(value))}
                    >
                        <ProfileButton user={user} tag={userFooterTag} refObj={userAvatarRef} />
                        <UserMenu />
                    </DropdownMenu.Root>
                    <Controls
                        isMicOn={isMicOn}
                        isDeafen={isDeafen}
                        onToggleMic={toggleMicCb}
                        onToggleDeafen={toggleDeafenCb}
                        onOpenSettings={openSettings}
                    />
                </footer>
            </div>
            <UserSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} user={user} />
        </>
    );
};

export default React.memo(AccountTray);
