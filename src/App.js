import React from 'react'
import Chat from './Chat/Chat'
import ServerList from './ServerList/ServerList'
import Channel from './Channel/Channel'
import { Box } from '@mui/system'
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material'


import "./App.scss";


let theme = createTheme({
    typography: {
        fontFamily: ["gg sans", "gg sans Normal", "gg sans Medium", "gg sans SemiBold", "sans-serif"].join(","),
        fontSize: 14,
        h3: {
            color: "#fff",
        },
        h5: {
            color: "#fff",
        },
        p: {
            color: "#fff",
        }
    },
});
theme = responsiveFontSizes(theme);

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            {/* <CssBaseline /> */}
            <Box className="app-mount">
                <Box className="app-container" >
                    <ServerList />
                    <Channel />
                    <Chat />
                </Box>
            </Box>
        </ThemeProvider>

    )
}

export default App