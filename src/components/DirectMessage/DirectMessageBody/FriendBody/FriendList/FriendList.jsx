import React, { Fragment, useEffect } from "react";
import { query, collection, where, onSnapshot, doc, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import FriendTab from "@/components/DirectMessage/DirectMessageBody/FriendBody/FriendTab/FriendTab";
import {
    setBlockedIdList,
    setBlockedList,
    setFriendIdList,
    setFriendList,
    setInboxCount,
    setPendingIncomingList,
    setPendingOutgoingList,
} from "@/redux/features/directMessageSlice";
import { useDispatch, useSelector } from "react-redux";
import {
    acceptFriendRequest,
    blockUser,
    rejectFriendRequest,
    unblockUser,
} from "@/handlers/friendHandlers";

import "./FriendList.scss";

const chunkArray = (list, size = 10) => {
    const chunks = [];
    for (let i = 0; i < list.length; i += size) {
        chunks.push(list.slice(i, i + size));
    }
    return chunks;
};

const loadUsersByIds = async (idList) => {
    const uniqueIds = Array.from(new Set((idList || []).filter(Boolean)));
    if (uniqueIds.length === 0) return [];

    const chunks = chunkArray(uniqueIds, 10);
    const snapshots = await Promise.all(
        chunks.map((ids) => getDocs(query(collection(db, "users"), where("id", "in", ids))))
    );

    const users = [];
    snapshots.forEach((snapshot) => {
        snapshot.forEach((docSnap) => {
            const data = docSnap.data() || {};
            users.push({
                displayName: data.displayName,
                avatar: data.avatar,
                status: data.status,
                id: data.id,
            });
        });
    });

    return users;
};

export default function FriendList() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const {
        friendFilter,
        friendList,
        friendIdList,
        pendingIncomingList,
        pendingOutgoingList,
        blockedIdList,
        blockedList,
    } = useSelector((state) => state.directMessage);

    useEffect(() => {
        if (!user?.id) return;

        const userDocRef = doc(db, "users", user.id);
        const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
            const data = snapshot.data() || {};
            dispatch(setFriendIdList(Array.isArray(data.friends) ? data.friends : []));
            dispatch(setBlockedIdList(Array.isArray(data.blockedUsers) ? data.blockedUsers : []));
        });

        return () => {
            unsubscribe();
        };
    }, [user?.id, dispatch]);

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            if (!friendIdList.length) {
                dispatch(setFriendList([]));
                return;
            }

            const list = await loadUsersByIds(friendIdList);
            if (!cancelled) {
                dispatch(setFriendList(list));
            }
        };

        run();

        return () => {
            cancelled = true;
        };
    }, [friendIdList, dispatch]);

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            if (!blockedIdList.length) {
                dispatch(setBlockedList([]));
                return;
            }

            const list = await loadUsersByIds(blockedIdList);
            if (!cancelled) {
                dispatch(setBlockedList(list));
            }
        };

        run();

        return () => {
            cancelled = true;
        };
    }, [blockedIdList, dispatch]);

    useEffect(() => {
        if (!user?.id) return;

        const incomingQuery = query(
            collection(db, "friendRequests"),
            where("toUserId", "==", user.id),
            where("status", "==", "pending")
        );

        const outgoingQuery = query(
            collection(db, "friendRequests"),
            where("fromUserId", "==", user.id),
            where("status", "==", "pending")
        );

        const unsubIncoming = onSnapshot(incomingQuery, (snapshot) => {
            const incoming = [];
            snapshot.forEach((docSnap) => {
                const data = docSnap.data() || {};
                incoming.push({ id: docSnap.id, ...data });
            });

            dispatch(setPendingIncomingList(incoming));
            dispatch(setInboxCount(incoming.length));
        });

        const unsubOutgoing = onSnapshot(outgoingQuery, (snapshot) => {
            const outgoing = [];
            snapshot.forEach((docSnap) => {
                const data = docSnap.data() || {};
                outgoing.push({ id: docSnap.id, ...data });
            });
            dispatch(setPendingOutgoingList(outgoing));
        });

        return () => {
            unsubIncoming();
            unsubOutgoing();
        };
    }, [user?.id, dispatch]);

    const pendingCount = pendingIncomingList.length + pendingOutgoingList.length;
    const onlineCount = friendList.filter((obj) => obj.status !== "offline").length;

    return (
        <div className="friend-list-container">
            <div className="friend-list">
                {friendFilter === "all" ? (
                    <Fragment>
                        <div className="friendlist-header">
                            <span>All - {friendList.length}</span>
                        </div>
                        {friendList.map(({ displayName, status, avatar, id }) => (
                            <FriendTab
                                displayName={displayName}
                                avatar={avatar}
                                id={id}
                                status={status}
                                key={id}
                            />
                        ))}
                    </Fragment>
                ) : friendFilter === "pending" ? (
                    <Fragment>
                        <div className="friendlist-header">
                            <span>Pending - {pendingCount}</span>
                        </div>
                        {pendingIncomingList.map((request) => (
                            <FriendTab
                                key={request.id}
                                id={request.fromUserId}
                                displayName={request.fromDisplayName || request.fromUserId}
                                avatar={request.fromAvatar || ""}
                                status="incoming request"
                                actionType="incoming"
                                onAccept={() => acceptFriendRequest(request.id)}
                                onReject={() => rejectFriendRequest(request.id)}
                            />
                        ))}
                        {pendingOutgoingList.map((request) => (
                            <FriendTab
                                key={request.id}
                                id={request.toUserId}
                                displayName={request.toDisplayName || request.toUserId}
                                avatar={request.toAvatar || ""}
                                status="outgoing request"
                                actionType="outgoing"
                                onCancel={() => rejectFriendRequest(request.id)}
                            />
                        ))}
                    </Fragment>
                ) : friendFilter === "blocked" ? (
                    <Fragment>
                        <div className="friendlist-header">
                            <span>Blocked - {blockedList.length}</span>
                        </div>
                        {blockedList.map(({ displayName, status, avatar, id }) => (
                            <FriendTab
                                key={id}
                                id={id}
                                displayName={displayName}
                                avatar={avatar}
                                status={status || "blocked"}
                                actionType="blocked"
                                onUnblock={() => unblockUser(id)}
                            />
                        ))}
                    </Fragment>
                ) : (
                    <Fragment>
                        <div className="friendlist-header">
                            <span>Online - {onlineCount}</span>
                        </div>
                        {friendList
                            .filter((obj) => obj.status !== "offline")
                            .map(({ displayName, status, avatar, id }) => (
                                <FriendTab
                                    displayName={displayName}
                                    avatar={avatar}
                                    id={id}
                                    status={status}
                                    key={id}
                                    actionType="friend"
                                    onBlock={() => blockUser(id)}
                                />
                            ))}
                    </Fragment>
                )}
            </div>
        </div>
    );
}
