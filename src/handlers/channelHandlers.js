import store from "@/redux/store";
import { setNewChannelInfo, setCurrChannel } from "@/redux/features/channelSlice";
import { setSelectedChannel } from "@/redux/features/userSelectStoreSlice";
import {
    setIsFriendListPageOpen,
    setCurrDirectMessageChannelRef,
    setCurrDirectMessageChannel,
} from "@/redux/features/directMessageSlice";
import { db } from "@/firebase";
import { doc, getDoc, addDoc, Timestamp, collection } from "firebase/firestore";
import { setIsVoiceChatPageOpen } from "@/redux/features/voiceChatSlice";
import { setIsLoading } from "@/redux/features/loadSlice";
import { setCreateChannelModal, setCreateVoiceChannelModal } from "@/redux/features/modalSlice";
import { showError } from "@/utils/showError";
import { setDirectMessageStore } from "@/utils/directMessageStore";

export const handleCreateChannel = async (newChannelInfo) => {
    store.dispatch(setIsLoading(true));
    try {
        const created = await addDoc(collection(db, "channels"), {
            name: newChannelInfo.channelName,
            serverRef: store.getState().userSelectStore.selectedServer,
            createdAt: Timestamp.fromDate(new Date()),
            messages: [],
        });
        if (created) {
            store.dispatch(setNewChannelInfo({ channelName: "" }));
            store.dispatch(setCreateChannelModal(false));
        }
    } catch (error) {
        console.error("Create channel failed:", error);
        showError("Channel", error?.message || "Failed to create channel.");
    } finally {
        store.dispatch(setIsLoading(false));
    }
};

export const handleCreateVoiceChannel = async (newChannelInfo) => {
    store.dispatch(setIsLoading(true));
    try {
        const created = await addDoc(collection(db, "voicechannels"), {
            name: newChannelInfo.channelName,
            serverRef: store.getState().userSelectStore.selectedServer,
            createdAt: Timestamp.fromDate(new Date()),
            participants: [],
        });
        if (created) {
            store.dispatch(setNewChannelInfo({ channelName: "" }));
            store.dispatch(setCreateVoiceChannelModal(false));
        }
    } catch (error) {
        console.error("Create voice channel failed:", error);
        showError("Channel", error?.message || "Failed to create voice channel.");
    } finally {
        store.dispatch(setIsLoading(false));
    }
};

export const handleCurrDirectMessageChannel = async (
    userId,
    status,
    displayName,
    avatar,
    createdAt
) => {
    setDirectMessageStore({
        isFriendListPageOpen: false,
        selectedDirectMessageUserId: userId || "",
    });

    store.dispatch(setIsLoading(true));
    store.dispatch(
        setCurrDirectMessageChannel({
            id: userId,
            status: status,
            displayName: displayName,
            avatar: avatar,
            createdAt: createdAt,
        })
    );

    try {
        const privateChannels = store.getState().directMessage.directMessageChannelRefs;
        const channelRef = doc(db, "privatechannels", privateChannels[userId]);
        const channelDoc = await getDoc(channelRef);
        const ref = channelDoc?.data()?.channelRef;
        if (ref) store.dispatch(setCurrDirectMessageChannelRef(ref));
    } catch (error) {
        console.error("Fetch direct message channel failed:", error);
        showError("DirectMessage", error?.message || "Failed to open direct message channel.");
    } finally {
        store.dispatch(setIsFriendListPageOpen(false));
        store.dispatch(setIsLoading(false));
    }
};

export const handleSelectChannel = (channelName, channelId) => {
    try {
        const raw = localStorage.getItem("userSelectStore");
        const userSelectStore = raw
            ? JSON.parse(raw)
            : { selectedServerId: "", selectedChannelIds: {} };
        const selectedServer = store.getState().userSelectStore.selectedServer;

        if (
            !userSelectStore.selectedChannelIds ||
            typeof userSelectStore.selectedChannelIds !== "object"
        ) {
            userSelectStore.selectedChannelIds = {};
        }

        userSelectStore.selectedChannelIds[selectedServer] = channelId;

        localStorage.setItem("userSelectStore", JSON.stringify(userSelectStore));
    } catch (e) {
        // ignore localStorage failures
    }

    store.dispatch(setIsVoiceChatPageOpen(false));
    store.dispatch(setSelectedChannel(channelId));
    store.dispatch(setCurrChannel({ name: channelName, id: channelId }));
};
