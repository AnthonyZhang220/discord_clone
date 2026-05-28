import React from "react";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { FunctionTooltip, FriendMessageIconButton } from "@/components/CustomUIComponents";
import {
    Divider,
    ListItem,
    ListItemButton,
    ListItemAvatar,
    Badge,
    Avatar,
    ListItemText,
    Typography,
} from "@mui/material";
import { handleCurrDirectMessageChannel } from "@/handlers/channelHandlers";
import StatusList from "@/components/StatusList";

export default function FriendTab({ displayName, avatar, status, id, createdAt }) {
    return (
        <>
            <Divider variant="fullWidth" flexItem className="friend-divider" />
            <ListItem className="friend-list-item" key={id}>
                <ListItemButton
                    className="friend-list-item-button"
                    onClick={() =>
                        handleCurrDirectMessageChannel(id, status, displayName, avatar, createdAt)
                    }
                >
                    <ListItemAvatar>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            badgeContent={<StatusList status={status} size={12} />}
                        >
                            <Avatar alt={displayName} src={avatar} />
                        </Badge>
                    </ListItemAvatar>
                    <ListItemText
                        primary={displayName}
                        primaryTypographyProps={{ variant: "body1" }}
                        secondary={status}
                        secondaryTypographyProps={{
                            variant: "body2",
                            color: "white",
                            textTransform: "capitalize",
                        }}
                    />
                    <div className="action-box">
                        <FunctionTooltip
                            title={
                                <React.Fragment>
                                    <Typography variant="body1" className="tooltip-text">
                                        Message
                                    </Typography>
                                </React.Fragment>
                            }
                            placement="top"
                        >
                            <FriendMessageIconButton
                                edge="end"
                                onClick={() =>
                                    handleCurrDirectMessageChannel(
                                        id,
                                        status,
                                        displayName,
                                        avatar,
                                        createdAt
                                    )
                                }
                            >
                                <ChatIcon />
                            </FriendMessageIconButton>
                        </FunctionTooltip>
                    </div>
                    <div className="action-box">
                        <FunctionTooltip
                            title={
                                <React.Fragment>
                                    <Typography variant="body1" className="tooltip-text">
                                        More
                                    </Typography>
                                </React.Fragment>
                            }
                            placement="top"
                        >
                            <FriendMessageIconButton edge="end">
                                <MoreVertIcon />
                            </FriendMessageIconButton>
                        </FunctionTooltip>
                    </div>
                </ListItemButton>
            </ListItem>
        </>
    );
}
