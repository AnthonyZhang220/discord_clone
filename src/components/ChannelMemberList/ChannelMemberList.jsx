import React, { useMemo, useState, useRef, useEffect } from 'react'
import { Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography, Avatar, Badge, ListSubheader, Popover, Divider } from '@mui/material'


import { doc, getDoc, where, query, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { MemberListItemButton } from '../CustomUIComponents';
import { useDispatch, useSelector } from 'react-redux';
import { MemberDetailPopover } from './MemberDetailPopover/MemberDetailPopover';

import { setMemberList } from '../../redux/features/memberListSlice';

import "./ChannelMemberList.scss"


function ChannelMemberList() {
    const dispatch = useDispatch();
    const { selectedServer } = useSelector(state => state.userSelectStore)
    const { memberList } = useSelector(state => state.memberList)

    const memberRefs = useRef([])
    const [memberRef, setMemberRef] = useState(null);

    const [openMemberDetail, setOpenMemberDetail] = useState(false);

    const getMemberList = async () => {
        if (selectedServer) {
            const serverRef = doc(db, "servers", selectedServer)
            const serverDoc = await getDoc(serverRef)
            const memberIds = serverDoc.data().members;

            memberIds.forEach((memberId) => {
                const userRef = doc(db, "users", memberId)
                const userDoc = getDoc(userRef);
                dispatch(setMemberList([...memberList, userDoc]))
            })
        }
    }

    useEffect(() => {
        if (selectedServer) {
            getMemberList();
        }
    }, [selectedServer])


    const handleOpenMemberDetail = async (memberId) => {
        setMemberRef(memberRefs.current[memberId])


        const memberRef = doc(db, "users", memberId)
        const memberDoc = await getDoc(memberRef)

        setOpenMemberDetail(true);
        setMemberDetail({ name: memberDoc.data().displayName, status: memberDoc.data().status, profileURL: memberDoc.data().profileURL, createdAt: memberDoc.data().createdAt.seconds })

    }

    const online = (status) => {
        if (status === "online" || status === "idle" || status === "donotdisturb") {
            return true
        } else {
            return false
        }
    }


    return (
        <Box className="userstatus-container">
            <Box component="aside" className="userstatus-memberlist-wrapper">
                <Box className="userstatus-memberlist">
                    <Box component="header" className="userstatus-online focusable">
                        {
                            memberList.find(member => online(member.status) === true) ?
                                <List subheader={
                                    <ListSubheader component="div" sx={{ backgroundColor: "#2b2d31", color: "white" }}>
                                        Online - {memberList?.filter(member => online(member.status) === true).length}
                                    </ListSubheader>
                                }>
                                    {
                                        memberList?.filter(member => online(member.status) === true).map(({ displayName, profileURL, status, userId }, index) => (
                                            <ListItem key={userId} disablePadding sx={{ opacity: 1 }} ref={ele => memberRefs.current[userId] = ele}>
                                                <ListItemButton onClick={() => handleOpenMemberDetail(userId)}>
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
                                        ))}
                                </List>
                                : null
                        }
                        {
                            memberList.find(member => online(member.status) === false) ?
                                <List subheader={
                                    <ListSubheader component="div" sx={{ backgroundColor: "#2b2d31", color: "white" }}>
                                        Offline - {memberList?.filter(member => online(member.status) === false).length}
                                    </ListSubheader>
                                }>
                                    {
                                        memberList?.filter(member => online(member.status) === false).map(({ displayName, profileURL, status, userId }, index) => (
                                            <ListItem key={userId} disablePadding sx={{ opacity: 0.3 }} ref={ele => memberRefs.current[userId] = ele}>
                                                <ListItemButton onClick={() => handleOpenMemberDetail(userId)}>
                                                    <ListItemAvatar >
                                                        <Badge
                                                            overlap="circular"
                                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                            badgeContent={
                                                                <StatusList size={15} />
                                                            }
                                                        >
                                                            <Avatar alt={displayName} src={profileURL} />
                                                        </Badge>
                                                    </ListItemAvatar>
                                                    <ListItemText primary={displayName} />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                </List> : null
                        }
                    </Box>
                </Box>
            </Box>
            <MemberDetailPopover openMemberDetail={openMemberDetail} setOpenMemberDetail={setOpenMemberDetail} memberRef={memberRef} />
        </Box>
    )
}

export default ChannelMemberList