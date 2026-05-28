import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "@/redux/features/errorSlice";

function Error() {
    const dispatch = useDispatch();
    const { error } = useSelector((state) => state.error);

    useEffect(() => {
        if (!error) return;
        const timer = window.setTimeout(() => dispatch(setError(null)), 5000);
        return () => window.clearTimeout(timer);
    }, [dispatch, error]);

    const handleClose = () => {
        dispatch(setError(null));
    };

    if (!error) {
        return null;
    }

    return (
        <div
            role="alert"
            aria-live="assertive"
            style={{
                position: "fixed",
                top: 16,
                right: 16,
                zIndex: 1500,
                minWidth: 280,
                borderRadius: 12,
                backgroundColor: "rgba(200, 40, 40, 0.95)",
                color: "white",
                padding: "16px 18px",
                boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
                fontFamily: "Inter, system-ui, sans-serif",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <strong style={{ fontSize: 16 }}>{error.type}</strong>
                <button
                    onClick={handleClose}
                    aria-label="Close error"
                    style={{
                        marginLeft: 12,
                        border: "none",
                        background: "transparent",
                        color: "white",
                        cursor: "pointer",
                        fontSize: 18,
                        lineHeight: 1,
                    }}
                >
                    ×
                </button>
            </div>
            <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.5 }}>{error.reason}</div>
        </div>
    );
}

export default Error;
