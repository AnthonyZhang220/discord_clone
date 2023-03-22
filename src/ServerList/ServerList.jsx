import React from 'react'
import { Stack } from '@mui/system'
import { Avatar, Button, Modal, TextField, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material'
import { Box } from '@mui/system'
import AddIcon from '@mui/icons-material/Add';

import { db } from "../firebase";
import { onSnapshot, query, where, addDoc, collection, Timestamp, arrayUnion, getDocs } from 'firebase/firestore';


import "./ServerList.scss"


const ServerList = ({ currentUser, handleAddServer, handleServerInfo, handleCurrentServer, setCurrentServer, setServerModal, serverModal }) => {

    const [serverList, setServerList] = React.useState([]);

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



    // serverList UI
    React.useEffect(() => {
        const $ = document.querySelectorAll.bind(document);

        $(".server").forEach(el => {
            el.addEventListener("click", () => {
                const activeServer = $(".server.active")[0];
                activeServer.classList.remove("active");
                activeServer.removeAttribute("aria-selected");

                el.classList.add("active");
                el.setAttribute("aria-selected", true);
            });
        })

        $(".focusable, .button").forEach(el => {
            // blur only on mouse click
            // for accessibility, keep focus when keyboard focused
            el.addEventListener("mousedown", e => e.preventDefault());
            el.setAttribute("tabindex", "0");
        });

    }, [])


    return (
        <Box component='aside' className="servers">
            <Box className="servers-list">
                <Box className="server focusable server-friends unread" role="button" aria-label="Discord Developers unread">
                    <Avatar className="server-icon" src="https://cdn.discordapp.com/embed/avatars/0.png" />
                </Box>
                {serverList.map(({ name, serverPic, uid }) => (
                    <Box className="server focusable" key={uid} onClick={() => handleCurrentServer(name, uid)}>
                        <Avatar className="server-icon" src={serverPic} />
                    </Box>
                ))}
                <Box className="server focusable" >
                    <AddIcon className="server-icon" onClick={() => setServerModal(true)} />
                </Box>
            </Box>
            <Dialog open={serverModal} onClose={() => setServerModal(false)}>
                <DialogTitle>Create a server</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Give your new server a personality with a name and an icon. You can alwats change it later.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="SERVER NAME"
                        type="name"
                        name="name"
                        fullWidth
                        variant="standard"
                        onChange={e => handleServerInfo(e)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant='text' onClick={() => setServerModal(false)}>Back</Button>
                    <Button variant='contained' onClick={handleAddServer}>Create</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default ServerList;