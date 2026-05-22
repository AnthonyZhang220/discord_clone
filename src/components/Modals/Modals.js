import React, { useState } from "react"
import { TextFieldProps } from '@mui/material/TextField';
import PublicIcon from '@mui/icons-material/Public';
import { NavigateNext } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Badge from '@mui/material/Badge';

import { Button, InputLabel, FormControl, Box, InputBase, InputAdornment, Modal, TextField, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Typography, IconButton, ListItemButton, ListItemText, Divider } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { InfoInput } from '../CustomUIComponents';
import { useDispatch, useSelector } from "react-redux";
import { setCreateChannelModal, setCreateVoiceChannelModal, setCreateServerFormModal, setCreateServerModal, setInviteModal, setJoinServerModal } from '../../redux/features/modalSlice';
import { setNewServerInfo, setUploadFileLocationURL, setJoinServerId, setUploadServerProfileImage } from "../../redux/features/serverSlice";
import { setNewChannelInfo } from "../../redux/features/channelSlice";
import { handleCreateServer, handleJoinServer } from "../../handlers/serverHandlers";
import { handleCreateVoiceChannel, handleCreateChannel } from "../../handlers/channelHandlers";
import styled from "@emotion/styled";


const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: "#1e1f22",
        border: 'none',
        fontSize: 16,
        padding: '10px 12px',
        color: "#ffffff"
    },
}));


export function ServerDialog({ createServerModal }) {
    const dispatch = useDispatch();
    return (
        <Dialog PaperProps={{
            style: {
                textAlign: "center",
                backgroundColor: "#ffffff",
                width: "440px"
            }
        }} open={createServerModal} onClose={() => dispatch(setCreateServerModal(false))}>
            <DialogTitle sx={{ color: "#060607" }} variant='h3'>Create a server</DialogTitle>
            <DialogContent>
                <DialogContentText variant='h5'>
                    Your server is where you and your friends hang out. Make yours and start talking.
                </DialogContentText>
                <ListItemButton sx={{ borderRadius: "8px", border: "solid 1px #121314" }} onClick={() => dispatch(setCreateServerFormModal(true))}>
                    <PublicIcon />
                    <ListItemText variant="h5" primaryTypographyProps={{ color: "#121314", ml: 1 }}>
                        Create My Own
                    </ListItemText>
                    <NavigateNext edge="end" />
                </ListItemButton>
            </DialogContent>
            <DialogActions sx={{ backgroundColor: "#f2f3f5", flexDirection: "column" }}>
                <DialogContentText variant='h4'>
                    Have an invite already?
                </DialogContentText>
                <Button variant='contained' onClick={() => dispatch(setJoinServerModal(true))} >Join a Server</Button>
            </DialogActions>
        </Dialog>
    )
}


