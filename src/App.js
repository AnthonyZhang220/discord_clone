import React from 'react'
import Chat from './Chat/Chat'
import ServerList from './ServerList/ServerList'
import Channel from './Channel/Channel'
import { Box } from '@mui/system'

import "./App.scss";


const App = () => {
    return (
        <Box className="app-mount">
            <Box className="app-container">
                <ServerList />
                <Channel />
                <Chat />
            </Box>
        </Box>

    )
}

export default App