import React, { useState } from 'react'

function useCurrentUser() {
    //current Login USER/SERVER/CHANNEL
    const [currentUser, setCurrentUser] = useState({ name: null, profileURL: null, uid: null, createdAt: null });
    const [currentServer, setCurrentServer] = useState({ name: "", uid: null });
    const [currentChannel, setCurrentChannel] = useState({ name: "", uid: null });
    const [currentMessage, setCurrentMessage] = useState("");

    return [currentUser, currentServer, currentChannel, currentMessage]
}

export default useCurrentUser