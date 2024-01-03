import React from 'react'
import { Box } from '@mui/material'
import PrivateChat from './PrivateChat/PrivateChat'
import FriendBody from './FriendBody/FriendBody'
import { useSelector } from 'react-redux'
import DirectMessageHeader from '../DirectMessageHeader/DirectMessageHeader'
import "./DirectMessageBody.scss"

function DirectMessageBody() {
    const { isFriendListPageOpen } = useSelector(state => state.directMessage)

    return (
        <Box className="friend-main-container">
            <DirectMessageHeader />
            {
                isFriendListPageOpen ?
                    <FriendBody />
                    :
                    <PrivateChat />
            }
        </Box>
    )
}

export default DirectMessageBody