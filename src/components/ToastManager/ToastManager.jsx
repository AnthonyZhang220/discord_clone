import React from "react";
import * as Toast from "@radix-ui/react-toast";
import { useSelector } from "react-redux";
import { clearError } from "@/utils/showError";
import "./ToastManager.scss";

function ToastManager() {
    const error = useSelector((state) => state.error.error);
    const isLoading = useSelector((state) => state.load.isLoading);

    return (
        <Toast.Provider swipeDirection="right">
            <Toast.Viewport className="toast-viewport" />
            <Toast.Root
                open={isLoading}
                className="toast-root toast-root--loading"
                duration={30000}
                aria-live="polite"
            >
                <div className="toast-body">
                    <div className="toast-icon" aria-hidden="true" />
                    <div>
                        <Toast.Title className="toast-title">Loading</Toast.Title>
                        <Toast.Description className="toast-description">
                            Please wait while the request completes.
                        </Toast.Description>
                    </div>
                </div>
            </Toast.Root>

            <Toast.Root
                open={Boolean(error)}
                onOpenChange={(open) => {
                    if (!open) {
                        clearError();
                    }
                }}
                className="toast-root toast-root--error"
            >
                <Toast.Title className="toast-title">{error?.type || "Error"}</Toast.Title>
                <Toast.Description className="toast-description">
                    {error?.reason || "An unknown error occurred."}
                </Toast.Description>
                <Toast.Action className="toast-action" asChild altText="Dismiss">
                    <button type="button">Dismiss</button>
                </Toast.Action>
            </Toast.Root>
        </Toast.Provider>
    );
}

export default ToastManager;
