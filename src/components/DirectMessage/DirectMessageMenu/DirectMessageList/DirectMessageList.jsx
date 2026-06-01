import React from "react";
import { useSelector } from "react-redux";
import AvatarWithStatus from "@/components/AvatarWithStatus/AvatarWithStatus";
import { handleCurrDirectMessageChannel } from "@/handlers/channelHandlers";
import "./DirectMessageList.scss";

export const DirectMessageList = ({ id, status, displayName, avatar, createdAt }) => {
    const { currDirectMessageChannel, isFriendListPageOpen } = useSelector(
        (state) => state.directMessage
    );
    return (
        <li
            key={id}
            id={id}
            className={`channel-list-item ${!isFriendListPageOpen && currDirectMessageChannel.id == id ? "active" : ""}`}
        >
            <button
                type="button"
                onClick={() =>
                    handleCurrDirectMessageChannel(id, status, displayName, avatar, createdAt)
                }
                className={`sidebar-item ${!isFriendListPageOpen && currDirectMessageChannel.id == id ? "active" : ""}`}
            >
                <AvatarWithStatus
                    containerClassName="friend-list-avatar"
                    avatarClassName="friend-avatar"
                    alt={displayName}
                    src={avatar}
                    status={status}
                />
                <span className="channel-name">{displayName}</span>
            </button>
        </li>
    );
};
