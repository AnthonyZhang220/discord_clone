
export const getSelectStore = (userId) => {
    //if user not in the storage, add to the local storage
    if (!localStorage.getItem(`${userId}`)) {
        localStorage.setItem(`${userId}`, JSON.stringify({ selectedChannelId: "", selectedChannelIds: {} }));
    } else {
        const storage = JSON.parse(localStorage.getItem(`${userId}`))
        return storage
    }
}