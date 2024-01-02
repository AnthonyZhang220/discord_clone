import store from "../redux/store";
import { setSelectedChannel, setSelectedServer } from "../redux/features/userSelectStoreSlice";


export const getSelectStore = () => {
    const storedData = localStorage.getItem("userSelectStore");
    const userSelectStore = JSON.parse(storedData)

    if (!userSelectStore) {
        //if user not in the storage, add to the local storage
        const store = {
            selectedServerId: "",
            selectedChannelIds: {},
        }
        const updatedUserSelectStore = JSON.stringify(store);
        localStorage.setItem("userSelectStore", updatedUserSelectStore);
        store.dispatch(setSelectedServer(""))
        store.dispatch(setSelectedChannel(""))
    } else {
        const defaultServerId = userSelectStore.selectedServerId;
        const defaultChannelId = userSelectStore[defaultServerId]
        store.dispatch(setSelectedServer(defaultServerId))
        store.dispatch(setSelectedChannel(defaultChannelId))
    }
}

