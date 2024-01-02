import React, { Fragment, useMemo, useEffect } from 'react'
import { Box, FormControl, InputBase, FormHelperText, List, ListItemButton, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton, Typography, Divider, Badge } from '@mui/material'
import FriendTab from '../FriendTab/FriendTab'

import "./FriendList.scss"

export default function FriendList({ category, friendList, handleCurrentPrivateChannel }) {
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
                                    <FriendTab displayName={displayName} profileURL={profileURL} status={status} key={userId} />
                                ))
                            }
                        </Fragment>
                }
            </List>
        </Box>
    )
}
