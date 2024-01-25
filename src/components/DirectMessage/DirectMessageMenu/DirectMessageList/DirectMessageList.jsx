import React from "react"
import { useSelector } from "react-redux";
import { lighten } from "@mui/material";
import { ListItem, ListItemButton, ListItemText, ListItemAvatar, Badge, Avatar } from "@mui/material";
import { handleCurrDirectMessageChannel } from "../../../../handlers/channelHandlers";
import StatusList from "../../../StatusList";
import "./DirectMessageList.scss"

export const DirectMessageList = ({ id, status, displayName, avatar, createdAt }) => {
    const { currDirectMessageChannel, isFriendListPageOpen } = useSelector(state => state.directMessage)
    return (
        <ListItem disablePadding sx={{ p: 0, m: 0 }} className="friend-conversation-item">
            <ListItemButton onClick={() => handleCurrDirectMessageChannel(id, status, displayName, avatar, createdAt)} sx={{
                backgroundColor: !isFriendListPageOpen && currDirectMessageChannel.id == id ? lighten("#313338", 0.1) : "inherit",
            }}>
                <ListItemAvatar sx={{ minWidth: "0", mr: 1 }}>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                            <StatusList status={status} size={12} />
                        }
                    >
                        <Avatar alt={displayName} src={avatar} sx={{ width: 32, height: 32 }} />
                    </Badge>
                </ListItemAvatar>
                <ListItemText primary={displayName} />
            </ListItemButton>
        </ListItem>
    )
}