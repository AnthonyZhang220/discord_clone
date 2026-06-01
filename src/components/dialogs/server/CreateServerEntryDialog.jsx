import React from "react";
import PublicIcon from "@mui/icons-material/Public";
import { NavigateNext } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import {
    setCreateServerFormModal,
    setCreateServerModal,
    setJoinServerModal,
} from "@/redux/features/modalSlice";
import { ModalDialogDescription, ModalDialogShell, ModalDialogTitle } from "./ModalDialogShell";

export function CreateServerEntryDialog({ open }) {
    const dispatch = useDispatch();

    return (
        <ModalDialogShell open={open} onClose={() => dispatch(setCreateServerModal(false))}>
            <ModalDialogTitle className="modal-title">Create a server</ModalDialogTitle>
            <div>
                <ModalDialogDescription className="modal-description">
                    Your server is where you and your friends hang out. Make yours and start
                    talking.
                </ModalDialogDescription>
                <button
                    type="button"
                    className="modal-listitem-button"
                    onClick={() => dispatch(setCreateServerFormModal(true))}
                >
                    <PublicIcon />
                    <div className="modal-listitem-text">Create My Own</div>
                    <NavigateNext edge="end" />
                </button>
            </div>
            <div className="modal-actions modal-actions--column">
                <p className="modal-heading">Have an invite already?</p>
                <button
                    type="button"
                    className="modal-button modal-button-contained"
                    onClick={() => dispatch(setJoinServerModal(true))}
                >
                    Join a Server
                </button>
            </div>
        </ModalDialogShell>
    );
}
