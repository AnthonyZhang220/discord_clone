import React from 'react'
import Chat from './Chat/Chat'
import ServerList from './ServerList/ServerList'
import Channel from './Channel/Channel'
import { Box } from '@mui/system'
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Avatar, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material'


import "./App.scss";
import LoginPage, { ResetPasswordPage } from './LoginPage/LoginPage'
import { RegisterPage } from './LoginPage/LoginPage'
import { onSnapshot, query, where, addDoc, collection, Timestamp, arrayUnion, setDoc, doc, getDocs, QuerySnapshot } from 'firebase/firestore';
import { db } from './firebase'


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
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, onAuthStateChanged } from 'firebase/auth';
import { CloseFullscreen } from '@mui/icons-material'



const App = () => {
    const navigate = useNavigate();
    // const [user] = useAuthState(auth);
    const provider = new GoogleAuthProvider();

    //show modal for new server/channel
    const [channelModal, setChannelModal] = React.useState(false);
    const [serverModal, setServerModal] = React.useState(false);

    //store server/channel list for UI render

    //add new server/channel
    const [newChannel, setNewChannel] = React.useState({ name: "" })
    const [newServerInfo, setNewServerInfo] = React.useState({ name: "", serverPic: "" });

    //current Login USER/SERVER/CHANNEL
    const [currentUser, setCurrentUser] = React.useState({ name: null, profileURL: null, uid: null });
    const [currentServer, setCurrentServer] = React.useState({ name: "", uid: null });
    const [currentChannel, setCurrentChannel] = React.useState({ name: "", uid: null });



    //google sign in with redirect
    const googleSignIn = () => {
        // This will trigger a full page redirect away from your app
        signInWithRedirect(auth, provider).then(() => {
            navigate("../channels")
        })


    }

    //auth sign out function
    const signOut = () => {
        auth.signOut().then(() => {
            setCurrentUser(null)
        }).then(() => {
            navigate("/", { replace: true })
        })
    }


    const handleCurrentServer = (serverName, serverUid) => {
        setCurrentServer({ name: serverName, uid: serverUid })
    }


    const handleCurrentChannel = (channelName, channelUid) => {
        setCurrentChannel({ name: channelName, uid: channelUid })
    }


    const handleChannelModalClose = () => {
        setChannelModal(false);
    }
    const handleServerModalClose = () => {
        setServerModal(false);
    }


    //add new Server
    const handleAddServer = () => {

        const { serverPic, name } = newServerInfo;

        addDoc(collection(db, "servers"), {
            serverPic: serverPic,
            name: name,
            ownerId: currentUser.uid,
            createdAt: Timestamp.fromDate(new Date()),
            members: [currentUser.uid]
        }).then(() => {
            handleServerModalClose();
        })
    }

    const handleServerInfo = (e) => {
        const { name, value } = e.target;

        setNewServerInfo({
            ...newServerInfo,
            [name]: value,
        })
    }
    const handleChannelInfo = (e) => {
        const { name, value } = e.target;

        setNewChannel({
            ...newChannel,
            [name]: value,
        })
    }

    //add new channel
    const handleAddChannel = () => {
        const { name } = newChannel;

        addDoc(collection(db, "channels"), {
            name: name,
            serverRef: currentServer.uid,
            createdAt: Timestamp.fromDate(new Date()),
            messages: [],
        }).then(() => {
            handleChannelModalClose();
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
                setDoc(doc(db, "users", user.uid), {
                    displayName: user.name,
                    email: user.email,
                })
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            })
    }, [])

    //auth/login state change
    React.useEffect(() => {
        const loginState = onAuthStateChanged(auth, (user) => {
            if (user) {
                setDoc(doc(db, "users", user.uid), {
                    displayName: user.displayName,
                    email: user.email,
                    profileURL: user.photoURL,
                    userId: user.uid,
                    createdAt: Timestamp.fromDate(new Date()),
                })
                setCurrentUser({ name: user.displayName, profileURL: user.photoURL, uid: user.uid })
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


    // React.useEffect(()=>{
    //     console.log(serverList)
    //     console.log(currentUser)

    // },[serverList, currentUser])


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
                                <ServerList
                                    handleAddServer={handleAddServer}
                                    handleServerInfo={handleServerInfo}
                                    handleCurrentServer={handleCurrentServer}
                                    setCurrentServer={setCurrentChannel}
                                    currentUser={currentUser}
                                    setServerModal={setServerModal}
                                    serverModal={serverModal}
                                />
                                <Channel
                                    currentServer={currentServer}
                                    currentUser={currentUser}
                                    signOut={signOut}
                                    handleAddChannel={handleAddChannel}
                                    handleCurrentChannel={handleCurrentChannel}
                                    channelModal={channelModal}
                                    setChannelModal={setChannelModal}
                                    handleChannelInfo={handleChannelInfo}
                                />
                                <Chat
                                    currentUser={currentUser}
                                    currentServer={currentServer} />
                            </Box>
                        </Box>
                    } />
            </Routes>
        </ThemeProvider>
    )
}

export default App