import React, { memo, useState, useMemo, useEffect } from 'react'

import { Box, List, SvgIcon, Button, Divider, Typography, ListItemButton, ListItemText, ListItem, } from '@mui/material';

import FriendIcon from "./friend.svg"
import GroupDMIcon from "./groupdm.svg"
import InboxIcon from '@mui/icons-material/Inbox';

import FriendActive from './AddFriend/FriendActive/FriendActive';
import FriendList from './FriendList/FriendList';
import SearchIcon from '@mui/icons-material/Search';
import NumbersIcon from '@mui/icons-material/Numbers';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InputLabel from '@mui/material/InputLabel';
import { TextFieldProps } from '@mui/material/TextField';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { Stack } from '@mui/material';


import { FunctionTooltip } from '../../../CustomUIComponents';
import PrivateChat from '../PrivateChat/PrivateChat';
import { AlternateEmailSharp } from '@mui/icons-material';
import AddFriend from './AddFriend/AddFriend';
import StatusList from '../../../StatusList';
import "./FriendBody.scss";


export default function FriendBody({ currentPrivateChannel, user, privateMessages, handleCurrentPrivateChannel, friendList, handleAddPrivateMessage, }) {

    const [userSideBar, setUserSideBar] = useState(true)
    const handleShowUserDetail = () => {
        setUserSideBar(true)
    }
    const handleCloseUserDetail = () => {
        setUserSideBar(false)
    }
    const handleSearch = (e) => {
        const searchTerm = e.target.value;
    }

    const [category, setCategory] = useState("online");
    const [noActive, setNoActive] = useState(true);

    useEffect(() => {
        console.log(category)
    }, [category])


    return (
        <Box className="friend-main-container">
            {
                category === "addfriend" ?
                    <AddFriend handleSearch={handleSearch} friendList={friendList} noActive={noActive} user={user} /> :
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
            }
        </Box>
    )
};
