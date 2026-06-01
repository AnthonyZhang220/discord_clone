import store from "@/redux/store";
import { db } from "@/firebase";
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    updateDoc,
    writeBatch,
} from "firebase/firestore";
import { setIsLoading } from "@/redux/features/loadSlice";
import { showError } from "@/utils/showError";

const requestDocId = (fromUserId, toUserId) => `${fromUserId}_${toUserId}`;

const getUserDocRef = (userId) => doc(db, "users", userId);

const ensurePrivateChannel = async (userA, userB) => {
    const sorted = [userA, userB].sort();
    const stableId = `${sorted[0]}_${sorted[1]}`;
    const privateChannelRef = doc(db, "privatechannels", stableId);
    const snapshot = await getDoc(privateChannelRef);

    if (!snapshot.exists()) {
        await setDoc(privateChannelRef, {
            memberRef: sorted,
            channelRef: stableId,
            createdAt: serverTimestamp(),
        });
    }
};

const getCurrentUser = () => store.getState().auth.user;

export const sendFriendRequest = async (targetUser) => {
    const user = getCurrentUser();
    const targetUserId = typeof targetUser === "string" ? targetUser : targetUser?.id;

    if (!user?.id || !targetUserId) {
        showError("Friend", "Invalid friend request target.");
        return;
    }

    if (user.id === targetUserId) {
        showError("Friend", "You cannot add yourself as a friend.");
        return;
    }

    store.dispatch(setIsLoading(true));

    try {
        const meRef = getUserDocRef(user.id);
        const targetRef = getUserDocRef(targetUserId);
        const [meDoc, targetDoc] = await Promise.all([getDoc(meRef), getDoc(targetRef)]);

        if (!targetDoc.exists()) {
            showError("Friend", "This user does not exist.");
            return;
        }

        const meData = meDoc.data() || {};
        const targetData = targetDoc.data() || {};

        const myFriends = Array.isArray(meData.friends) ? meData.friends : [];
        if (myFriends.includes(targetUserId)) {
            showError("Friend", "You are already friends.");
            return;
        }

        const myBlocked = Array.isArray(meData.blockedUsers) ? meData.blockedUsers : [];
        if (myBlocked.includes(targetUserId)) {
            showError("Friend", "Unblock this user before sending a friend request.");
            return;
        }

        const targetBlocked = Array.isArray(targetData.blockedUsers) ? targetData.blockedUsers : [];
        if (targetBlocked.includes(user.id)) {
            showError("Friend", "This user is not accepting friend requests.");
            return;
        }

        const outgoingRef = doc(db, "friendRequests", requestDocId(user.id, targetUserId));
        const reverseRef = doc(db, "friendRequests", requestDocId(targetUserId, user.id));

        const [outgoingDoc, reverseDoc] = await Promise.all([
            getDoc(outgoingRef),
            getDoc(reverseRef),
        ]);

        if (outgoingDoc.exists() && outgoingDoc.data()?.status === "pending") {
            showError("Friend", "Friend request already sent.");
            return;
        }

        if (reverseDoc.exists() && reverseDoc.data()?.status === "pending") {
            await acceptFriendRequest(reverseDoc.id);
            return;
        }

        await setDoc(outgoingRef, {
            fromUserId: user.id,
            fromDisplayName: user.displayName || "Unknown",
            fromAvatar: user.avatar || "",
            toUserId: targetUserId,
            toDisplayName: targetData.displayName || "Unknown",
            toAvatar: targetData.avatar || "",
            status: "pending",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        await createFriendNotification(targetUserId, {
            fromUserId: user.id,
            fromDisplayName: user.displayName || "Unknown",
        });
    } catch (error) {
        showError("Friend", error?.message || "Failed to send friend request.");
    } finally {
        store.dispatch(setIsLoading(false));
    }
};

export const acceptFriendRequest = async (requestId) => {
    const user = getCurrentUser();
    if (!user?.id || !requestId) {
        showError("Friend", "Invalid request.");
        return;
    }

    store.dispatch(setIsLoading(true));

    try {
        const requestRef = doc(db, "friendRequests", requestId);
        const requestDoc = await getDoc(requestRef);

        if (!requestDoc.exists()) {
            showError("Friend", "Friend request not found.");
            return;
        }

        const request = requestDoc.data();
        if (request.status !== "pending") {
            return;
        }

        if (request.toUserId !== user.id) {
            showError("Friend", "You cannot accept this request.");
            return;
        }

        const meRef = getUserDocRef(request.toUserId);
        const fromRef = getUserDocRef(request.fromUserId);
        const batch = writeBatch(db);

        batch.update(requestRef, {
            status: "accepted",
            respondedAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        batch.update(meRef, {
            friends: arrayUnion(request.fromUserId),
            blockedUsers: arrayRemove(request.fromUserId),
        });
        batch.update(fromRef, {
            friends: arrayUnion(request.toUserId),
            blockedUsers: arrayRemove(request.toUserId),
        });

        await batch.commit();
        await ensurePrivateChannel(request.fromUserId, request.toUserId);
    } catch (error) {
        showError("Friend", error?.message || "Failed to accept friend request.");
    } finally {
        store.dispatch(setIsLoading(false));
    }
};

export const rejectFriendRequest = async (requestId) => {
    const user = getCurrentUser();
    if (!user?.id || !requestId) {
        showError("Friend", "Invalid request.");
        return;
    }

    store.dispatch(setIsLoading(true));

    try {
        const requestRef = doc(db, "friendRequests", requestId);
        const requestDoc = await getDoc(requestRef);
        if (!requestDoc.exists()) return;

        const request = requestDoc.data();
        if (request.status !== "pending") return;

        if (request.toUserId !== user.id && request.fromUserId !== user.id) {
            showError("Friend", "You cannot reject this request.");
            return;
        }

        await updateDoc(requestRef, {
            status: request.toUserId === user.id ? "rejected" : "canceled",
            respondedAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        showError("Friend", error?.message || "Failed to update friend request.");
    } finally {
        store.dispatch(setIsLoading(false));
    }
};

export const blockUser = async (targetUserId) => {
    const user = getCurrentUser();
    if (!user?.id || !targetUserId) {
        showError("Friend", "Invalid block target.");
        return;
    }

    store.dispatch(setIsLoading(true));

    try {
        const meRef = getUserDocRef(user.id);
        const targetRef = getUserDocRef(targetUserId);
        const incomingReqRef = doc(db, "friendRequests", requestDocId(targetUserId, user.id));
        const outgoingReqRef = doc(db, "friendRequests", requestDocId(user.id, targetUserId));

        const [incomingReqDoc, outgoingReqDoc] = await Promise.all([
            getDoc(incomingReqRef),
            getDoc(outgoingReqRef),
        ]);

        const batch = writeBatch(db);
        batch.update(meRef, {
            blockedUsers: arrayUnion(targetUserId),
            friends: arrayRemove(targetUserId),
        });
        batch.update(targetRef, {
            friends: arrayRemove(user.id),
        });

        if (incomingReqDoc.exists() && incomingReqDoc.data()?.status === "pending") {
            batch.update(incomingReqRef, {
                status: "blocked",
                updatedAt: serverTimestamp(),
            });
        }

        if (outgoingReqDoc.exists() && outgoingReqDoc.data()?.status === "pending") {
            batch.update(outgoingReqRef, {
                status: "blocked",
                updatedAt: serverTimestamp(),
            });
        }

        await batch.commit();
    } catch (error) {
        showError("Friend", error?.message || "Failed to block user.");
    } finally {
        store.dispatch(setIsLoading(false));
    }
};

export const unblockUser = async (targetUserId) => {
    const user = getCurrentUser();
    if (!user?.id || !targetUserId) {
        showError("Friend", "Invalid unblock target.");
        return;
    }

    store.dispatch(setIsLoading(true));

    try {
        await updateDoc(getUserDocRef(user.id), {
            blockedUsers: arrayRemove(targetUserId),
        });
    } catch (error) {
        showError("Friend", error?.message || "Failed to unblock user.");
    } finally {
        store.dispatch(setIsLoading(false));
    }
};

export const createFriendNotification = async (targetUserId, payload = {}) => {
    try {
        await addDoc(collection(db, "notifications"), {
            userId: targetUserId,
            type: "friend_request",
            read: false,
            createdAt: serverTimestamp(),
            ...payload,
        });
    } catch (error) {
        // notification failure should not block request flow
    }
};
