import { where, collection, query, getDocs, limit } from "firebase/firestore";
import { db } from "@/firebase";
import store from "@/redux/store";
import { setQueryFriendList } from "@/redux/features/directMessageSlice";
import { setIsLoading } from "@/redux/features/loadSlice";
import { showError } from "@/utils/showError";

export const handleSearchFriend = async (searchInput) => {
    // Accepts a raw search string (not an event). Trim and validate before querying.
    const searchTerm = String(searchInput || "").trim();
    // Clear results for empty or too-short queries
    if (!searchTerm) {
        store.dispatch(setQueryFriendList([]));
        return;
    }
    if (searchTerm.length < 2) {
        // avoid querying Firestore for very short inputs
        store.dispatch(setQueryFriendList([]));
        return;
    }

    let list = [];
    const userRef = collection(db, "users");
    store.dispatch(setIsLoading(true));
    try {
        // Run two smaller queries for broader SDK compatibility:
        // 1) exact id match (fast, limit 1)
        // 2) displayName prefix range (limit 20)
        const currentUserId = store.getState().auth.user?.id;

        const idQuery = query(userRef, where("id", "==", searchTerm), limit(1));
        const idSnapshot = await getDocs(idQuery);
        const resultsMap = new Map();
        idSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data?.id && data.id !== currentUserId) resultsMap.set(data.id, data);
        });

        const nameQuery = query(
            userRef,
            where("displayName", ">=", searchTerm),
            where("displayName", "<=", searchTerm + "~"),
            limit(20)
        );
        const nameSnapshot = await getDocs(nameQuery);
        nameSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data?.id && data.id !== currentUserId && !resultsMap.has(data.id)) {
                resultsMap.set(data.id, data);
            }
        });

        // preserve insertion order: id match first, then name matches
        list = Array.from(resultsMap.values());
        store.dispatch(setQueryFriendList(list));
    } catch (error) {
        console.error("Search friend failed:", error);
        showError("Search", error?.message || "Failed to search users.");
    } finally {
        store.dispatch(setIsLoading(false));
    }
};

export const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback(...args);
        }, wait);
    };
};
