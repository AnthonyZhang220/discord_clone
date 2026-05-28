import React, { useState } from "react";
import PublicIcon from "@mui/icons-material/Public";
import { NavigateNext } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Badge from "@mui/material/Badge";

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText,
} from "@/components/compat/RadixCompat";
import {
    Button,
    InputLabel,
    FormControl,
    InputBase,
    InputAdornment,
    IconButton,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { InfoInput } from "@/components/CustomUIComponents";
import { useDispatch, useSelector } from "react-redux";
import {
    setCreateChannelModal,
    setCreateVoiceChannelModal,
    setCreateServerFormModal,
    setCreateServerModal,
    setInviteModal,
    setJoinServerModal,
} from "@/redux/features/modalSlice";
import {
    setNewServerInfo,
    setUploadFileLocationURL,
    setJoinServerId,
    setUploadServerProfileImage,
} from "@/redux/features/serverSlice";
import { setNewChannelInfo } from "@/redux/features/channelSlice";
import { handleCreateServer, handleJoinServer } from "@/handlers/serverHandlers";
import { handleCreateVoiceChannel, handleCreateChannel } from "@/handlers/channelHandlers";
import styled from "@emotion/styled";
// modal styles moved to theme / consolidated into global styles

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    "label + &": {
        marginTop: theme.spacing(3),
    },
    "& input": {
        borderRadius: 4,
        position: "relative",
        backgroundColor: theme.palette.background.paper,
        border: "none",
        fontSize: 16,
        padding: "10px 12px",
        color: theme.palette.text.primary,
    },
}));

