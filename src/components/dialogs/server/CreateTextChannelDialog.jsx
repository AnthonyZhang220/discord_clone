import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCreateChannelModal } from "@/redux/features/modalSlice";
import { setNewChannelInfo } from "@/redux/features/channelSlice";
import { handleCreateChannel } from "@/handlers/channelHandlers";
import { ModalDialogShell, ModalDialogTitle } from "./ModalDialogShell";

export function CreateTextChannelDialog({ open }) {
    const dispatch = useDispatch();
    const { newChannelInfo } = useSelector((state) => state.channel);
    const { isLoading } = useSelector((state) => state.load);

    return (
        <ModalDialogShell
            open={open}
            onClose={() => dispatch(setCreateChannelModal(false))}
            align="start"
        >
            <ModalDialogTitle className="modal-title">Create Text Channel</ModalDialogTitle>
            <div>
                <form>
                    <div className="form-control">
                        <label className="modal-input-label input-placeholder">CHANNEL NAME</label>
                        <div className="sidebar-search">
                            <input
                                className="modal-input-base form-style"
                                id="name"
                                name="name"
                                autoComplete="off"
                                onChange={(e) =>
                                    dispatch(setNewChannelInfo({ channelName: e.target.value }))
                                }
                                placeholder="new-channel"
                            />
                        </div>
                    </div>
                </form>
            </div>
            <div className="modal-actions">
                <button
                    type="button"
                    className="modal-button modal-button-back"
                    onClick={() => dispatch(setCreateChannelModal(false))}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="modal-button modal-button-contained"
                    disabled={isLoading}
                    onClick={() => handleCreateChannel(newChannelInfo)}
                >
                    <span>{isLoading ? "Loading..." : "Create Channel"}</span>
                </button>
            </div>
        </ModalDialogShell>
    );
}
