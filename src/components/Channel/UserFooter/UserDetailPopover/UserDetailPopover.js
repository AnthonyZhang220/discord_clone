import React from "react";
import { ListItemText, ListItem, Badge, Avatar, Divider } from "@mui/material";
import { Popover } from "@/components/compat/RadixCompat";
import CircleIcon from "@mui/icons-material/Circle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { StatusMenu, MenuListItemButton } from "@/components/CustomUIComponents";
import { useDispatch, useSelector } from "react-redux";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut } from "@/utils/authentication";
import StatusList from "@/components/StatusList";
import { statusFormat } from "@/utils/formatter";
import { changeStatus } from "@/utils/authentication";
import { setUserDetailPopover } from "@/redux/features/popoverSlice";

// UserDetailPopover styles merged into theme / global styles

//user avatar click
export const UserDetailPopover = ({ userAvatarRef }) => {
    const dispatch = useDispatch();
    const { userDetailPopover } = useSelector((state) => state.popover);
    const { user } = useSelector((state) => state.auth);

    // no side-effects required here
    return (
        <Popover
            className="user-detail-paper"
            open={userDetailPopover}
            onClose={() => dispatch(setUserDetailPopover(false))}
            anchorReference="anchorEl"
            anchorEl={userAvatarRef.current}
            PaperProps={{ className: "user-detail-popover-paper" }}
            anchorOrigin={{
                vertical: "top",
                horizontal: 150,
            }}
            transformOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
        >
            <div>
                <div className="user-detail-top">
                    <svg className="user-detail-banner">
                        <mask id="uid_347">
                            <rect></rect>
                            <circle></circle>
                        </mask>
                        <foreignObject
                            className="user-detail-object"
                            style={{ background: user?.bannerColor?.toString() }}
                        >
                            <div className="user-detail-banner-box"></div>
                        </foreignObject>
                    </svg>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        className="user-detail-avatar"
                        badgeContent={<StatusList status={user?.status} />}
                    >
                        <Avatar
                            alt={user?.displayName}
                            className="user-detail-avatar-img"
                            src={user?.avatar}
                            imgProps={{ crossOrigin: "Anonymous" }}
                        />
                    </Badge>
                </div>
                <div className="user-detail-list user-detail-list-bg">
                    <ListItem dense>
                        <MenuListItemButton>
                            <ListItemText
                                primary={user?.displayName}
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
                                    user?.createdAt?.seconds * 1000
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
                    <Divider className="user-detail-divider" variant="middle" light={true} />
                    <ListItem dense>
                        <StatusMenu
                            disableFocusListener
                            disableTouchListener
                            placement="right"
                            title={
                                <React.Fragment>
                                    <ListItem className="user-detail-listitem">
                                        <MenuListItemButton
                                            onClick={() => changeStatus("online")}
                                            className="menu-listitem-button"
                                        >
                                            <CircleIcon
                                                edge="start"
                                                className="status-menu-icon status-online"
                                            />
                                            <ListItemText primary="Online" />
                                        </MenuListItemButton>
                                    </ListItem>
                                    <Divider
                                        className="user-detail-divider user-detail-divider--thin"
                                        variant="middle"
                                    />
                                    <ListItem className="user-detail-listitem">
                                        <MenuListItemButton
                                            onClick={() => changeStatus("idle")}
                                            className="menu-listitem-button"
                                        >
                                            <DarkModeIcon
                                                edge="start"
                                                className="status-menu-icon status-idle"
                                            />
                                            <ListItemText primary="Idle" />
                                        </MenuListItemButton>
                                    </ListItem>
                                    <ListItem className="user-detail-listitem">
                                        <MenuListItemButton
                                            onClick={() => changeStatus("donotdisturb")}
                                            className="menu-listitem-button"
                                        >
                                            <RemoveCircleIcon
                                                edge="start"
                                                className="status-menu-icon status-dnd"
                                            />
                                            <ListItemText
                                                primary="Do Not Disturb"
                                                secondary="You will not receive any desktop notifications."
                                                secondaryTypographyProps={{
                                                    className: "user-detail-secondary",
                                                }}
                                            />
                                        </MenuListItemButton>
                                    </ListItem>
                                    <ListItem className="user-detail-listitem">
                                        <MenuListItemButton
                                            onClick={() => changeStatus("invisible")}
                                            className="menu-listitem-button"
                                        >
                                            <StopCircleIcon
                                                edge="start"
                                                className="status-menu-icon status-muted"
                                            />
                                            <ListItemText
                                                primary="Invisible"
                                                secondary="You will not appear online, but will have full access."
                                                secondaryTypographyProps={{
                                                    className: "user-detail-secondary",
                                                }}
                                            />
                                        </MenuListItemButton>
                                    </ListItem>
                                </React.Fragment>
                            }
                        >
                            <MenuListItemButton className="menu-listitem-button">
                                <StatusList edge={"start"} status={user?.status} size={15} />
                                <ListItemText
                                    primary={statusFormat(user?.status)}
                                    className="user-detail-status-text"
                                />
                                <NavigateNextIcon edge="end" className="user-detail-next-icon" />
                            </MenuListItemButton>
                        </StatusMenu>
                    </ListItem>
                    <ListItem dense>
                        <MenuListItemButton
                            onClick={() => dispatch(setUserDetailPopover(false))}
                            className="menu-listitem-button"
                        >
                            <SwapVertIcon edge="start" className="user-detail-icon" />
                            <ListItemText primary="Switch Accounts" />
                            <NavigateNextIcon edge="end" className="user-detail-next-icon" />
                        </MenuListItemButton>
                    </ListItem>
                    <ListItem dense>
                        <MenuListItemButton
                            onClick={signOut}
                            className="menu-listitem-button menu-listitem-button-danger"
                        >
                            <ListItemText primary="Log Out" />
                            <LogoutIcon edge="end" className="user-detail-icon" />
                        </MenuListItemButton>
                    </ListItem>
                </div>
            </div>
        </Popover>
    );
};
