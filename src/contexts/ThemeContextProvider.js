
import React from 'react'
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material'

function ThemeContextProvider({ children }) {
    let theme = createTheme({
        typography: {
            fontFamily: ["gg sans", "gg sans Normal", "gg sans Medium", "gg sans SemiBold", "sans-serif"].join(","),
            h3: {
                fontSize: 24,
                color: "#f2f3f5",
            },
            h4: {
                fontSize: 20,
                color: "#f2f3f5",
            },
            h5: {
                fontSize: 18,
                color: "#f2f3f5",
            },
            h6: {
                fontSize: 14,
            },
            p: {
                fontSize: 16,
                color: "#f2f3f5",
            },
            body1: {
                fontFamily: "gg sans SemiBold",
                fontSize: 16,
                color: "#f2f3f5",
            },
            body2: {
                fontFamily: "gg sans Normal",
                fontSize: 14,
                color: "#f2f3f5",
            }
        },
        components: {
            MuiIconButton: {
                defaultProps: {
                    color: 'secondary'
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: "none",
                        fontWeight: "bold"
                    },
                },
            },
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

    return (
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
    )
}

export default ThemeContextProvider
