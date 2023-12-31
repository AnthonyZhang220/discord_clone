import React from 'react'

import { Box, Typography, List, ListItem, FormControl, InputAdornment, InputLabel, InputBase, Button, Divider } from '@mui/material'
import FriendActive from '../Friend/FriendActive/FriendActive'
import SearchIcon from '@mui/icons-material/Search';
import styled from '@emotion/styled';

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

export default function AddFriend({ user, handleSearch, friendList, noActive }) {

    const [copyed, setCopyed] = React.useState(false);
    const copyToClip = () => {
        navigator.clipboard.writeText(user.uid).then(() => {
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
                        <input className="add-friend-search-input" type="search" name='search' placeholder='Enter a unique friend ID' onChange={e => handleSearch(e)} autoComplete='off'
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
                            defaultValue={user.uid}
                            readOnly
                            sx={{ marginTop: "16px" }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <Button onClick={() => copyToClip()}>Copy</Button>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </Box>
            </Box>
            <FriendActive firendList={friendList} noActive={noActive} />
        </Box>
    )
}
