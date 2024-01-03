import React, { memo, useState, useMemo, useEffect } from 'react'

import { Box, List, SvgIcon, Button, Divider, Typography, ListItemButton, ListItemText, ListItem, } from '@mui/material';

import FriendIcon from "./friend.svg"
import GroupDMIcon from "./groupdm.svg"
import InboxIcon from '@mui/icons-material/Inbox';

import FriendActive from './AddFriend/FriendActive/FriendActive';
import FriendList from './FriendList/FriendList';
import SearchIcon from '@mui/icons-material/Search';

import AddFriend from './AddFriend/AddFriend';
import "./FriendBody.scss";


export default function FriendBody() {

    const handleSearch = (e) => {
        const searchTerm = e.target.value;
    }

    const [category, setCategory] = useState("online");
    const [noActive, setNoActive] = useState(true);


    return (
        <>
            {
                category === "addfriend" ?
                    <AddFriend handleSearch={handleSearch} noActive={noActive} /> :
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
                                        <FriendList />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <FriendActive />
                    </Box>
            }
        </>
    )
};
