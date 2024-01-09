import React, { useState } from 'react'
import { Box, Typography, List, ListItem, FormControl, InputAdornment, InputLabel, InputBase, Button, Divider } from '@mui/material'
import FriendActive from '../FriendActive/FriendActive'
import SearchIcon from '@mui/icons-material/Search';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { handleSearchFriend } from '../../../../../utils/handlers/searchHandlers';
import { debounce } from '../../../../../utils/handlers/searchHandlers';
import FriendTab from '../FriendTab/FriendTab';
import "./AddFriend.scss"


const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: "#1e1f22",
        border: 'none',
        fontSize: 16,
        padding: '10px 12px',
        color: "#ffffff"
    },
}));

export default function AddFriend({ noActive }) {
    const { user } = useSelector(state => state.auth)
    const { friendList, queryFriendList } = useSelector(state => state.directMessage)
    const [loading, setLoading] = useState(false);
    const [copyed, setCopyed] = React.useState(false);
    const copyToClip = () => {
        setLoading(true)
        navigator.clipboard.writeText(user.id).then(() => {
            setLoading(false)
            setCopyed(true);
        })
    }
    return (
        <Box className="content">
            <Box className="add-friend-content" component="main">
                <Box className="add-friend-title">
                    <Typography variant='h4'>
                        ADD FRIEND
                    </Typography>
                </Box>
                <Box className="add-friend-subtitle">
                    <Typography variant='body2'>
                        You can add a friend with their unique ID.
                    </Typography>
                </Box>
                <Box className="add-friend-search-form" component="form" >
                    <Box className="add-friend-search-inner">
                        <input className="add-friend-search-input" type="search" name='search' placeholder='Enter unique friend ID or their username' onChange={e => debounce(handleSearchFriend(e), 5000)} autoComplete='off'
                        />
                        <SearchIcon />
                    </Box>
                </Box>
                <Divider variant='middle'></Divider>
                <Box component="form" className="self-id-container">
                    <FormControl variant="standard" fullWidth>
                        <Typography variant='h4'>
                            Your Unique ID:
                        </Typography>
                        <BootstrapInput
                            id="name"
                            name="name"
                            variant="outlined"
                            autoComplete="off"
                            defaultValue={user.id}
                            readOnly
                            sx={{ marginTop: "16px" }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <LoadingButton
                                        onClick={() => copyToClip()}
                                        loading={loading}
                                        variant='contained'
                                    >
                                        {
                                            copyed ?
                                                <span>Copied!</span>
                                                :
                                                <span>Copy</span>
                                        }
                                    </LoadingButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </Box>
                <Divider variant='middle'></Divider>
                <Box>
                    {
                        queryFriendList?.map(({ displayName, status, avatar, id }) => (
                            <FriendTab displayName={displayName} avatar={avatar} id={id} status={status} key={id} />
                        ))
                    }
                </Box>
            </Box>
            <FriendActive firendList={friendList} noActive={noActive} />
        </Box>
    )
}
