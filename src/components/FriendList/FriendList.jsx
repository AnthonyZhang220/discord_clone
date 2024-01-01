import React, { Fragment, useMemo, useEffect } from 'react'
import { Box, FormControl, InputBase, FormHelperText, List, ListItemButton, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton, Typography, Divider, Badge } from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { FunctionTooltip, FriendMessageIconButton } from '../CustomUIComponents';
import StatusList from '../StatusList';


import "./FriendList.scss"
import { TypeSpecimenOutlined } from '@mui/icons-material';

export default function FriendList({ category, friendList, handleCurrentPrivateChannel }) {

    const FriendItem = useMemo(() => ({ displayName, profileURL, status, userId }) => {
        return (
            <>
                <Divider variant="fullWidth" flexItem sx={{ backgroundColor: "#3d3f44" }} />
                <ListItem className="friend-list-item" sx={{ p: 0, m: 0 }} key={userId}>
                    <ListItemButton className="friend-list-item-button" onClick={() => handleCurrentPrivateChannel(userId)}>
                        <ListItemAvatar>
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                    <StatusList status={status} size={12} />
                                }
                            >
                                <Avatar alt={displayName} src={profileURL} />
                            </Badge>
                        </ListItemAvatar>
                        <ListItemText primary={displayName}
                            primaryTypographyProps={{ variant: "body1" }} secondary={status} secondaryTypographyProps={{ variant: "body2", color: "white", textTransform: "capitalize" }} />
                        <Box sx={{ m: 1 }}>
                            <FunctionTooltip title={
                                <React.Fragment>
                                    <Typography variant="body1" sx={{ m: 0.5 }} >Message</Typography>
                                </React.Fragment>} placement="top">
                                <FriendMessageIconButton edge="end" onClick={() => handleCurrentPrivateChannel(userId)}>
                                    <ChatIcon />
                                </FriendMessageIconButton>
                            </FunctionTooltip>
                        </Box>
                        <Box sx={{ m: 1 }}>
                            <FunctionTooltip title={
                                <React.Fragment>
                                    <Typography variant="body1" sx={{ m: 0.5 }} >More</Typography>
                                </React.Fragment>} placement="top">
                                <FriendMessageIconButton edge="end">
                                    <MoreVertIcon />
                                </FriendMessageIconButton>
                            </FunctionTooltip>
                        </Box>
                    </ListItemButton>
                </ListItem>
            </>
        )
    }, [friendList.length, category])


    return (
        <Box className="friend-list-container">
            <List dense>
                {
                    category == "all" ?
                        <Fragment>
                            <Box sx={{ p: 1 }}>
                                <Typography variant="h6">
                                    All - {friendList.length}
                                </Typography>
                            </Box>
                            {
                                friendList.map(({ displayName, status, profileURL, userId }) => (
                                    <FriendItem displayName={displayName} profileURL={profileURL} status={status} key={userId} />
                                ))
                            }
                        </Fragment>
                        :
                        <Fragment>
                            <Box sx={{ p: 1 }}>
                                <Typography variant="h6">
                                    Online - {friendList.filter(property => property.status !== "offline").length}
                                </Typography>
                            </Box>
                            {
                                friendList.filter(property => property.status !== "offline").map(({ displayName, status, profileURL, userId }) => (
                                    <FriendItem displayName={displayName} profileURL={profileURL} status={status} key={userId} />
                                ))
                            }
                        </Fragment>
                }
            </List>
        </Box>
    )
}
