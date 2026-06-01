import store from "@/redux/store";
import { setError } from "@/redux/features/errorSlice";

export function showError(type, reason, { log = true } = {}) {
    const payload = {
        type: String(type || "Error"),
        reason:
            reason && reason.message ? String(reason.message) : String(reason || "Unknown error"),
    };

    if (log) {
        // keep console error for debugging
        // eslint-disable-next-line no-console
        console.error("showError:", payload, reason);
    }

    store.dispatch(setError(payload));
}

export function clearError() {
    store.dispatch(setError(null));
}

export default showError;
