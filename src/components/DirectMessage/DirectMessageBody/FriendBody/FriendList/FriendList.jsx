import React, { Fragment, useEffect } from "react";
import { List, Typography } from "@mui/material";
import { query, collection, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import FriendTab from "@/components/DirectMessage/DirectMessageBody/FriendBody/FriendTab/FriendTab";
import { setFriendIdList, setFriendList } from "@/redux/features/directMessageSlice";
import { useDispatch, useSelector } from "react-redux";

import "./FriendList.scss";

export default function FriendList() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { friendFilter, friendList, friendIdList } = useSelector((state) => state.directMessage);

    useEffect(() => {
        if (user.id) {
            // const docRef = doc(collectionRef, user.uid)
            const docRef = query(collection(db, "users"), where("id", "==", user.id));

            onSnapshot(docRef, (QuerySnapshot) => {
                let data = [];
                QuerySnapshot.forEach((doc) => {
                    data = doc.data().friends;
                });
                dispatch(setFriendIdList(data));
            });

            // return unsub
        }
    }, [user.id, dispatch]);
    //get user's friend list
    useEffect(() => {
        if (friendIdList.length > 0) {
            const q = query(collection(db, "users"), where("id", "in", friendIdList));
            onSnapshot(q, (snapshot) => {
                const friendList = [];
                snapshot.forEach((doc) => {
                    friendList.push({
                        displayName: doc.data().displayName,
                        avatar: doc.data().avatar,
                        status: doc.data().status,
                        id: doc.data().id,
                    });
                });
                dispatch(setFriendList(friendList));
            });
            // return unsubscribe
        }
    }, [friendIdList, dispatch]);

    return (
        <div className="friend-list-container">
            <List dense>
                {friendFilter == "all" ? (
                    <Fragment>
                        <div className="friendlist-header">
                            <Typography variant="h6">All - {friendList.length}</Typography>
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
                ) : (
                    <Fragment>
                        <div className="friendlist-header">
                            <Typography variant="h6">
                                Online -{" "}
                                {friendList.filter((obj) => obj.status !== "offline").length}
                            </Typography>
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
                                />
                            ))}
                    </Fragment>
                )}
            </List>
        </div>
    );
}
