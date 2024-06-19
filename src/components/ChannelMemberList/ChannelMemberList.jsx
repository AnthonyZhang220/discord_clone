import React, { useState, useRef, useEffect } from 'react'
import { Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography, Avatar, Badge, ListSubheader } from '@mui/material'

import { QuerySnapshot, doc, getDoc, onSnapshot, query, collection, where } from 'firebase/firestore';
import { db } from '../../firebase';
import StatusList from '../StatusList';
import { useDispatch, useSelector } from 'react-redux';
import { MemberDetailPopover } from './MemberDetailPopover/MemberDetailPopover';
import { setMemberList, setMemberDetail } from '../../redux/features/memberListSlice';

import "./ChannelMemberList.scss"
import { setMemberDetailPopover } from '../../redux/features/popoverSlice';

function ChannelMemberList() {
    const dispatch = useDispatch();
    const { selectedServer } = useSelector(state => state.userSelectStore)
    const { memberList } = useSelector(state => state.memberList)
    const memberRefs = useRef({});
    const [memberRef, setMemberRef] = useState(null);

    const getMemberList = async () => {
        if (selectedServer) {
            const serverRef = doc(db, "servers", selectedServer)
            const serverDoc = await getDoc(serverRef)
            const memberIds = serverDoc.data().members;
            
            const q = query(collection(db, "users"), where("id", "in", memberIds))
            const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                let fetchedMemberList = [];
                QuerySnapshot.forEach((doc) => {
                    fetchedMemberList.push(doc.data())
                })
                dispatch(setMemberList(fetchedMemberList))
            })

            setMemberRef(memberIds)
        }
    }

    useEffect(() => {
        if (selectedServer) {
            getMemberList();
        }
    }, [selectedServer])


    const handleOpenMemberDetail = (memberId) => {

        const currentMemberDetail = memberList.find(member => member.id === memberId)
        dispatch(setMemberDetail(currentMemberDetail))

        const clickedMemberRefs = memberRefs.current[memberId]

        setMemberRef(clickedMemberRefs)
        dispatch(setMemberDetailPopover(true))
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
                                        memberList?.filter(member => online(member.status) === true).map(({ displayName, avatar, status, id }) => (
                                            <ListItem key={id} disablePadding sx={{ opacity: 1 }} ref={ele => memberRefs.current[id] = ele}>
                                                <ListItemButton onClick={() => handleOpenMemberDetail(id)}>
                                                    <ListItemAvatar >
                                                        <Badge
                                                            overlap="circular"
                                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                            badgeContent={
                                                                <StatusList status={status} size={15} />
                                                            }
                                                        >
                                                            <Avatar alt={displayName} src={avatar} />
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
                                        memberList?.filter(member => online(member.status) === false).map(({ displayName, avatar, id }) => (
                                            <ListItem key={id} disablePadding sx={{ opacity: 0.3 }} ref={ele => memberRefs.current[id] = ele}>
                                                <ListItemButton onClick={() => handleOpenMemberDetail(id)}>
                                                    <ListItemAvatar >
                                                        <Badge
                                                            overlap="circular"
                                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                            badgeContent={
                                                                <StatusList size={15} />
                                                            }
                                                        >
                                                            <Avatar alt={displayName} src={avatar} />
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
            <MemberDetailPopover memberRef={memberRef} />
        </Box>
    )
}

export default ChannelMemberList