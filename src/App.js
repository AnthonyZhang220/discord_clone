import React from 'react'
import Chat from './Chat/Chat'
import ServerList from './ServerList/ServerList'
import Channel from './Channel/Channel'
import { Box } from '@mui/system'
import { createTheme, ThemeProvider, responsiveFontSizes, CssBaseline } from '@mui/material'


import "./App.scss";


let theme = createTheme({
    typography: {
        fontFamily: ["gg sans", "gg sans Normal", "gg sans Medium", "gg sans SemiBold", "sans-serif"].join(","),
        h3: {
            color: "white",
        },
        h5: {
            color: "white",
        },
        p: {
            color: "white",
        },
        body1: {
            color: "white",
        },
        body2: {
            color: "white",
        }
    },
    components: {
        MuiIconButton: {
            defaultProps: {
                color: 'secondary'
            }
        }
    },
    palette: {
        primary: {
            main: "#b8b9bf",
        },
        secondary: {
            main: '#b8b9bf',
        },
    },
});

theme = responsiveFontSizes(theme);

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
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