import store from "@/redux/store";
import { setSelectedChannel, setSelectedServer } from "@/redux/features/userSelectStoreSlice";

export const getSelectStore = () => {
    try {
        const raw = localStorage.getItem("userSelectStore");
        const userSelectStore = raw ? JSON.parse(raw) : null;

        if (!userSelectStore || typeof userSelectStore !== "object") {
            const defaultStore = {
                selectedServerId: "",
                selectedChannelIds: {},
            };
            localStorage.setItem("userSelectStore", JSON.stringify(defaultStore));
            store.dispatch(setSelectedServer(""));
            store.dispatch(setSelectedChannel(""));
            return;
        }

        const defaultServerId = userSelectStore.selectedServerId || "";
        const defaultChannelId = (userSelectStore.selectedChannelIds || {})[defaultServerId] || "";

        store.dispatch(setSelectedServer(defaultServerId));
        store.dispatch(setSelectedChannel(defaultChannelId));
    } catch (e) {
        // if parsing fails, reset to safe defaults
        try {
            localStorage.removeItem("userSelectStore");
        } catch (err) {
            // ignore
        }
        store.dispatch(setSelectedServer(""));
        store.dispatch(setSelectedChannel(""));
    }
};
