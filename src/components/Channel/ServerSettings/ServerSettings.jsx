import React from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AlertDialog } from "radix-ui";
import { toggleServerSettings } from "@/redux/features/popoverSlice";
import { handleInviteToServer, handleDeleteServer } from "@/handlers/serverHandlers";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SettingsIcon from "@mui/icons-material/Settings";
import { useDispatch } from "react-redux";

export default function ServerSettings({ onClose }) {
    const dispatch = useDispatch();
    const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);

    const confirmDeleteServer = React.useCallback(() => {
        handleDeleteServer();
        setConfirmDeleteOpen(false);
        onClose?.();
    }, [onClose]);

    return (
        <>
            <DropdownMenu.Item
                className="user-menu-item"
                onSelect={() => {
                    handleInviteToServer();
                    dispatch(toggleServerSettings());
                    onClose?.();
                }}
            >
                <span className="user-menu-item-label">Invite People</span>
                <PersonAddAlt1Icon className="user-menu-item-icon" />
            </DropdownMenu.Item>

            <DropdownMenu.Item
                className="user-menu-item"
                onSelect={() => {
                    dispatch(toggleServerSettings());
                    onClose?.();
                }}
            >
                <span className="user-menu-item-label">Server Settings</span>
                <SettingsIcon className="user-menu-item-icon" />
            </DropdownMenu.Item>

            <div className="user-menu-divider" />

            <DropdownMenu.Item
                className="user-menu-item user-menu-item--danger"
                onSelect={(event) => {
                    event.preventDefault();
                    setConfirmDeleteOpen(true);
                }}
            >
                <span className="user-menu-item-label">Delete Server</span>
                <DeleteForeverIcon className="user-menu-item-icon" />
            </DropdownMenu.Item>

            <AlertDialog.Root open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
                <AlertDialog.Portal>
                    <AlertDialog.Overlay className="alert-dialog-overlay" />
                    <AlertDialog.Content className="alert-dialog-content modal-paper modal-paper--center">
                        <AlertDialog.Title className="modal-title">
                            Delete Server?
                        </AlertDialog.Title>
                        <AlertDialog.Description className="modal-description">
                            This action cannot be undone. All channels and messages in this server
                            will be permanently deleted.
                        </AlertDialog.Description>
                        <div className="modal-actions">
                            <AlertDialog.Cancel asChild>
                                <button type="button" className="modal-button modal-button-back">
                                    Cancel
                                </button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild>
                                <button
                                    type="button"
                                    className="modal-button modal-button-contained user-menu-item--danger"
                                    onClick={confirmDeleteServer}
                                >
                                    Delete Server
                                </button>
                            </AlertDialog.Action>
                        </div>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>
        </>
    );
}
