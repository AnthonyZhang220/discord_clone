import React, { useMemo, useState, useRef, useEffect } from 'react'
import { Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography, Avatar, Badge, ListSubheader, Popover, Divider } from '@mui/material'
import { styled } from '@mui/material/styles';
import StatusList from '../StatusList';
import { lighten } from '@mui/material/styles';
import ColorThief from "colorthief"

import { doc, getDoc, where, query, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

import { MemberListItemButton } from '../CustomUIComponents';

import "./MemberStatus.scss"





const MemberDetail = ({ openMemberDetail, setOpenMemberDetail, memberRef, memberDetail, bannerColor, profileRef }) => {

    return (
        <Popover
            className='member-detail-paper'
            open={openMemberDetail}
            onClose={() => setOpenMemberDetail(false)}
            anchorReference="anchorEl"
            anchorEl={memberRef}
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
                vertical: 0,
                horizontal: -350,
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >
            <Box className="member-detail-top">
                <svg className="member-detail-banner">
                    <mask id="uid_347">
                        <rect></rect>
                        <circle></circle>
                    </mask>
                    <foreignObject className="member-detail-object">
                        <Box sx={{ backgroundColor: bannerColor, width: "100%", height: "60px", transition: "background-color 0.1s" }}>
                        </Box>
                    </foreignObject>
                </svg>
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    className="member-detail-avatar"
                    badgeContent={
                        <StatusList status={memberDetail.status} />
                    }
                >
                    <Avatar alt={memberDetail.name} sx={{ width: "80px", height: "80px" }} src={memberDetail.profileURL} imgProps={{ ref: profileRef, crossOrigin: "" }} />
                </Badge>
            </Box>
            <Box className="member-detail-list" sx={{ backgroundColor: "#111214" }}>
                <ListItem dense>
                    <MemberListItemButton>
                        <ListItemText primary={memberDetail.name} primaryTypographyProps={{ variant: "h3" }} />
                    </MemberListItemButton>
                </ListItem>
                <Divider style={{ backgroundColor: "#8a8e94" }} variant="middle" light={true} />
                <ListItem dense>
                    <MemberListItemButton>
                        <ListItemText primary="MEMBER SINCE" primaryTypographyProps={{ variant: "h5" }} secondary={new Date(memberDetail.createdAt * 1000).toLocaleDateString('en-US', { month: "short", day: "2-digit", year: "numeric" })} secondaryTypographyProps={{
                            style: {
                                color: "white"
                            }
                        }} />
                    </MemberListItemButton>
                </ListItem>
            </Box>
        </Popover>
    )
}

function MemberStatus({ currentServer }) {

    const profileRef = useRef(null);
    const [bannerColor, setBannerColor] = useState("")

    useEffect(() => {
        if (profileRef.current) {
            const colorthief = new ColorThief();
            const banner = colorthief.getColor(profileRef.current)
            const rgbColor = `rgb(${banner.join(", ")})`
            setBannerColor(rgbColor)
            console.log(banner)
        }

    }, [profileRef.current, memberRef])


    const [memberList, setMemberList] = useState([]);
    const [memberId, setMemberId] = useState([]);
    const [memberDetail, setMemberDetail] = useState({})
    const memberRefs = useRef([])
    const [memberRef, setMemberRef] = useState(null);

    const [openMemberDetail, setOpenMemberDetail] = useState(false);

    const getMemberList = async () => {

        if (currentServer.uid) {
            const serverRef = doc(db, "servers", currentServer.uid)
            await getDoc(serverRef).then((doc) => {
                const memberIds = doc.data().members;
                setMemberId(memberIds);
            })
        }
    }

    useEffect(() => {
        getMemberList();
    }, [currentServer.uid])


    useEffect(() => {

        if (memberId.length > 0) {
            const q = query(collection(db, 'users'), where('userId', "in", memberId));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const memberList = [];
                snapshot.forEach((doc) => {
                    memberList.push({
                        displayName: doc.data().displayName,
                        profileURL: doc.data().profileURL,
                        status: doc.data().status,
                        userId: doc.data().userId,
                    });
                });
                setMemberList(memberList);
            });
        }
    }, [memberId])

    useEffect(() => {
        console.log(memberRefs)
    }, [memberRefs])



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
            <MemberDetail openMemberDetail={openMemberDetail} setOpenMemberDetail={setOpenMemberDetail} memberRef={memberRef} memberDetail={memberDetail} bannerColor={bannerColor} profileRef={profileRef} />
        </Box >
    )
}

export default MemberStatus