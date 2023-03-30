import React from 'react'
import { Stack } from '@mui/system'
import { Avatar, Button, Modal, TextField, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Typography, IconButton } from '@mui/material'
import { Box } from '@mui/system'
import AddIcon from '@mui/icons-material/Add';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { TooltipProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Badge from '@mui/material/Badge';
import ExploreIcon from '@mui/icons-material/Explore';

import { db } from "../firebase";
import { onSnapshot, query, where, addDoc, collection, Timestamp, arrayUnion, getDocs } from 'firebase/firestore';


import "./ServerList.scss"


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



const ServerList = ({ currentUser, handleAddServer, handleServerInfo, handleCurrentServer, currentServer, setCurrentServer, setServerModal, serverModal, file, setFile }) => {

    const [serverList, setServerList] = React.useState([]);
    const [serverURL, setServerURL] = React.useState(null);


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
                        <IconButton sx={{ fontSize: 15 }} >
                            <AddIcon className="server-icon" onClick={() => setServerModal(true)} fontSize="small" />
                        </IconButton>
                    </BootstrapTooltip>
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
            <Dialog sx={{ textAlign: "center" }} open={serverModal} onClose={() => setServerModal(false)}>
                <DialogTitle variant='h4'>Create a server</DialogTitle>
                <DialogContent>
                    <DialogContentText variant='h6'>
                        Give your new server a personality with a name and an icon. You can always change it later.
                    </DialogContentText>
                    {
                        serverURL ?
                            <Box component="label">
                                <Box component="img" src={serverURL} sx={{ width: "75px", height: "75px", borderRadius: "50% 50%", m: 4 }} />
                                <Box component="input" type="file" onChange={e => handleFile(e)} sx={{ display: "none" }} />
                            </Box>
                            :
                            <React.Fragment>
                                <IconButton sx={{ m: 4 }}>
                                    <Box component="label">
                                        <Badge badgeContent={<AddIcon />} color="primary">
                                            <PhotoCameraIcon sx={{ fontSize: 50 }} />
                                            <Box component="input" type="file" onChange={e => handleFile(e)} sx={{ display: "none" }} />
                                        </Badge>
                                    </Box>
                                </IconButton>
                            </React.Fragment>
                    }
                    <TextField
                        autoFocus
                        id="name"
                        label="SERVER NAME"
                        type="name"
                        name="name"
                        fullWidth
                        variant="standard"
                        onChange={e => handleServerInfo(e)}
                        placeholder={`${currentUser.name}'s Server`}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant='text' sx={{ marginRight: "auto" }} onClick={() => setServerModal(false)}>Back</Button>
                    <Button variant='contained' onClick={handleAddServer}>Create</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default ServerList;