export function CreateServerDialog({ createServerFormModal }) {
    //handle new server profile image before uploading
    const dispatch = useDispatch();
    const { newServerInfo, uploadFileLocationURL, uploadServerProfileImage, isLoading } = useSelector((state) => state.server)
    const { user } = useSelector(state => state.auth)
    const handleFile = (e) => {
        dispatch(setUploadServerProfileImage(e.target.files[0]))
        const url = URL.createObjectURL(e.target.files[0])
        dispatch(setUploadFileLocationURL(url))
    }
    return (
        <Dialog PaperProps={{
            style: {
                textAlign: "center",
                backgroundColor: "#ffffff",
                width: "440px"
            }
        }} open={createServerFormModal} onClose={() => dispatch(setCreateServerFormModal(false))}>
            <DialogTitle sx={{ color: "#060607" }} variant='h3'>Create a server</DialogTitle>
            <DialogContent>
                <DialogContentText variant='h5'>
                    Give your new server a personality with a name and an icon. You can always change it later.
                </DialogContentText>
                {
                    uploadFileLocationURL ?
                        <Box component="label">
                            <Box component="img" src={uploadFileLocationURL} sx={{ width: "75px", height: "75px", borderRadius: "50% 50%", mt: 4 }} />
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
                        <InfoInput
                            id="name"
                            type="name"
                            name="name"
                            variant="outlined"
                            autoComplete='off'
                            onChange={e => dispatch(setNewServerInfo({ ...newServerInfo, serverName: e.target.value }))}
                            placeholder={`${user?.displayName}'s Server`}
                        />
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions sx={{ backgroundColor: "#f2f3f5" }}>
                <Button variant='text' sx={{ marginRight: "auto", color: "#4e5058" }} onClick={() => dispatch(setCreateServerFormModal(false))}>Back</Button>
                <LoadingButton
                    onClick={() => handleCreateServer(newServerInfo)}
                    loading={isLoading}
                    variant="contained"
                >
                    <span>Create</span>
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}

export function JoinServerDialog({ joinServerModal }) {
    const dispatch = useDispatch();
    const { joinServerId } = useSelector((state) => state.server)
    return (
        <Dialog PaperProps={{
            style: {
                textAlign: "center",
                backgroundColor: "#ffffff",
                width: "440px"
            }
        }} open={joinServerModal} onClose={() => dispatch(setJoinServerModal(false))}>
            <DialogTitle sx={{ color: "#060607" }} variant='h3'>Join a Server</DialogTitle>
            <DialogContent>
                <DialogContentText variant='h5'>
                    Enter an invite below to join an existing server
                </DialogContentText>
                <Box component="form">
                    <FormControl variant="standard" required fullWidth>
                        <InputLabel shrink sx={{
                            color: "#4e5058"
                        }}>
                            Invite ID
                        </InputLabel>
                        <InfoInput
                            id="name"
                            type="name"
                            name="name"
                            variant="outlined"
                            autoComplete='off'
                            onChange={e => dispatch(setJoinServerId(e.target.value))}
                            placeholder="Server ID"
                        />
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions sx={{ backgroundColor: "#f2f3f5" }}>
                <Button variant='text' sx={{ marginRight: "auto", color: "#4e5058" }} onClick={() => dispatch(setJoinServerModal(false))}>Back</Button>
                <Button variant='contained' onClick={() => handleJoinServer(joinServerId)}>Join Server</Button>
            </DialogActions>
        </Dialog>
    )
}

//invite people
export function InviteDialog({ inviteModal }) {
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const dispatch = useDispatch();
    const { currServer } = useSelector((state) => state.server)

    const copyToClip = () => {
        setLoading(true)
        navigator.clipboard.writeText(currServer.id).then(() => {
            setLoading(false)
            setCopied(true);
        })
    }
    return (
        <Dialog className="Create-Channel-Modal" open={inviteModal} onClose={() => dispatch(setInviteModal(false))} PaperProps={{
            style: {
                textAlign: "start",
                backgroundColor: "#313338",
                width: "440px"
            }
        }}>
            <DialogTitle sx={{ color: "#ffffff" }} variant='h3'>Invite friends to {currServer.name}</DialogTitle>
            <DialogContent>
                <Box component="form">
                    <FormControl variant="standard" required fullWidth>
                        <InputLabel shrink sx={{
                            color: "#ffffff"
                        }}>
                            OR, SEND A SERVER ID TO A FRIEND
                        </InputLabel>
                        <BootstrapInput
                            id="name"
                            name="name"
                            variant="outlined"
                            autoComplete="off"
                            defaultValue={currServer.id}
                            readOnly
                            endAdornment={
                                <InputAdornment position="end">
                                    <LoadingButton
                                        onClick={() => copyToClip()}
                                        loading={loading}
                                        variant='contained'
                                    >
                                        {
                                            copied ?
                                                <span>Copied!</span>
                                                :
                                                <span>Copy</span>
                                        }
                                    </LoadingButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </Box>
            </DialogContent>
        </Dialog>
    )
}


export function CreateChannelDialog({ createChannelModal }) {
    const dispatch = useDispatch();
    const { newChannelInfo } = useSelector((state) => state.channel)
    const { isLoading } = useSelector(state => state.load)
    return (
        <Dialog className="Create-Channel-Modal" open={createChannelModal} onClose={() => dispatch(setCreateChannelModal(false))} PaperProps={{
            style: {
                textAlign: "start",
                backgroundColor: "#313338",
                width: "440px"
            }
        }}>
            <DialogTitle sx={{ color: "#ffffff" }} variant='h3'>Create Text Channel</DialogTitle>
            <DialogContent>
                <Box component="form">
                    <FormControl variant="standard" required fullWidth>
                        <InputLabel shrink sx={{
                            color: "#ffffff"
                        }}>
                            CHANNEL NAME
                        </InputLabel>
                        <BootstrapInput
                            id="name"
                            name="name"
                            variant="outlined"
                            autoComplete="off"
                            onChange={e => dispatch(setNewChannelInfo({ channelName: e.target.value }))}
                            placeholder="new-channel"
                        />
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant='text' sx={{ marginRight: "auto", color: "#4e5058" }} onClick={() => dispatch(setCreateChannelModal(false))}>Cancel</Button>
                <LoadingButton
                    onClick={() => handleCreateChannel(newChannelInfo)}
                    loading={isLoading}
                    variant="contained"
                >
                    <span>Create Channel</span>
                </LoadingButton>
            </DialogActions>
        </Dialog>

    )
}

export function CreateVoiceChannelDialog({ createVoiceChannelModal }) {
    const dispatch = useDispatch();
    const { newChannelInfo } = useSelector((state) => state.channel)
    const { isLoading } = useSelector((state) => state.load)

    return (
        <Dialog className="Create-Channel-Modal" open={createVoiceChannelModal} onClose={() => dispatch(setCreateChannelModal(false))} PaperProps={{
            style: {
                textAlign: "start",
                backgroundColor: "#313338",
                width: "440px"
            }
        }}>
            <DialogTitle sx={{ color: "#ffffff" }} variant='h3'>Create Voice Channel</DialogTitle>
            <DialogContent>
                <Box component="form">
                    <FormControl variant="standard" required fullWidth>
                        <InputLabel shrink sx={{
                            color: "#ffffff"
                        }}>
                            CHANNEL NAME
                        </InputLabel>
                        <BootstrapInput
                            id="name"
                            name="name"
                            variant="outlined"
                            autoComplete="off"
                            onChange={e => dispatch(setNewChannelInfo({ channelName: e.target.value }))}
                            placeholder="new-channel"
                        />
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant='text' sx={{ marginRight: "auto", color: "#4e5058" }} onClick={() => dispatch(setCreateVoiceChannelModal(false))}>Cancel</Button>
                <LoadingButton
                    onClick={() => handleCreateVoiceChannel(newChannelInfo)}
                    loading={isLoading}
                    variant="contained"
                >
                    <span>Create Channel</span>
                </LoadingButton>
            </DialogActions>
        </Dialog>

    )
}