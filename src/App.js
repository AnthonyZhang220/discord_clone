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
import { onSnapshot, query, where, addDoc, collection, Timestamp, arrayUnion, setDoc, doc, getDocs, QuerySnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { storage } from './firebase'
import { db } from './firebase'
import { uploadBytesResumable, uploadBytes, ref, getDownloadURL } from 'firebase/storage';


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
            }
        },
        MuiListItem: {
            defaultProps: {
                "&:hover": {
                    backgroundColor: "#5865f2",
                }
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
import { async } from '@firebase/util'



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
    const [currentUser, setCurrentUser] = React.useState({ name: null, profileURL: null, uid: null, createdAt: null });
    const [currentServer, setCurrentServer] = React.useState({ name: "", uid: null });
    const [currentChannel, setCurrentChannel] = React.useState({ name: "", uid: null });
    const [currentMessage, setCurrentMessage] = React.useState("");

    const [imageDir, setImageDir] = React.useState("")

    const [file, setFile] = React.useState(null);



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

        const userArray = JSON.parse(localStorage.getItem(`${currentUser.uid}`));
        const foundDefaultChannel = userArray.find(obj => obj.currentServer === serverUid)

        if (foundDefaultChannel == undefined) {
            const newServerObj = {
                currentServer: serverUid,
                currentChannel: null,
                currentChannelName: null,
            }
            userArray.push(newServerObj);

            localStorage.setItem(`${currentUser.uid}`, JSON.stringify(userArray))
        } else {
            userArray.forEach((obj) => {
                if (obj.currentServer === serverUid) {
                    setCurrentChannel({ name: obj.currentChannelName, uid: obj.currentChannel })
                }
            })
        }

        setCurrentServer({ name: serverName, uid: serverUid })

    }


    const handleCurrentChannel = (channelName, channelUid) => {


        const userArray = JSON.parse(localStorage.getItem(`${currentUser.uid}`))
        userArray.forEach((obj) => {
            if (obj.currentServer === currentServer.uid) {
                obj.currentChannel = channelUid;
                obj.currentChannelName = channelName;
            }
        })

        // setCurrentChannel({ ...currentChannel, uid: obj.currentChannel })
        localStorage.setItem(`${currentUser.uid}`, JSON.stringify(userArray))

        setCurrentChannel({ name: channelName, uid: channelUid })
    }


    const handleChannelModalClose = () => {
        setChannelModal(false);
    }
    const handleServerModalClose = () => {
        setServerModal(false);
    }



    // add new server image
    const handleUploadServerImage = async () => {
    }


    //add new Server with handleUploadServerImage();
    const handleAddServer = async () => {
        // Create the file metadata
        /** @type {any} */
        const metadata = {
            contentType: "image/*"
        }

        // Upload file and metadata to the object 'images/mountains.jpg'
        const serverProfileRef = ref(storage, `serverProfile/${currentUser.uid}/${newServerInfo.name}`, metadata);

        const uploadProgress = await uploadBytes(serverProfileRef, file)
        const url = await getDownloadURL(serverProfileRef)

        setNewServerInfo({ ...newServerInfo, serverPic: url })


        const { serverPic, name } = newServerInfo;

        const serverDoc = collection(db, "servers");

        //upload image

        await addDoc(serverDoc, {
            serverPic: url,
            name: name,
            ownerId: currentUser.uid,
            createdAt: Timestamp.fromDate(new Date()),
            members: [currentUser.uid]
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

    const handleChatInfo = (e) => {
        setCurrentMessage(e.target.value);
    }


    //add new channel to db
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


    //add new message to db
    const handleAddMessage = (e) => {
        e.preventDefault();

        if (currentMessage.trim() === "") {
            return;
        }

        const { uid, displayName, photoURL } = auth.currentUser;

        addDoc(collection(db, "messages"), {
            text: currentMessage,
            name: displayName,
            avatar: photoURL,
            createdAt: Timestamp.fromDate(new Date()),
            channelRef: currentChannel.uid,
            serverRef: currentServer.uid,
            userRef: uid,
        }).then(() => {
            setCurrentMessage("")
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
                    status: "online",
                })

                setCurrentUser({ name: user.displayName, profileURL: user.photoURL, uid: user.uid, createdAt: user.metadata.creationTime, status: "online" })


                //if user not in the storage, add to the local storage
                if (!localStorage.getItem(`${user.uid}`)) {
                    localStorage.setItem(`${user.uid}`, JSON.stringify([]));
                } else {
                    const defaultServer = JSON.parse(localStorage.getItem(`${user.uid}`))
                    setCurrentServer({ ...currentServer, uid: defaultServer[1].currentServer })
                    setCurrentChannel({ name: defaultServer[1].currentChannelName, uid: defaultServer[1].currentChannel })
                }
                navigate('../channels')
            } else {
                updateDoc(doc(db, "users", currentUser.uid), {
                    status: "offline",
                })
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
                                <ServerList
                                    handleAddServer={handleAddServer}
                                    handleServerInfo={handleServerInfo}
                                    handleCurrentServer={handleCurrentServer}
                                    setCurrentServer={setCurrentChannel}
                                    currentUser={currentUser}
                                    currentServer={currentServer}
                                    setServerModal={setServerModal}
                                    serverModal={serverModal}
                                    file={file}
                                    setFile={setFile}
                                />
                                <Channel
                                    currentServer={currentServer}
                                    currentUser={currentUser}
                                    currentChannel={currentChannel}
                                    signOut={signOut}
                                    handleAddChannel={handleAddChannel}
                                    handleCurrentChannel={handleCurrentChannel}
                                    channelModal={channelModal}
                                    setChannelModal={setChannelModal}
                                    handleChannelInfo={handleChannelInfo}
                                />
                                <Chat
                                    currentUser={currentUser}
                                    currentServer={currentServer}
                                    currentChannel={currentChannel}
                                    handleAddMessage={handleAddMessage}
                                    currentMessage={currentMessage}
                                    handleChatInfo={handleChatInfo}
                                />
                            </Box>
                        </Box>
                    } />
            </Routes>
        </ThemeProvider>
    )
}

export default App