import React from 'react'
import { Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography, Avatar, Badge, ListSubheader, Popover, Divider } from '@mui/material'
import { styled } from '@mui/material/styles';
import StatusList from '../StatusList';
import { lighten } from '@mui/material/styles';

import { doc, getDoc, where, query, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

import "./MemberStatus.scss"


const StyledListItemButton = styled(ListItemButton)(() => ({
    padding: "2px 2px 2px 2px",
}));

function MemberStatus({ currentServer }) {


    const [memberList, setMemberList] = React.useState([]);
    const [memberId, setMemberId] = React.useState([]);
    const [memberDetail, setMemberDetail] = React.useState({})
    const memberRef = React.useRef(null);

    const [openMemberDetail, setOpenMemberDetail] = React.useState(false);

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



    const handleOpenMemberDetail = async (memberId) => {
        const memberDoc = doc(db, "users", memberId)
        await getDoc(memberDoc).then((doc) => {
            setMemberDetail({ name: doc.data().displayName, status: doc.data().status, profileURL: doc.data().profileURL, createdAt: doc.data().createdAt })

            setOpenMemberDetail(true);
        })
    }

    const MemberDetail = () => {
        return (
            <Popover
                className='member-detail-paper'
                open={openMemberDetail}
                onClose={() => setOpenMemberDetail(false)}
                anchorReference="anchorEl"
                anchorEl={memberRef.current}
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
                        <Avatar alt={memberDetail.name} sx={{ width: "75px", height: "75px" }} src={memberDetail.profileURL} />
                    </Badge>
                </Box>
                <Box className="member-detail-list" sx={{ backgroundColor: "#111214" }}>
                    <ListItem dense>
                        <StyledListItemButton>
                            <ListItemText primary={memberDetail.name} primaryTypographyProps={{ variant: "h3" }} />
                        </StyledListItemButton>
                    </ListItem>
                    <Divider style={{ backgroundColor: "#8a8e94" }} variant="middle" light={true} />
                    <ListItem dense>
                        <StyledListItemButton>
                            <ListItemText primary="MEMBER SINCE" primaryTypographyProps={{ variant: "h5" }} secondary={new Date(memberDetail.createdAt).toLocaleDateString('en-US', { month: "short", day: "2-digit", year: "numeric" })} secondaryTypographyProps={{
                                style: {
                                    color: "white"
                                }
                            }} />
                        </StyledListItemButton>
                    </ListItem>
                </Box>
            </Popover>
        )
    }


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
                                            <ListItem disablePadding ref={memberRef}>
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
            <MemberDetail />
        </Box>
    )
}

export default MemberStatus