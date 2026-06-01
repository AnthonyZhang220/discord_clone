import React from "react";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import AvatarWithStatus from "@/components/AvatarWithStatus/AvatarWithStatus";
import { useDispatch, useSelector } from "react-redux";
import { setCreateServerFormModal } from "@/redux/features/modalSlice";
import {
    setNewServerInfo,
    setUploadFileLocationURL,
    setUploadServerProfileImage,
} from "@/redux/features/serverSlice";
import { handleCreateServer } from "@/handlers/serverHandlers";
import { ModalDialogDescription, ModalDialogShell, ModalDialogTitle } from "./ModalDialogShell";

const DEFAULT_SERVER_AVATAR_URL = "https://cdn.discordapp.com/embed/avatars/0.png";

export function CreateServerDialog({ open }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { newServerInfo, uploadFileLocationURL } = useSelector((state) => state.server);
    const { isLoading } = useSelector((state) => state.load);

    const handleFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        dispatch(setUploadServerProfileImage(file));
        const url = URL.createObjectURL(file);
        dispatch(setUploadFileLocationURL(url));
    };

    const handleCreateServerClick = async () => {
        await handleCreateServer(
            newServerInfo?.serverName
                ? newServerInfo
                : { ...newServerInfo, serverName: `${user?.displayName}'s Server` }
        );
    };

    return (
        <ModalDialogShell open={open} onClose={() => dispatch(setCreateServerFormModal(false))}>
            <ModalDialogTitle className="modal-title">Create a server</ModalDialogTitle>
            <div>
                <ModalDialogDescription className="modal-description">
                    Give your new server a personality with a name and an icon. You can always
                    change it later.
                </ModalDialogDescription>
                <label
                    className={`modal-avatar-uploader ${uploadFileLocationURL ? "has-image" : ""}`}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFile}
                        className="hidden-input"
                    />
                    <AvatarWithStatus
                        alt={newServerInfo?.serverName || `${user?.displayName}'s Server`}
                        src={uploadFileLocationURL || DEFAULT_SERVER_AVATAR_URL}
                        avatarClassName="modal-avatar"
                    />
                    {!uploadFileLocationURL && (
                        <div className="modal-avatar-overlay">
                            <PhotoCameraIcon className="modal-avatar-icon" />
                        </div>
                    )}
                </label>

                <form>
                    <div className="form-control">
                        <label className="modal-input-label input-placeholder">SERVER NAME</label>
                        <div className="sidebar-search">
                            <input
                                className="form-style"
                                id="name"
                                type="text"
                                name="name"
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
                        </div>
                    </div>
                </form>
            </div>
            <div className="modal-actions">
                <button
                    type="button"
                    className="modal-button modal-button-back"
                    onClick={() => dispatch(setCreateServerFormModal(false))}
                >
                    Back
                </button>
                <button
                    type="button"
                    className="modal-button modal-button-contained"
                    disabled={isLoading}
                    onClick={handleCreateServerClick}
                >
                    <span>{isLoading ? "Loading..." : "Create"}</span>
                </button>
            </div>
        </ModalDialogShell>
    );
}