export function ServerDialog({ createServerModal }) {
    const dispatch = useDispatch();
    return (
        <Dialog
            PaperProps={{ className: "modal-paper modal-paper--center" }}
            open={createServerModal}
            onClose={() => dispatch(setCreateServerModal(false))}
        >
            <DialogTitle className="modal-title" variant="h3">
                Create a server
            </DialogTitle>
            <DialogContent>
                <DialogContentText variant="h5">
                    Your server is where you and your friends hang out. Make yours and start
                    talking.
                </DialogContentText>
                <ListItemButton
                    className="modal-listitem-button"
                    onClick={() => dispatch(setCreateServerFormModal(true))}
                >
                    <PublicIcon />
                    <ListItemText
                        variant="h5"
                        primaryTypographyProps={{ className: "modal-listitem-text" }}
                    >
                        Create My Own
                    </ListItemText>
                    <NavigateNext edge="end" />
                </ListItemButton>
            </DialogContent>
            <DialogActions className="modal-actions modal-actions--column">
                <DialogContentText variant="h4">Have an invite already?</DialogContentText>
                <Button variant="contained" onClick={() => dispatch(setJoinServerModal(true))}>
                    Join a Server
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export function CreateServerDialog({ createServerFormModal }) {
    //handle new server profile image before uploading
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { newServerInfo, uploadFileLocationURL, isLoading } = useSelector(
        (state) => state.server
    );
    const handleFile = (e) => {
        dispatch(setUploadServerProfileImage(e.target.files[0]));
        const url = URL.createObjectURL(e.target.files[0]);
        dispatch(setUploadFileLocationURL(url));
    };
    return (
        <Dialog
            PaperProps={{ className: "modal-paper modal-paper--center" }}
            open={createServerFormModal}
            onClose={() => dispatch(setCreateServerFormModal(false))}
        >
            <DialogTitle className="modal-title" variant="h3">
                Create a server
            </DialogTitle>
            <DialogContent>
                <DialogContentText variant="h5">
                    Give your new server a personality with a name and an icon. You can always
                    change it later.
                </DialogContentText>
                {uploadFileLocationURL ? (
                    <label>
                        <img src={uploadFileLocationURL} className="modal-image-preview" />
                        <input
                            type="file"
                            onChange={(e) => handleFile(e)}
                            className="hidden-input"
                        />
                    </label>
                ) : (
                    <React.Fragment>
                        <IconButton className="modal-iconbutton--mt4">
                            <label>
                                <Badge badgeContent={<AddIcon />} color="primary">
                                    <PhotoCameraIcon className="modal-photo-icon" />
                                    <input
                                        type="file"
                                        onChange={(e) => handleFile(e)}
                                        className="hidden-input"
                                    />
                                </Badge>
                            </label>
                        </IconButton>
                    </React.Fragment>
                )}
                <form>
                    <FormControl variant="standard" required fullWidth>
                        <InputLabel shrink className="modal-input-label">
                            SERVER NAME
                        </InputLabel>
                        <InfoInput
                            id="name"
                            type="name"
                            name="name"
                            variant="outlined"
                            autoComplete="off"
                            onChange={(e) =>
                                dispatch(
                                    setNewServerInfo({
                                        ...newServerInfo,
                                        serverName: e.target.value,
                                    })
                                )
                            }
                            placeholder={`${user?.displayName}'s Server`}
                        />
                    </FormControl>
                </form>
            </DialogContent>
            <DialogActions className="modal-actions">
                <Button
                    variant="text"
                    className="modal-button-back"
                    onClick={() => dispatch(setCreateServerFormModal(false))}
                >
                    Back
                </Button>
                <LoadingButton
                    onClick={() => handleCreateServer(newServerInfo)}
                    loading={isLoading}
                    variant="contained"
                >
                    <span>Create</span>
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}

export function JoinServerDialog({ joinServerModal }) {
    const dispatch = useDispatch();
    const { joinServerId } = useSelector((state) => state.server);
    return (
        <Dialog
            PaperProps={{ className: "modal-paper modal-paper--center" }}
            open={joinServerModal}
            onClose={() => dispatch(setJoinServerModal(false))}
        >
            <DialogTitle className="modal-title" variant="h3">
                Join a Server
            </DialogTitle>
            <DialogContent>
                <DialogContentText variant="h5">
                    Enter an invite below to join an existing server
                </DialogContentText>
                <form>
                    <FormControl variant="standard" required fullWidth>
                        <InputLabel shrink className="modal-input-label">
                            Invite ID
                        </InputLabel>
                        <InfoInput
                            id="name"
                            type="name"
                            name="name"
                            variant="outlined"
                            autoComplete="off"
                            onChange={(e) => dispatch(setJoinServerId(e.target.value))}
                            placeholder="Server ID"
                        />
                    </FormControl>
                </form>
            </DialogContent>
            <DialogActions className="modal-actions">
                <Button
                    variant="text"
                    className="modal-button-back"
                    onClick={() => dispatch(setJoinServerModal(false))}
                >
                    Back
                </Button>
                <Button variant="contained" onClick={() => handleJoinServer(joinServerId)}>
                    Join Server
                </Button>
            </DialogActions>
        </Dialog>
    );
}

//invite people
export function InviteDialog({ inviteModal }) {
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const dispatch = useDispatch();
    const { currServer } = useSelector((state) => state.server);

    const copyToClip = () => {
        setLoading(true);
        navigator.clipboard.writeText(currServer.id).then(() => {
            setLoading(false);
            setCopied(true);
        });
    };
    return (
        <Dialog
            className="Create-Channel-Modal"
            open={inviteModal}
            onClose={() => dispatch(setInviteModal(false))}
            PaperProps={{ className: "modal-paper modal-paper--start" }}
        >
            <DialogTitle className="modal-title" variant="h3">
                Invite friends to {currServer.name}
            </DialogTitle>
            <DialogContent>
                <form>
                    <FormControl variant="standard" required fullWidth>
                        <InputLabel shrink className="modal-input-label">
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
                                        variant="contained"
                                    >
                                        {copied ? <span>Copied!</span> : <span>Copy</span>}
                                    </LoadingButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function CreateChannelDialog({ createChannelModal }) {
    const dispatch = useDispatch();
    const { newChannelInfo } = useSelector((state) => state.channel);
    const { isLoading } = useSelector((state) => state.load);
    return (
        <Dialog
            className="Create-Channel-Modal"
            open={createChannelModal}
            onClose={() => dispatch(setCreateChannelModal(false))}
            PaperProps={{ className: "modal-paper modal-paper--start" }}
        >
            <DialogTitle className="modal-title" variant="h3">
                Create Text Channel
            </DialogTitle>
            <DialogContent>
                <form>
                    <FormControl variant="standard" required fullWidth>
                        <InputLabel shrink className="modal-input-label">
                            CHANNEL NAME
                        </InputLabel>
                        <BootstrapInput
                            id="name"
                            name="name"
                            variant="outlined"
                            autoComplete="off"
                            onChange={(e) =>
                                dispatch(setNewChannelInfo({ channelName: e.target.value }))
                            }
                            placeholder="new-channel"
                        />
                    </FormControl>
                </form>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="text"
                    className="modal-button-back"
                    onClick={() => dispatch(setCreateChannelModal(false))}
                >
                    Cancel
                </Button>
                <LoadingButton
                    onClick={() => handleCreateChannel(newChannelInfo)}
                    loading={isLoading}
                    variant="contained"
                >
                    <span>Create Channel</span>
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}

export function CreateVoiceChannelDialog({ createVoiceChannelModal }) {
    const dispatch = useDispatch();
    const { newChannelInfo } = useSelector((state) => state.channel);
    const { isLoading } = useSelector((state) => state.load);

    return (
        <Dialog
            className="Create-Channel-Modal"
            open={createVoiceChannelModal}
            onClose={() => dispatch(setCreateChannelModal(false))}
            PaperProps={{ className: "modal-paper modal-paper--start" }}
        >
            <DialogTitle className="modal-title" variant="h3">
                Create Voice Channel
            </DialogTitle>
            <DialogContent>
                <form>
                    <FormControl variant="standard" required fullWidth>
                        <InputLabel shrink className="modal-input-label">
                            CHANNEL NAME
                        </InputLabel>
                        <BootstrapInput
                            id="name"
                            name="name"
                            variant="outlined"
                            autoComplete="off"
                            onChange={(e) =>
                                dispatch(setNewChannelInfo({ channelName: e.target.value }))
                            }
                            placeholder="new-channel"
                        />
                    </FormControl>
                </form>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="text"
                    className="modal-button-back"
                    onClick={() => dispatch(setCreateVoiceChannelModal(false))}
                >
                    Cancel
                </Button>
                <LoadingButton
                    onClick={() => handleCreateVoiceChannel(newChannelInfo)}
                    loading={isLoading}
                    variant="contained"
                >
                    <span>Create Channel</span>
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}
