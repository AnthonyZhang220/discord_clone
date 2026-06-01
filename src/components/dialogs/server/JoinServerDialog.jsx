import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setJoinServerModal } from "@/redux/features/modalSlice";
import { setJoinServerId } from "@/redux/features/serverSlice";
import { handleJoinServer } from "@/handlers/serverHandlers";
import { ModalDialogDescription, ModalDialogShell, ModalDialogTitle } from "./ModalDialogShell";

export function JoinServerDialog({ open }) {
    const dispatch = useDispatch();
    const { joinServerId } = useSelector((state) => state.server);

    return (
        <ModalDialogShell open={open} onClose={() => dispatch(setJoinServerModal(false))}>
            <ModalDialogTitle className="modal-title">Join a Server</ModalDialogTitle>
            <div>
                <ModalDialogDescription className="modal-description">
                    Enter an invite below to join an existing server
                </ModalDialogDescription>
                <form>
                    <div className="form-control">
                        <label className="modal-input-label input-placeholder">Invite ID</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            autoComplete="off"
                            className="form-style"
                            onChange={(e) => dispatch(setJoinServerId(e.target.value))}
                            placeholder="Server ID"
                        />
                    </div>
                </form>
            </div>
            <div className="modal-actions">
                <button
                    type="button"
                    className="modal-button modal-button-back"
                    onClick={() => dispatch(setJoinServerModal(false))}
                >
                    Back
                </button>
                <button
                    type="button"
                    className="modal-button modal-button-contained"
                    onClick={() => handleJoinServer(joinServerId)}
                >
                    Join Server
                </button>
            </div>
        </ModalDialogShell>
    );
}
