import store from "@/redux/store";
import {
    updateDoc,
    collection,
    Timestamp,
    arrayUnion,
    doc,
    query,
    where,
    getDocs,
    deleteDoc,
    writeBatch,
} from "firebase/firestore";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { storage, db } from "@/firebase";

const DEFAULT_SERVER_AVATAR_URL = "https://cdn.discordapp.com/embed/avatars/0.png";
import {
    setNewServerInfo,
    setCurrServer,
    setUploadServerProfileImage,
} from "@/redux/features/serverSlice";
import { setIsLoading } from "@/redux/features/loadSlice";
import { setSelectedChannel, setSelectedServer } from "@/redux/features/userSelectStoreSlice";
import { setIsDirectMessagePageOpen } from "@/redux/features/directMessageSlice";
import {
    setCreateServerFormModal,
    setCreateServerModal,
    setInviteModal,
} from "@/redux/features/modalSlice";
import { toggleServerSettings } from "@/redux/features/popoverSlice";
import { setCurrChannelList } from "@/redux/features/channelSlice";
import { showError } from "@/utils/showError";
// userSelectStore
// {
// selectedServerId: "",
// selectedChannelIds: {
// serverId: channelId
// }
// }

export const handleSelectServer = (serverName, serverId) => {
    try {
        const raw = localStorage.getItem("userSelectStore");
        const userSelectStore = raw
            ? JSON.parse(raw)
            : { selectedServerId: "", selectedChannelIds: {} };

        if (
            !userSelectStore.selectedChannelIds ||
            typeof userSelectStore.selectedChannelIds !== "object"
        ) {
            userSelectStore.selectedChannelIds = {};
        }

        const getDefaultChannelId = userSelectStore.selectedChannelIds[serverId] || "";

        // ensure key exists
        if (userSelectStore.selectedChannelIds[serverId] === undefined) {
            userSelectStore.selectedChannelIds[serverId] = "";
        }

        userSelectStore.selectedServerId = serverId;
        localStorage.setItem("userSelectStore", JSON.stringify(userSelectStore));

        store.dispatch(setIsDirectMessagePageOpen(false));
        store.dispatch(setSelectedServer(serverId));
        store.dispatch(setSelectedChannel(getDefaultChannelId));
        store.dispatch(setCurrServer({ name: serverName, id: serverId }));
    } catch (e) {
        // fallback in case localStorage fails
        store.dispatch(setIsDirectMessagePageOpen(false));
        store.dispatch(setSelectedServer(serverId));
        store.dispatch(setSelectedChannel(""));
        store.dispatch(setCurrServer({ name: serverName, id: serverId }));
    }
};

//add new Server with handleUploadServerImage();
export const handleCreateServer = async (newServerInfo) => {
    store.dispatch(setIsLoading(true));
    // Validate input
    const user = store.getState().auth.user;
    const file = store.getState().server.uploadServerProfileImage;
    const name =
        newServerInfo && newServerInfo.serverName ? String(newServerInfo.serverName).trim() : "";

    if (!user) {
        store.dispatch(setIsLoading(false));
        showError("Auth", "No authenticated user found.");
        return { success: false, reason: "no-user" };
    }

    // enforce a sensible fallback name
    const serverName = name || `${user.displayName || user.id}'s Server`;

    const avatarUrl = file ? null : DEFAULT_SERVER_AVATAR_URL;
    let url = avatarUrl;

    try {
        if (file) {
            // file metadata
            const metadata = { contentType: file.type || "image/*" };
            const timeString = new Date().toISOString();

            // storage path
            const serverProfilePath = `serverProfile/${user.id}/${file.name.replace(/[^a-zA-Z0-9_.-]/g, "_")}-${timeString}`;

            // upload image
            const uploadSnapshot = await uploadBytes(
                ref(storage, serverProfilePath),
                file,
                metadata
            );
            url = await getDownloadURL(uploadSnapshot.ref);
        }

        // create server and channel atomically using a batch
        const serverRef = doc(collection(db, "servers"));
        const channelRef = doc(collection(db, "channels"));
        const batch = writeBatch(db);

        batch.set(serverRef, {
            avatar: url,
            name: serverName,
            ownerId: user.id,
            createdAt: Timestamp.fromDate(new Date()),
            members: [user.id],
        });

        batch.set(channelRef, {
            name: "general",
            serverRef: serverRef.id,
            createdAt: Timestamp.fromDate(new Date()),
            messages: [],
        });

        await batch.commit();

        // update local UI state
        store.dispatch(setNewServerInfo({ serverName: "", serverPic: "" }));
        store.dispatch(setUploadServerProfileImage(null));
        store.dispatch(setCreateServerFormModal(false));
        store.dispatch(setCreateServerModal(false));
        store.dispatch(setIsLoading(false));

        return { success: true, serverId: serverRef.id };
    } catch (error) {
        // Log and map common Firebase errors to user friendly messages
        console.error("Create server failed:", error);
        if (
            error?.code === "storage/quota-exceeded" ||
            (error?.message && error.message.includes("quota"))
        ) {
            showError("Storage", "Firebase Storage quota exceeded. Unable to upload server image.");
        } else if (
            error?.code === "storage/unauthorized" ||
            (error?.message && error.message.includes("permission"))
        ) {
            showError("Storage", "Unauthorized to upload image. Check Firebase Storage rules.");
        } else {
            showError("Server", error?.message || "Failed to create server. Please try again.");
        }
        store.dispatch(setIsLoading(false));
        return { success: false, reason: error?.code || "unknown" };
    }
};

export const handleJoinServer = async (serverId) => {
    store.dispatch(setIsLoading(true));
    try {
        const updateRef = doc(db, "servers", serverId);
        const user = store.getState().auth.user;

        if (!user || !user.id) {
            throw new Error("No authenticated user found.");
        }

        await updateDoc(updateRef, {
            members: arrayUnion(user.id),
        });
    } catch (error) {
        console.error("Join server failed:", error);
        showError("Server", error?.message || "Failed to join server.");
    } finally {
        store.dispatch(setIsLoading(false));
    }
};

export const handleDeleteServer = async () => {
    store.dispatch(setIsLoading(true));

    try {
        const selectedServer = store.getState().userSelectStore.selectedServer;
        const serverRef = doc(db, "servers", selectedServer);
        const channelRef = query(
            collection(db, "channels"),
            where("serverRef", "==", selectedServer)
        );
        const messageRef = query(
            collection(db, "messages"),
            where("serverRef", "==", selectedServer)
        );

        const messageSnapshot = await getDocs(messageRef);
        messageSnapshot.forEach((doc) => {
            deleteDoc(doc.ref);
        });

        const channelSnapshot = await getDocs(channelRef);
        channelSnapshot.forEach((doc) => {
            deleteDoc(doc.ref);
        });
        store.dispatch(setCurrChannelList([]));

        await deleteDoc(serverRef);
        store.dispatch(setCurrServer({ name: "", id: "" }));
        store.dispatch(toggleServerSettings());
    } catch (error) {
        console.error("Delete server failed:", error);
        showError("Server", error?.message || "Failed to delete server.");
    } finally {
        store.dispatch(setIsLoading(false));
    }
};

export const handleInviteToServer = () => {
    store.dispatch(setInviteModal(true));
};
