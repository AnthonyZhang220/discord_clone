import React from 'react'
import PrivateChat from './PrivateChat/PrivateChat'
import FriendBody from './FriendBody/FriendBody'

function DirectMessageBody() {
    return (
        <>
            {
                isDirectMessageChatSelected ? <PrivateChat /> : <FriendBody />
            }
        </>
    )
}

export default DirectMessageBody