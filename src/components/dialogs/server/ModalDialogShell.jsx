import React from "react";
import * as Dialog from "@radix-ui/react-dialog";

export function ModalDialogShell({ open, onClose, align = "center", className = "", children }) {
    const handleOpenChange = (isOpen) => {
        if (!isOpen && onClose) {
            onClose();
        }
    };

    const alignClass = align === "start" ? "modal-paper--start" : "modal-paper--center";

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="modal-dialog-overlay" />
                <Dialog.Content
                    className={`modal-dialog-content modal-paper ${alignClass} ${className}`.trim()}
                >
                    {children}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export const ModalDialogTitle = Dialog.Title;
export const ModalDialogDescription = Dialog.Description;
