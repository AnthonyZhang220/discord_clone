import React from 'react'
import { Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography, Avatar, Badge, ListSubheader } from '@mui/material'
import { styled } from '@mui/material/styles';
import StatusList from '../StatusList';
import { lighten } from '@mui/material/styles';

import { doc, getDoc, where, query, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

import "./MemberStatus.scss"

function MemberStatus({ currentServer }) {


    const [memberList, setMemberList] = React.useState([]);
    const [memberId, setMemberId] = React.useState([]);

    const getMemberList = async () => {

        if (currentServer.uid) {
            const serverRef = doc(db, "servers", currentServer.uid)
            await getDoc(serverRef).then((doc) => {
                const memberIds = doc.data().members;
                setMemberId(memberIds);
            })
        }
    }

    React.useEffect(() => {
        getMemberList();
    }, [currentServer.uid])


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
                        userId: doc.data().userId
                    });
                });
                setMemberList(memberList);
            });
        }
    }, [memberId])


    return (
        <Box className="userstatus-container">
            <Box component="aside" className="userstatus-memberlist-wrapper">
                <Box className="userstatus-memberlist">
                    <Box component="header" className="userstatus-online focusable">
                        <List>
                            {
                                memberList?.map(({ displayName, profileURL, status, userId }) => (
                                    status === "online" || status === "idle" || status === "donotdisturb" ?
                                        <List key={userId} subheader={
                                            <ListSubheader component="div" sx={{ backgroundColor: "#2b2d31", color: "white" }}>
                                                Online { }
                                            </ListSubheader>
                                        }>
                                            <ListItem disablePadding>
                                                <ListItemButton>
                                                    <ListItemAvatar >
                                                        <Badge
                                                            overlap="circular"
                                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                            badgeContent={
                                                                <StatusList status={status} size={15} />
                                                            }
                                                        >
                                                            <Avatar alt={displayName} src={profileURL} />
                                                        </Badge>
                                                    </ListItemAvatar>
                                                    <ListItemText primary={displayName} />
                                                </ListItemButton>
                                            </ListItem>
                                        </List>
                                        :
                                        status === "offline" || status === "invisible" ?
                                            <List key={userId} subheader={
                                                <ListSubheader component="div" sx={{ backgroundColor: "#2b2d31", color: "white" }}>
                                                    Offline
                                                </ListSubheader>
                                            }>
                                                <ListItem disablePadding sx={{ opacity: 0.3 }}>
                                                    <ListItemButton>
                                                        <ListItemAvatar >
                                                            <Badge
                                                                overlap="circular"
                                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                                badgeContent={
                                                                    <StatusList size={12} />
                                                                }
                                                            >
                                                                <Avatar alt={displayName} src={profileURL} />
                                                            </Badge>
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

export default MemberStatus