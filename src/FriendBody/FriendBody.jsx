import React from 'react'




import { Box, List, SvgIcon, Button, Divider, Typography, ListItemButton, ListItemText, ListItem, } from '@mui/material';

import FriendIcon from "./friend.svg"
import GroupDMIcon from "./groupdm.svg"
import InboxIcon from '@mui/icons-material/Inbox';

import FriendActive from '../FriendActive/FriendActive';
import FriendList from '../FriendList/FriendList';
import SearchIcon from '@mui/icons-material/Search';
import NumbersIcon from '@mui/icons-material/Numbers';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InputLabel from '@mui/material/InputLabel';
import { TextFieldProps } from '@mui/material/TextField';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { Stack } from '@mui/material';


import "./FriendBody.scss";
import { FunctionTooltip } from '../CustomUIComponents';
import PrivateChat from '../PrivateChat/PrivateChat';
import { AlternateEmailSharp } from '@mui/icons-material';
import AddFriend from '../AddFriend/AddFriend';
import StatusList from '../StatusList';


const FriendBody = ({ currentUser, friendList, currentMessage, currentPrivateChannel, handleCurrentPrivateChannel, privateMessages }) => {


    const [userSideBar, setUserSideBar] = React.useState(true)
    const handleShowUserDetail = () => {
        setUserSideBar(true)
    }
    const handleCloseUserDetail = () => {
        setUserSideBar(false)
    }
    const handleSearch = (e) => {
        const searchTerm = e.target.value;
    }

    React.useEffect(() => {
        console.log(currentUser)
    }, [currentUser])

    const [category, setCategory] = React.useState("online");
    const [noActive, setNoActive] = React.useState(true);

    const FriendContent = () => {
        return (
            <Box className="content">
                <Box className="friend-main-content" component="main">
                    <Box className="friend-search-form" >
                        <Box className="friend-search-inner" component="form">
                            <input className="friend-search-input" type="search" name='search' placeholder='Search' onChange={e => handleSearch(e)} autoComplete='off'
                            />
                            <SearchIcon />
                        </Box>
                    </Box>
                    <Box className="friendListWrapper">
                        <Box component="div" className="scroller">
                            <Box className="scroll-content">
                                <FriendList handleCurrentPrivateChannel={handleCurrentPrivateChannel} friendList={friendList} category={category} currentPrivateChannel={currentPrivateChannel} />
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <FriendActive firendList={friendList} noActive={noActive} />
            </Box>
        )
    }

    const FriendHeader = () => {

        const [active, setActive] = React.useState(false);

        return (
            <Box className="friend-main-header" component="section">
                <Box className="friend-main-header-name">
                    <SvgIcon component={FriendIcon} inheritViewBox sx={{ color: "#8a8e94", marginRight: "6px", alignItems: "baseline" }} />
                    <Typography variant="h3" className="friend-main-header-text">Friends</Typography>
                    <Divider orientation='vertical' variant='fullWidth' sx={{ backgroundColor: "#3e4046", m: "0 8px", width: "1px", flex: "0 0 auto", height: "24px" }} />
                    <Box className="friend-main-header-button">
                        <Stack direction="row" spacing={1}>
                            <Button className={`${category === "online" ? "active" : ""}`} onClick={() => setCategory("online")} disableRipple>
                                Online
                            </Button>
                            <Button className={`${category === "all" ? "active" : ""}`} onClick={() => setCategory("all")} disableRipple>
                                All
                            </Button>
                            <Button className={`${category === "pending" ? "active" : ""}`} onClick={() => setCategory("pending")} disableRipple>
                                Pending
                            </Button>
                            <Button className={`${category === "blocked" ? "active" : ""}`} onClick={() => setCategory("blocked")} disableRipple>
                                Blocked
                            </Button>
                            <Button className={`addfriend-button ${category === "addfriend" ? "active" : ""}`} variant='contained' onClick={() => setCategory("addfriend")} disableRipple>
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

    const PrivateChannelHeader = () => {
        return (
            <Box className="friend-main-header" component="section">
                <Box className="friend-main-header-name">
                    <AlternateEmailSharp sx={{ color: "#8a8e94", marginRight: "6px", alignItems: "baseline" }} />
                    <Box component="span" variant="h3" className="friend-main-header-hashtag">
                        {currentPrivateChannel.name}
                    </Box>
                    <Box>
                        <StatusList status={currentPrivateChannel.status} size={15} />
                    </Box>
                </Box>
                <Box className="friend-main-header-feature">
                    <FunctionTooltip title={
                        <React.Fragment>
                            <Typography variant="body1" sx={{ m: 0.5 }} >More</Typography>
                        </React.Fragment>} placement="bottom">
                        <PeopleAltIcon color="white" onClick={() => setUserSideBar(!userSideBar)} />
                    </FunctionTooltip>
                </Box>
            </Box>
        )
    }

    return (
        <Box className="friend-main-container">
            {
                currentPrivateChannel.uid ?
                    <PrivateChannelHeader />
                    :
                    <FriendHeader />
            }
            {
                currentPrivateChannel.uid ?
                    <PrivateChat currentPrivateChannel={currentPrivateChannel} currentUser={currentUser} currentMessage={currentMessage} userSideBar={userSideBar} privateMessages={privateMessages} />
                    :
                    category === "addfriend" ?
                        <AddFriend handleSearch={handleSearch} friendList={friendList} noActive={noActive} currentUser={currentUser} /> :
                        <FriendContent category={category} handleCurrentPrivateChannel={handleCurrentPrivateChannel} />

            }
        </Box>
    )
}

export default FriendBody
