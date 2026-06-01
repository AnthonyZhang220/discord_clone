import React, { useEffect, Fragment, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import UserFooter from "@/components/AccountTray/AccountTray";
import FriendIcon from "@/components/DirectMessage/DirectMessageBody/FriendBody/friend.svg";
import { Tooltip } from "@/components/compat/RadixCompat";

import { onSnapshot, query, collection, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useDispatch, useSelector } from "react-redux";
import SearchBox from "@/components/Search/SearchBox";
import { FRIEND_LIST_DEBOUNCE } from "@/config/searchConfig";
import {
    setIsFriendListPageOpen,
    setDirectMessageChannelList,
    setDirectMessageChannelRefs,
} from "@/redux/features/directMessageSlice";
import { getDirectMessageStore, setDirectMessageStore } from "@/utils/directMessageStore";
import { DirectMessageList } from "./DirectMessageList/DirectMessageList";
import "./DirectMessageMenu.scss";

function DirectMessageMenu() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { directMessageChannelRefs, isFriendListPageOpen, directMessageChannelList } =
        useSelector((state) => state.directMessage);

    useEffect(() => {
        const stored = getDirectMessageStore();
        dispatch(setIsFriendListPageOpen(Boolean(stored.isFriendListPageOpen)));
    }, [dispatch]);

    useEffect(() => {
        if (!user.id) return undefined;

        const q = query(
            collection(db, "privatechannels"),
            where("memberRef", "array-contains", user.id)
        );
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            const pairs = new Map();

            QuerySnapshot.forEach((doc) => {
                const userRef = doc.data().memberRef;
                const channelRef = doc.id;
                const firstUser = userRef[0];
                const secondUser = userRef[1];
                if (firstUser === user.id) {
                    pairs.set(secondUser, channelRef);
                } else if (secondUser === user.id) {
                    pairs.set(firstUser, channelRef);
                }
            });

            const nextRefs = Object.fromEntries(pairs);
            dispatch(setDirectMessageChannelRefs(nextRefs));
        });

        return () => {
            unsubscribe();
        };
    }, [user.id, dispatch]);

    const refsCount = Object.keys(directMessageChannelRefs).length;
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!refsCount) {
            dispatch(setDirectMessageChannelList([]));
            return undefined;
        }

        const userArr = Object.keys(directMessageChannelRefs);
        const q = query(collection(db, "users"), where("id", "in", userArr));
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            const dmList = [];
            QuerySnapshot.forEach((doc) => {
                dmList.push(doc.data());
            });
            dispatch(setDirectMessageChannelList(dmList));
        });

        return () => {
            unsubscribe();
        };
    }, [refsCount, directMessageChannelRefs, dispatch]);

    return (
        <aside className="friend-container">
            <header className="friend-header focusable">
                <SearchBox
                    placeholder="Find or start a conversation"
                    onSearch={(v) => setSearch(v)}
                    debounceMs={FRIEND_LIST_DEBOUNCE}
                    noResultsText={null}
                />
            </header>
            <section className="friend-menu-container">
                <div className={`friend-menu-item ${isFriendListPageOpen ? "active" : ""}`}>
                    <button
                        type="button"
                        className="friend-menu-open"
                        onClick={() => {
                            dispatch(setIsFriendListPageOpen(true));
                            setDirectMessageStore({
                                isFriendListPageOpen: true,
                                selectedDirectMessageUserId: "",
                            });
                        }}
                    >
                        <FriendIcon className="friend-menu-icon" aria-hidden="true" />
                        <div className="friend-menu-item-text">Friends</div>
                    </button>
                </div>
                <header className="friend-menu-header focusable">
                    <span>Direct Messages</span>
                    <div className="friend-menu-right">
                        <Tooltip
                            title={
                                <Fragment>
                                    <span className="friend-menu-tooltip-text">Create DM</span>
                                </Fragment>
                            }
                            placement="top"
                        >
                            <AddIcon />
                        </Tooltip>
                    </div>
                </header>
                <ul className="friend-menu-conversation channel-list-text">
                    {directMessageChannelList
                        ?.filter((u) => {
                            if (!search) return true;
                            return String(u.displayName || "")
                                .toLowerCase()
                                .includes(search.toLowerCase());
                        })
                        .map(({ displayName, avatar, id, status, createdAt }) => (
                            <DirectMessageList
                                key={id}
                                id={id}
                                displayName={displayName}
                                avatar={avatar}
                                status={status}
                                createdAt={createdAt}
                            />
                        ))}
                </ul>
            </section>
            <UserFooter />
        </aside>
    );
}
export default DirectMessageMenu;
