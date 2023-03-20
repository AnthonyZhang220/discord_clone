import React from 'react'
import { Stack } from '@mui/system'
import { Avatar, Button, Modal, TextField } from '@mui/material'
import { Box } from '@mui/system'
import AddIcon from '@mui/icons-material/Add';

import { db } from "../firebase";
import { onSnapshot, query, where, addDoc, collection, Timestamp } from 'firebase/firestore';


import "./ServerList.scss"


const ServerList = ({ currentUser }) => {


    const [serverList, setServerList] = React.useState();
    const [newServerInfo, setNewServerInfo] = React.useState({ name: "", serverPic: "" });
    const [modal, setModal] = React.useState(false);


    const showModal = () => {
        setModal(true);
    }

    const handleModalClose = () => {
        setModal(false);
    }

    const handleAddServer = () => {

        const { serverPic, name } = newServerInfo;

        addDoc(collection(db, "servers"), {
            serverPic: serverPic,
            name: name,
            uid,
        }).then(() => {
            handleModalClose();
        })
    }

    const handleServerInfo = (e) => {
        const { name, value } = e.target;

        setNewServerInfo({
            ...newServerInfo,
            [name]: value,
        })
    }


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

    //server UI Render
    React.useEffect(() => {
        const q = query(collection(db, "servers"), where("members", "array-contains", currentUser.uid));
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            let serverList = [];
            QuerySnapshot.forEach((doc) => {
                serverList.push({ ...doc.data(), id: doc.id });
            })
            console.log(serverList)
            setServerList(serverList)
        })

        return () => {
            unsubscribe();
        }
    }, [])


    return (
        <Box component='aside' className="servers">
            <Box className="servers-list">
                <Box className="server focusable server-friends unread" role="button" aria-label="Discord Developers unread">
                    <Avatar className="server-icon" src="https://cdn.discordapp.com/embed/avatars/0.png" />
                </Box>
                {serverList?.map(({ serverPic }) => (
                    <Box className="server focusable unread">
                        <Avatar className="server-icon" src={serverPic} />
                    </Box>
                ))}
                <Box className="server focusable" >
                    <AddIcon className="server-icon" onClick={() => showModal()} />
                </Box>
                <Modal
                    open={modal}
                    onClose={handleModalClose}
                >
                    <Box component="form">
                        <TextField label="Server Name" name="name" onChange={e => handleServerInfo(e)} />
                        <TextField label="Server Profile" name="serverPic" onChange={e => handleServerInfo(e)} />
                        <Button variant='text' onClick={handleModalClose}>Back</Button>
                        <Button variant='contained' onClick={handleAddServer}>Create</Button>

                    </Box>
                </Modal>

            </Box>
        </Box>
    )
}

export default ServerList;