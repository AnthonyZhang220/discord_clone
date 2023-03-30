import React from 'react'
import { Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography, Avatar, Badge, ListSubheader } from '@mui/material'
import { styled } from '@mui/material/styles';

import { doc, getDoc, where, query, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

import "./UserStatus.scss"

function UserStatus({ currentServer }) {


    const [memberList, setMemberList] = React.useState([]);
    const [memberId, setMemberId] = React.useState([]);

    const getMemberList = async () => {

        if (currentServer) {
            const serverRef = doc(db, "servers", currentServer.uid)
            const serverDoc = await getDoc(serverRef)

            const memberIds = serverDoc.data().members;
            setMemberId(memberIds);
        }
    }

    React.useEffect(() => {
        getMemberList();
    }, [currentServer])

    React.useEffect(() => {
        console.log(memberList)
    }, [memberList])


    React.useEffect(() => {

        if (memberId.length > 0) {
            const q = query(collection(db, 'users'), where('userId', "in", memberId));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const memberList = [];
                snapshot.forEach((doc) => {
                    memberList.push({
                        displayName: doc.data().displayName,
                        profileURL: doc.data().profileURL,
                        status: doc.data().status,
                    });
                });
                setMemberList(memberList);
            });
        }
    }, [memberId])


    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            backgroundColor: '#44b700',
            color: '#44b700',
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        },
    }));


    return (
        <Box className="userstatus-container">
            <Box component="aside" className="userstatus-memberlist-wrapper">
                <Box className="userstatus-memberlist">
                    <Box component="header" className="userstatus-online focusable">
                        <List>
                            {
                                memberList?.map(({ displayName, profileURL, status }) => (
                                    status === "online" ?
                                        <List subheader={
                                            <ListSubheader component="div" sx={{ backgroundColor: "#2b2d31", color: "white" }}>
                                                Online { }
                                            </ListSubheader>
                                        }>
                                            <ListItem disablePadding>
                                                <ListItemButton>
                                                    <ListItemAvatar >
                                                        <StyledBadge
                                                            overlap="circular"
                                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                            variant="dot"
                                                        >
                                                            <Avatar alt={displayName} src={profileURL} />
                                                        </StyledBadge>
                                                    </ListItemAvatar>
                                                    <ListItemText primary={displayName} />
                                                </ListItemButton>
                                            </ListItem>
                                        </List>
                                        :
                                        status === "offline" ?
                                            <List subheader={
                                                <ListSubheader component="div" sx={{ backgroundColor: "#2b2d31", color: "white" }}>
                                                    Offline
                                                </ListSubheader>
                                            }>
                                                <ListItem disablePadding>
                                                    <ListItemButton>
                                                        <ListItemAvatar >
                                                            <StyledBadge
                                                                overlap="circular"
                                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                                variant="dot"
                                                            >
                                                                <Avatar alt={displayName} src={profileURL} />
                                                            </StyledBadge>
                                                        </ListItemAvatar>
                                                        <ListItemText primary={displayName} />
                                                    </ListItemButton>
                                                </ListItem>
                                            </List>
                                            : null
                                ))
                            }
                        </List>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default UserStatus