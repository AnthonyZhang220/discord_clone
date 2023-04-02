import React from 'react'
import { Stack } from '@mui/system'
import { Avatar, Button, Modal, TextField, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Typography, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { TooltipProps } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Badge from '@mui/material/Badge';
import ExploreIcon from '@mui/icons-material/Explore';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import { TextFieldProps } from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';

import { db } from "../firebase";
import { onSnapshot, query, where, addDoc, collection, Timestamp, arrayUnion, getDocs } from 'firebase/firestore';


import "./ServerList.scss"
import { Link } from 'react-router-dom';


const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: "#1e2124",
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#1e2124",
    },
}));


const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: "#e3e5e8",
        border: 'none',
        fontSize: 16,
        padding: '10px 12px',
    },
}));



const ServerList = ({ currentUser, handleAddServer, handleServerInfo, handleCurrentServer, currentServer, setCurrentServer, setServerModal, serverModal, file, setFile, currentChannel, serverURL, setServerURL }) => {

    const [serverList, setServerList] = React.useState([]);


    //handle new server profile image before uploading
    const handleFile = (e) => {
        setFile(e.target.files[0])
        const url = URL.createObjectURL(e.target.files[0])
        setServerURL(url)
    }

    // Get list of servers that belong to the current user
    React.useEffect(() => {
        if (currentUser) {
            const q = query(collection(db, 'servers'), where('members', 'array-contains', currentUser.uid));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const userServers = [];
                snapshot.forEach((doc) => {
                    userServers.push({
                        name: doc.data().name,
                        serverPic: doc.data().serverPic,
                        uid: doc.id,
                    });
                });
                setServerList(userServers);
            });
        }

    }, [currentUser]);

    return (
        <Box component='aside' className="servers">
            <Box className="servers-list">
                <Box className="server focusable server-friends unread" role="button" aria-label="Discord Developers unread">
                    <Avatar className="server-icon" src="https://cdn.discordapp.com/embed/avatars/0.png" />
                </Box>
                {serverList.map(({ name, serverPic, uid }) => (
                    <Box className={`server focusable ${uid === currentServer.uid ? "active" : ""}`} key={uid} onClick={() => handleCurrentServer(name, uid)}>
                        <BootstrapTooltip title={
                            <React.Fragment>
                                <Typography variant="body1" sx={{ m: 0.5 }} >{name}</Typography>
                            </React.Fragment>
                        } placement="right">
                            <Avatar className="server-icon" src={serverPic} />
                        </BootstrapTooltip>
                    </Box>

                ))
                }
                <Box className="server" >
                    <BootstrapTooltip title={
                        <React.Fragment>
                            <Typography variant="body1" sx={{ m: 0.5 }} >Add a Server</Typography>
                        </React.Fragment>
                    } placement="right">
                        <IconButton sx={{ fontSize: 15 }} onClick={() => setServerModal(true)} >
                            <AddIcon className="server-icon" />
                        </IconButton>
                    </BootstrapTooltip>
                    <Dialog PaperProps={{
                        style: {
                            textAlign: "center",
                            backgroundColor: "#ffffff",
                            width: "440px"
                        }
                    }} open={serverModal} onClose={() => setServerModal(false)}>
                        <DialogTitle sx={{ color: "#060607" }} variant='h3'>Create a server</DialogTitle>
                        <DialogContent>
                            <DialogContentText variant='h5'>
                                Give your new server a personality with a name and an icon. You can always change it later.
                            </DialogContentText>
                            {
                                serverURL ?
                                    <Box component="label">
                                        <Box component="img" src={serverURL} sx={{ width: "75px", height: "75px", borderRadius: "50% 50%", mt: 4 }} />
                                        <Box component="input" type="file" onChange={e => handleFile(e)} sx={{ display: "none" }} />
                                    </Box>
                                    :
                                    <React.Fragment>
                                        <IconButton sx={{ mt: 4 }}>
                                            <Box component="label">
                                                <Badge badgeContent={<AddIcon />} color="primary">
                                                    <PhotoCameraIcon sx={{ fontSize: 50 }} />
                                                    <Box component="input" type="file" onChange={e => handleFile(e)} sx={{ display: "none" }} />
                                                </Badge>
                                            </Box>
                                        </IconButton>
                                    </React.Fragment>
                            }
                            <Box component="form">
                                <FormControl variant="standard" required fullWidth>
                                    <InputLabel shrink sx={{
                                        color: "#4e5058"
                                    }}>
                                        SERVER NAME
                                    </InputLabel>
                                    <BootstrapInput
                                        id="name"
                                        type="name"
                                        name="name"
                                        variant="outlined"
                                        autoComplete='off'
                                        onChange={e => handleServerInfo(e)}
                                        placeholder={`${currentUser.name}'s Server`}
                                    />
                                </FormControl>
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ backgroundColor: "#f2f3f5" }}>
                            <Button variant='text' sx={{ marginRight: "auto", color: "#4e5058" }} onClick={() => setServerModal(false)}>Back</Button>
                            <Button variant='contained' onClick={handleAddServer}>Create</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
                <BootstrapTooltip title={
                    <React.Fragment>
                        <Typography variant="body1" sx={{ m: 0.5 }} >Explore Public Servers</Typography>
                    </React.Fragment>
                } placement="right">
                    <Box className="server">
                        <IconButton sx={{ fontSize: 15 }} >
                            <ExploreIcon className="server-icon" />
                        </IconButton>
                    </Box>
                </BootstrapTooltip>
            </Box>
        </Box>
    )
}

export default ServerList;