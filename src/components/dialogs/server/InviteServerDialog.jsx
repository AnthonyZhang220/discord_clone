import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInviteModal } from "@/redux/features/modalSlice";
import { ModalDialogShell, ModalDialogTitle } from "./ModalDialogShell";

export function InviteServerDialog({ open }) {
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const dispatch = useDispatch();
    const { currServer } = useSelector((state) => state.server);
    const { selectedServer } = useSelector((state) => state.userSelectStore);
    const serverId = currServer?.id || selectedServer || "";

    const copyToClip = () => {
        if (!serverId) return;
        setLoading(true);
        navigator.clipboard
            .writeText(serverId)
            .then(() => {
                setCopied(true);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <ModalDialogShell open={open} onClose={() => dispatch(setInviteModal(false))} align="start">
            <ModalDialogTitle className="modal-title">
                Invite friends to {currServer?.name || "this server"}
            </ModalDialogTitle>
            <div>
                <form>
                    <div className="form-control">
                        <label className="modal-input-label input-placeholder">
                            SERVER ID (SHARE WITH FRIENDS)
                        </label>
                        <div className="input-adornment-wrapper">
                            <input
                                className="modal-input-base form-style"
                                id="server-id"
                                name="server-id"
                                autoComplete="off"
                                value={serverId}
                                readOnly
                            />
                            <button
                                type="button"
                                className="modal-button modal-button-contained modal-button-copy"
                                onClick={copyToClip}
                                disabled={loading || !serverId}
                            >
                                {copied ? <span>Copied!</span> : <span>Copy</span>}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </ModalDialogShell>
    );
}
