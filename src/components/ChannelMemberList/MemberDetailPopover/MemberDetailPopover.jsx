import React from "react";
import { Box, ListItem, ListItemText, Avatar, Badge, Popover, Divider } from '@mui/material';
import { MemberListItemButton } from "../../CustomUIComponents";
import StatusList from '../../StatusList';
import { setMemberDetailPopover } from "../../../redux/features/popoverSlice";
import { useDispatch, useSelector } from "react-redux";

export const MemberDetailPopover = ({ memberRef }) => {
    const dispatch = useDispatch();
    const { memberDetailPopover } = useSelector(state => state.popover)
    const { memberDetail } = useSelector(state => state.memberList)

    return (
        <Popover
            className='member-detail-paper'
            open={memberDetailPopover}
            onClose={() => dispatch(setMemberDetailPopover(false))}
            anchorReference="anchorEl"
            anchorEl={memberRef ? () => memberRef : null}
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
                horizontal: 0,
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
            <Box className="member-detail-top">
                <svg className="member-detail-banner">
                    <mask id="uid_347">
                        <rect></rect>
                        <circle></circle>
                    </mask>
                    <foreignObject className="member-detail-object">
                        <Box sx={{ width: "100%", height: "60px", transition: "background-color 0.1s" }}>
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
                    <Avatar alt={memberDetail.name} sx={{ width: "80px", height: "80px" }} src={memberDetail.avatar} imgProps={{ crossOrigin: "" }} />
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