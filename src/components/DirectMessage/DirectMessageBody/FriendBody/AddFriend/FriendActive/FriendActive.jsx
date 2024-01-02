import React from 'react'
import { Typography, Box } from '@mui/material'
import "./FriendActive.scss"

export default function FriendActive({ noActive }) {


    return (
        <Box className="friend-active">
            <Box className="friend-active-container">
                <Box component="aside" className="friend-active-wrapper">
                    {
                        noActive ?
                            <Typography variant='h4'>
                                Active Now
                            </Typography>
                            :
                            <Typography>
                                Friend Active
                            </Typography>
                    }
                </Box>
            </Box>
        </Box>
    )
}
