import React, { createRef, useEffect, useRef, useState } from "react";
import { Box, ListItemText, ListItem, Badge, ListItemButton, Popover, Avatar, Divider, ClickAwayListener, Tooltip } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import {
    StatusMenu, MenuListItemButton
} from "../../../CustomUIComponents";
import { useDispatch, useSelector } from "react-redux";
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from "../../../../utils/authentication";
import StatusList from "../../../StatusList";
import { statusFormat } from "../../../../utils/formatter";
import { changeStatus } from "../../../../utils/authentication";
import { setUserDetailPopover } from "../../../../redux/features/popoverSlice";

import "./UserDetailPopover.scss";

//user avatar click
export const UserDetailPopover = ({ userAvatarRef }) => {
    const dispatch = useDispatch();
    const { userDetailPopover } = useSelector((state) => state.popover)
    const { user } = useSelector((state) => state.auth)

    return (
        <Popover
            className='user-detail-paper'
            open={userDetailPopover}
            onClose={() => dispatch(setUserDetailPopover(false))}
            anchorReference="anchorEl"
            anchorEl={userAvatarRef.current}
            PaperProps={{
                style: {
                    background: "#232428", borderRadius: "8px 8px 8px 8px", width: "340px", fontSize: 14,
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    maxHeight: "calc(100vh - 28px)",
                }
            }}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 150,
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
        >
            <Box>
                <Box className="user-detail-top">
                    <svg className="user-detail-banner">
                        <mask id="uid_347">
                            <rect></rect>
                            <circle></circle>
                        </mask>
                        <foreignObject className="user-detail-object">
                            <Box sx={{ height: "100px", width: "100%", transition: "background-color 0.1s" }}>
                            </Box>
                        </foreignObject>
                    </svg>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        className="user-detail-avatar"
                        badgeContent={
                            <StatusList status={user.status} />
                        }
                    >
                        <Avatar alt={user.displayName} sx={{ width: "80px", height: "80px" }} src={user.profileURL} imgProps={{ crossOrigin: "Anonymous" }} />
                    </Badge>
                </Box>
                <Box className="user-detail-list" sx={{ backgroundColor: "#111214" }}>
                    <ListItem dense>
                        <MenuListItemButton>
                            <ListItemText primary={user.displayName} primaryTypographyProps={{ variant: "h3" }} />
                        </MenuListItemButton>
                    </ListItem>
                    <Divider style={{ backgroundColor: "#8a8e94" }} variant="middle" light={true} />
                    <ListItem dense>
                        <MenuListItemButton>
                            <ListItemText primary="MEMBER SINCE" primaryTypographyProps={{ variant: "h5" }} secondary={new Date(user.createdAt * 1000).toLocaleDateString('en-US', { month: "short", day: "2-digit", year: "numeric" })} secondaryTypographyProps={{
                                style: {
                                    color: "white"
                                }
                            }} />
                        </MenuListItemButton>
                    </ListItem>
                    <Divider style={{ backgroundColor: "#8a8e94" }} variant="middle" light={true} />
                    <ListItem dense>
                        <StatusMenu
                            disableFocusListener disableTouchListener
                            placement="right"
                            title={
                                <React.Fragment>
                                    <ListItem sx={{ pl: 1, pr: 1 }}>
                                        <MenuListItemButton onClick={() => changeStatus("online", user)} sx={{
                                            "&:hover": {
                                                backgroundColor: "#5865f2",
                                                borderRadius: "4px",
                                            }
                                        }}>
                                            <CircleIcon edge="start" sx={{ mr: 2, color: "#23a55a" }} />
                                            <ListItemText primary="Online" />
                                        </MenuListItemButton>
                                    </ListItem>
                                    <Divider sx={{ backgroundColor: "white", mt: 0.5, mb: 0.5 }} variant="middle" />
                                    <ListItem sx={{ pl: 1, pr: 1 }}>
                                        <MenuListItemButton onClick={() => changeStatus("idle", user)} sx={{
                                            "&:hover": {
                                                backgroundColor: "#5865f2",
                                                borderRadius: "4px",
                                            }
                                        }}>
                                            <DarkModeIcon edge="start" sx={{ mr: 2, color: "#f0b132" }} />
                                            <ListItemText primary="Idle" />
                                        </MenuListItemButton>
                                    </ListItem>
                                    <ListItem sx={{ pl: 1, pr: 1 }}>
                                        <MenuListItemButton onClick={() => changeStatus("donotdisturb", user)} sx={{
                                            "&:hover": {
                                                backgroundColor: "#5865f2",
                                                borderRadius: "4px",
                                            }
                                        }}>
                                            <RemoveCircleIcon edge="start" sx={{ mr: 2, color: "#f23f43" }} />
                                            <ListItemText primary="Do Not Disturb" secondary="You will not receive any desktop notifications." secondaryTypographyProps={{
                                                style: {
                                                    color: "white"
                                                }
                                            }} />
                                        </MenuListItemButton>
                                    </ListItem>
                                    <ListItem sx={{ pl: 1, pr: 1 }}>
                                        <MenuListItemButton onClick={() => changeStatus("invisible", user)} sx={{
                                            "&:hover": {
                                                backgroundColor: "#5865f2",
                                                borderRadius: "4px",
                                            }
                                        }}>
                                            <StopCircleIcon edge="start" sx={{ color: "#80848e", mr: 2 }} />
                                            <ListItemText primary="Invisible" secondary="You will not appear online, but will have full access." secondaryTypographyProps={{
                                                style: {
                                                    color: "white"
                                                }
                                            }} />
                                        </MenuListItemButton>
                                    </ListItem>
                                </React.Fragment>
                            }>
                            <MenuListItemButton sx={{
                                "&:hover": {
                                    backgroundColor: "#5865f2",
                                    borderRadius: "4px",
                                }
                            }}>

                                <StatusList edge={"start"} status={user.status} size={15} />
                                <ListItemText primary={statusFormat(user.status)} sx={{ ml: 1 }} />
                                <NavigateNextIcon edge="end" sx={{ color: "white" }} />
                            </MenuListItemButton>
                        </StatusMenu>
                    </ListItem>
                    <ListItem dense >
                        <MenuListItemButton onClick={() => dispatch(setUserDetailPopover(false))} sx={{
                            "&:hover": {
                                backgroundColor: "#5865f2",
                                borderRadius: "4px",
                            }
                        }}>
                            <SwapVertIcon edge="start" sx={{ color: "white" }} />
                            <ListItemText primary="Switch Accounts" />
                            <NavigateNextIcon edge="end" sx={{ color: "white" }} />
                        </MenuListItemButton>
                    </ListItem>
                    <ListItem dense >
                        <MenuListItemButton onClick={signOut} sx={{
                            "&:hover": {
                                backgroundColor: "red",
                                borderRadius: "4px",
                            }
                        }}>
                            <ListItemText primary="Log Out" />
                            <LogoutIcon edge="end" sx={{ color: "white" }} />
                        </MenuListItemButton>
                    </ListItem>
                </Box>
            </Box>
        </Popover>
    )
}