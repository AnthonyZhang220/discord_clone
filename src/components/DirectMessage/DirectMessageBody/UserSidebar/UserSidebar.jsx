import React, { useEffect } from "react"
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { Badge, Divider } from '@mui/material';
import { MenuListItemButton } from '../../../CustomUIComponents';
import StatusList from '../../../StatusList';

import "./UserSidebar.scss";

const UserSidebar = ({ currDirectMessageChannel }) => {

    return (
        <Box className="userSidebar-container">
            <Box component="aside" className="userSidebar-memberlist-wrapper" sx={{ width: "100%", transition: "background-color 0.1s" }}>
                <Box className="userSidebar-memberlist" >
                    <Box>
                        <Box className="userSidebar-detail-top">
                            <svg className="userSidebar-detail-banner">
                                <mask id="uid_347">
                                    <rect></rect>
                                    <circle></circle>
                                </mask>
                                <foreignObject className="userSidebar-detail-object">
                                </foreignObject>
                            </svg>
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                className="userSidebar-detail-avatar"
                                badgeContent={
                                    <StatusList status={currDirectMessageChannel.status} />
                                }
                            >
                                <Avatar alt={currDirectMessageChannel.displayName} sx={{ width: "80px", height: "80px" }} src={currDirectMessageChannel.avatar} imgProps={{ crossOrigin: "Anonymous" }} />
                            </Badge>
                        </Box>
                        <Box className="userSidebar-detail-list">
                            <ListItem dense>
                                <MenuListItemButton>
                                    <ListItemText primary={currDirectMessageChannel.displayName} primaryTypographyProps={{ variant: "h3" }} />
                                </MenuListItemButton>
                            </ListItem>
                            <Divider style={{ backgroundColor: "#8a8e94" }} variant="middle" light={true} />
                            <ListItem dense>
                                <MenuListItemButton>
                                    <ListItemText primary="MEMBER SINCE" primaryTypographyProps={{ variant: "h5" }} secondary={new Date(currDirectMessageChannel.createdAt * 1000).toLocaleDateString('en-US', { month: "short", day: "2-digit", year: "numeric" })} secondaryTypographyProps={{
                                        style: {
                                            color: "white"
                                        }
                                    }} />
                                </MenuListItemButton>
                            </ListItem>
                            <Divider style={{ backgroundColor: "#8a8e94" }} variant="middle" light={true} />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default UserSidebar;