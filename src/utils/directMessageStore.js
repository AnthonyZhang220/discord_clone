const DM_STORE_KEY = "directMessageStore";

const defaultDirectMessageStore = {
    isFriendListPageOpen: true,
    selectedDirectMessageUserId: "",
};

const normalizeStore = (value) => {
    if (!value || typeof value !== "object") {
        return { ...defaultDirectMessageStore };
    }

    return {
        isFriendListPageOpen:
            typeof value.isFriendListPageOpen === "boolean"
                ? value.isFriendListPageOpen
                : defaultDirectMessageStore.isFriendListPageOpen,
        selectedDirectMessageUserId:
            typeof value.selectedDirectMessageUserId === "string"
                ? value.selectedDirectMessageUserId
                : defaultDirectMessageStore.selectedDirectMessageUserId,
    };
};

export const getDirectMessageStore = () => {
    try {
        const raw = localStorage.getItem(DM_STORE_KEY);
        const parsed = raw ? JSON.parse(raw) : null;
        const normalized = normalizeStore(parsed);

        if (!raw) {
            localStorage.setItem(DM_STORE_KEY, JSON.stringify(normalized));
        }

        return normalized;
    } catch (error) {
        return { ...defaultDirectMessageStore };
    }
};

export const setDirectMessageStore = (partial) => {
    try {
        const current = getDirectMessageStore();
        const next = normalizeStore({ ...current, ...partial });
        localStorage.setItem(DM_STORE_KEY, JSON.stringify(next));
        return next;
    } catch (error) {
        return { ...defaultDirectMessageStore };
    }
};
