import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { Badge, Divider } from "@mui/material";
import { MenuListItemButton } from "@/components/CustomUIComponents";
import StatusList from "@/components/StatusList";

import "./UserSidebar.scss";

export const UserSidebar = ({ currDirectMessageChannel }) => {
    return (
        <div className="userSidebar-container">
            <aside className="userSidebar-memberlist-wrapper userSidebar-aside">
                <div className="userSidebar-memberlist">
                    <div>
                        <div className="userSidebar-detail-top">
                            <svg className="userSidebar-detail-banner">
                                <mask id="uid_347">
                                    <rect></rect>
                                    <circle></circle>
                                </mask>
                                <foreignObject className="userSidebar-detail-object"></foreignObject>
                            </svg>
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                className="userSidebar-detail-avatar"
                                badgeContent={
                                    <StatusList status={currDirectMessageChannel.status} />
                                }
                            >
                                <Avatar
                                    alt={currDirectMessageChannel.displayName}
                                    className="userSidebar-avatar"
                                    src={currDirectMessageChannel.avatar}
                                    imgProps={{ crossOrigin: "Anonymous" }}
                                />
                            </Badge>
                        </div>
                        <div className="userSidebar-detail-list">
                            <ListItem dense>
                                <MenuListItemButton>
                                    <ListItemText
                                        primary={currDirectMessageChannel.displayName}
                                        primaryTypographyProps={{ variant: "h3" }}
                                    />
                                </MenuListItemButton>
                            </ListItem>
                            <Divider
                                style={{ backgroundColor: "var(--server-marker-unread)" }}
                                variant="middle"
                                light={true}
                            />
                            <ListItem dense>
                                <MenuListItemButton>
                                    <ListItemText
                                        primary="MEMBER SINCE"
                                        primaryTypographyProps={{ variant: "h5" }}
                                        secondary={new Date(
                                            currDirectMessageChannel.createdAt?.seconds * 1000
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "2-digit",
                                            year: "numeric",
                                        })}
                                        secondaryTypographyProps={{
                                            style: {
                                                color: "white",
                                            },
                                        }}
                                    />
                                </MenuListItemButton>
                            </ListItem>
                            <Divider
                                style={{ backgroundColor: "var(--server-marker-unread)" }}
                                variant="middle"
                                light={true}
                            />
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
};
