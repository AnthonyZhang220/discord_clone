import React from "react";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Tooltip } from "@/components/compat/RadixCompat";
import AvatarWithStatus from "@/components/AvatarWithStatus/AvatarWithStatus";
import { handleCurrDirectMessageChannel } from "@/handlers/channelHandlers";
import "./FriendTab.scss";

export default function FriendTab({
    displayName,
    avatar,
    status,
    id,
    createdAt,
    actionType = "friend",
    onAccept,
    onReject,
    onCancel,
    onBlock,
    onUnblock,
    onAdd,
    disableAdd,
}) {
    const canOpenChat = actionType === "friend";

    const handlePrimaryClick = () => {
        if (!canOpenChat) return;
        handleCurrDirectMessageChannel(id, status, displayName, avatar, createdAt);
    };

    return (
        <>
            <hr className="friend-divider" />
            <div className="friend-list-item" data-id={id}>
                <div className="friend-list-row">
                    <button type="button" className="sidebar-item" onClick={handlePrimaryClick}>
                        <AvatarWithStatus
                            containerClassName="friend-list-avatar-wrap"
                            avatarClassName="friend-avatar"
                            alt={displayName}
                            src={avatar}
                            status={status}
                        />
                        <div className="friend-list-text">
                            <div className="friend-list-primary">{displayName}</div>
                            <div className="friend-list-secondary">{status}</div>
                        </div>
                    </button>

                    {actionType === "friend" ? (
                        <div className="friend-actions">
                            <Tooltip
                                title={
                                    <React.Fragment>
                                        <span className="tooltip-text">Message</span>
                                    </React.Fragment>
                                }
                                placement="top"
                            >
                                <button
                                    type="button"
                                    className="friend-action"
                                    onClick={handlePrimaryClick}
                                >
                                    <ChatIcon />
                                </button>
                            </Tooltip>

                            <Tooltip
                                title={
                                    <React.Fragment>
                                        <span className="tooltip-text">Block</span>
                                    </React.Fragment>
                                }
                                placement="top"
                            >
                                <button
                                    type="button"
                                    className="friend-action"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onBlock?.();
                                    }}
                                >
                                    <MoreVertIcon />
                                </button>
                            </Tooltip>
                        </div>
                    ) : (
                        <div className="friend-actions friend-actions-visible">
                            {actionType === "incoming" ? (
                                <>
                                    <button
                                        type="button"
                                        className="friend-action-pill"
                                        onClick={onAccept}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        type="button"
                                        className="friend-action-pill"
                                        onClick={onReject}
                                    >
                                        Reject
                                    </button>
                                </>
                            ) : null}
                            {actionType === "outgoing" ? (
                                <button
                                    type="button"
                                    className="friend-action-pill"
                                    onClick={onCancel}
                                >
                                    Cancel
                                </button>
                            ) : null}
                            {actionType === "blocked" ? (
                                <button
                                    type="button"
                                    className="friend-action-pill"
                                    onClick={onUnblock}
                                >
                                    Unblock
                                </button>
                            ) : null}
                            {actionType === "search" ? (
                                <button
                                    type="button"
                                    className="friend-action-pill"
                                    onClick={onAdd}
                                    disabled={disableAdd}
                                >
                                    {disableAdd ? "Sent" : "Add"}
                                </button>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
