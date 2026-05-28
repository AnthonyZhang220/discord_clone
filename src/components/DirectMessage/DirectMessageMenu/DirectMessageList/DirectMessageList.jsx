import React from "react";
import { useSelector } from "react-redux";
import {
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Badge,
    Avatar,
} from "@mui/material";
import { handleCurrDirectMessageChannel } from "@/handlers/channelHandlers";
import StatusList from "@/components/StatusList";
import "./DirectMessageList.scss";

export const DirectMessageList = ({ id, status, displayName, avatar, createdAt }) => {
    const { currDirectMessageChannel, isFriendListPageOpen } = useSelector(
        (state) => state.directMessage
    );
    return (
        <ListItem disablePadding className="friend-conversation-item">
            <ListItemButton
                onClick={() =>
                    handleCurrDirectMessageChannel(id, status, displayName, avatar, createdAt)
                }
                className={`friend-list-button ${!isFriendListPageOpen && currDirectMessageChannel.id == id ? "friend-list-button--active" : ""}`}
            >
                <ListItemAvatar className="friend-list-avatar">
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        badgeContent={<StatusList status={status} size={12} />}
                    >
                        <Avatar alt={displayName} src={avatar} className="friend-avatar" />
                    </Badge>
                </ListItemAvatar>
                <ListItemText primary={displayName} />
            </ListItemButton>
        </ListItem>
    );
};
