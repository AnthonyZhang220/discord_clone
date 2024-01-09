import { where, collection, query, getDocs, or } from "firebase/firestore";
import { db } from "../../firebase";
import store from "../../redux/store";
import { setQueryFriendList } from "../../redux/features/directMessageSlice";

export const handleSearchFriend = async (e) => {
    e.preventDefault();
    let list = []
    const searchTerm = e.target.value;
    const userRef = collection(db, "users")
    const q = query(userRef, or(where("id", "==", searchTerm), where("displayName", ">=", searchTerm), where("displayName", "<=", searchTerm + "~")))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        list.push(data)
    })

    store.dispatch(setQueryFriendList(list))

}

export const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback(...args);
        }, wait);
    };
}