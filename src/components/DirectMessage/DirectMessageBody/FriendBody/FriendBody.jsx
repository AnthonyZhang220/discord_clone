import React, { useState } from 'react'
import { Box } from '@mui/material';
import FriendActive from './FriendActive/FriendActive';
import FriendList from './FriendList/FriendList';
import SearchIcon from '@mui/icons-material/Search';

import AddFriend from './AddFriend/AddFriend';
import { useSelector } from 'react-redux';
import { handleSearchFriend } from '../../../../utils/handlers/searchHandlers';
import "./FriendBody.scss";


export default function FriendBody() {
    const { friendFilter, friendList } = useSelector(state => state.directMessage)
    const [noActive, setNoActive] = useState(true);

    return (
        <>
            {
                friendFilter === "addfriend" ?
                    <AddFriend noActive={noActive} /> :
                    <Box className="content">
                        <Box className="friend-main-content" component="main">
                            <Box className="friend-search-form" >
                                <Box className="friend-search-inner" component="form">
                                    <input className="friend-search-input" type="search" name='search' placeholder='Search' onChange={e => handleSearchFriend(e)} autoComplete='off'
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
                        <FriendActive noActive={noActive} friendList={friendList} />
                    </Box>
            }
        </>
    )
};
