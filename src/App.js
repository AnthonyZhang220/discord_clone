import React from 'react'
import ServerList from './ServerList/ServerList'
import Channel from './Channel/Channel'
import "./App.scss";

const App = () => {
    return (
        <div className="app-container">
            <ServerList />
            <Channel />
            <Chat />
        </div>

    )
}

export default App