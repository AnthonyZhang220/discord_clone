import React from "react"
import { Box, SvgIcon, Button, Divider, Typography } from '@mui/material';

import FriendIcon from "../DirectMessageBody/FriendBody/friend.svg"
import GroupDMIcon from "../DirectMessageBody/FriendBody/groupdm.svg"
import InboxIcon from '@mui/icons-material/Inbox';
import NumbersIcon from '@mui/icons-material/Numbers';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

import { Stack } from '@mui/material';

import StatusList from '../../StatusList';
import { FunctionTooltip } from '../../CustomUIComponents';
import { AlternateEmailSharp } from '@mui/icons-material';
import { useDispatch, useSelector } from "react-redux";
import { setFriendFilter } from "../../../redux/features/directMessageSlice";
import { toggleDirectMessageSidebar } from "../../../redux/features/directMessageSlice";
import "./DirectMessageHeader.scss"

export default function DirectMessageHeader() {
    const { isFriendListPageOpen } = useSelector(state => state.directMessage)
    return (
        <>
            {isFriendListPageOpen ?
                <FriendHeader /> : <PrivateChannelHeader />
            }
        </>
    )
}


export const FriendHeader = () => {
    const dispatch = useDispatch();
    const { friendFilter } = useSelector(state => state.directMessage)

    return (
        <Box className="friend-main-header" component="section">
            <Box className="friend-main-header-name">
                <SvgIcon component={FriendIcon} inheritViewBox sx={{ color: "#8a8e94", marginRight: "6px", alignItems: "baseline" }} />
                <Typography variant="h3" className="friend-main-header-text">Friends</Typography>
                <Divider orientation='vertical' variant='fullWidth' sx={{ backgroundColor: "#3e4046", m: "0 8px", width: "1px", flex: "0 0 auto", height: "24px" }} />
                <Box>
                    <Stack direction="row" spacing={1}>
                        <Button className={`friend-main-header-button ${friendFilter === "online" ? "active" : ""}`} onClick={() => dispatch(setFriendFilter("online"))} disableRipple>
                            Online
                        </Button>
                        <Button className={`friend-main-header-button ${friendFilter === "all" ? "active" : ""}`} onClick={() => dispatch(setFriendFilter("all"))} disableRipple>
                            All
                        </Button>
                        <Button className={`friend-main-header-button ${friendFilter === "pending" ? "active" : ""}`} onClick={() => dispatch(setFriendFilter("pending"))} disableRipple>
                            Pending
                        </Button>
                        <Button className={`friend-main-header-button ${friendFilter === "blocked" ? "active" : ""}`} onClick={() => dispatch(setFriendFilter("blocked"))} disableRipple>
                            Blocked
                        </Button>
                        <Button className={`addfriend-button ${friendFilter === "addfriend" ? "active" : ""}`} variant='contained' onClick={() => dispatch(setFriendFilter("addfriend"))} disableRipple>
                            Add Friend
                        </Button>
                    </Stack>
                </Box>
            </Box>
            <Box className="friend-main-header-feature">
                <Box className="friend-main-header-feature-icon">
                    <FunctionTooltip title={
                        <React.Fragment>
                            <Typography variant="body1" sx={{ m: 0.5 }} >New Group DM</Typography>
                        </React.Fragment>} placement="bottom">
                        <Box>
                            <SvgIcon inheritViewBox component={GroupDMIcon} />
                        </Box>
                    </FunctionTooltip>
                </Box>
                <Box className="friend-main-header-feature-icon">
                    <FunctionTooltip title={
                        <React.Fragment>
                            <Typography variant="body1" sx={{ m: 0.5 }} >Inbox</Typography>
                        </React.Fragment>} placement="bottom">
                        <Box>
                            <InboxIcon />
                        </Box>
                    </FunctionTooltip>
                </Box>
            </Box>
        </Box>
    )
}

export const PrivateChannelHeader = () => {
    const dispatch = useDispatch();
    const { currDirectMessageChannel } = useSelector(state => state.directMessage)

    return (
        <Box className="friend-main-header" component="section">
            <Box className="friend-main-header-name">
                <AlternateEmailSharp sx={{ color: "#8a8e94", marginRight: "6px", alignItems: "baseline" }} />
                <Box component="span" variant="h3" className="friend-main-header-hashtag">
                    {currDirectMessageChannel.displayName}
                </Box>
                <Box>
                    <StatusList status={currDirectMessageChannel.status} size={15} />
                </Box>
            </Box>
            <Box className="friend-main-header-feature">
                <FunctionTooltip title={
                    <React.Fragment>
                        <Typography variant="body1" sx={{ m: 0.5 }} >More</Typography>
                    </React.Fragment>} placement="bottom">
                    <PeopleAltIcon color="white" onClick={() => dispatch(toggleDirectMessageSidebar())} />
                </FunctionTooltip>
            </Box>
        </Box>
    )
}