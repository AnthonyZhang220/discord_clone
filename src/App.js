import React from 'react'
import Chat from './Chat/Chat'
import ServerList from './ServerList/ServerList'
import Channel from './Channel/Channel'
import { Box } from '@mui/system'
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material'
import { Routes, Route, useNavigate } from 'react-router-dom'


import "./App.scss";
import LoginPage, { ResetPasswordPage } from './LoginPage/LoginPage'
import { RegisterPage } from './LoginPage/LoginPage'


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
            fontFamily: "gg sans SemiBold",
        },
        body2: {
            color: "white",
            fontFamily: "gg sans Normal",
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

//google signin
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';

const App = () => {
    const navigate = useNavigate();

    // const [user] = useAuthState(auth);

    const [currentUser, setCurrentUser] = React.useState({ name: "", profileURL: "", uid: 0 });

    const provider = new GoogleAuthProvider();

    //google sign in with redirect
    const googleSignIn = () => {
        // This will trigger a full page redirect away from your app
        signInWithRedirect(auth, provider).then(() => {
            navigate("../channels")
        })


    }
    //
    const signOut = () => {
        auth.signOut().then(() => {
            setCurrentUser(null)
        }).then(() => {
            navigate("/", { replace: true })
        })
    }


    //google sign in with redirect
    React.useEffect(() => {
        getRedirectResult(auth)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access Google APIs.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;

                // The signed-in user info.
                const user = result.user;
                return setDoc(doc(db, "users", user.uid), {
                    displayName: user.name,
                    email: user.email,
                })
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    }, [])

    //auth/login state change
    React.useEffect(() => {

        const loginState = auth.onAuthStateChanged((user) => {
            if (user) {
                console.log(user)
                setCurrentUser({ name: user.displayName, profileURL: user.photoURL, uid: user.uid })
                console.log(currentUser);
                navigate('../channels')
            } else {
                setCurrentUser({ name: "", profileURL: "", uid: null })
                navigate('../')

            }

        })

        return () => {
            loginState();
        }

    }, [])

    return (
        <ThemeProvider theme={theme}>
            {/* <CssBaseline /> */}
            <Routes>
                <Route index path="/"
                    element={
                        <LoginPage
                            googleSignIn={googleSignIn}
                        />
                    } />
                <Route path="/reset"
                    element={<ResetPasswordPage />} />
                <Route path="/register"
                    element={<RegisterPage />} />

                <Route path="/channels"
                    element={
                        <Box className="app-mount">
                            <Box className="app-container"  >
                                <ServerList currentUser={currentUser} />
                                <Channel
                                    currentUser={currentUser}
                                    signOut={signOut} />
                                <Chat currentUser={currentUser} />
                            </Box>
                        </Box>
                    } />
            </Routes>
        </ThemeProvider>
    )
}

export default App