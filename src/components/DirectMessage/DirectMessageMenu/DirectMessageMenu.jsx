import React, { useEffect, Fragment } from "react";

import { Typography, SvgIcon, ListItem, ListItemButton, ListItemText } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import UserFooter from "@/components/Channel/UserFooter/UserFooter";
import FriendIcon from "@/components/DirectMessage/DirectMessageBody/FriendBody/friend.svg";
import { FunctionTooltip } from "@/components/CustomUIComponents";

import { onSnapshot, query, collection, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useDispatch, useSelector } from "react-redux";
import {
    setIsFriendListPageOpen,
    setDirectMessageChannelList,
    setDirectMessageChannelRefs,
} from "@/redux/features/directMessageSlice";
import { DirectMessageList } from "./DirectMessageList/DirectMessageList";
import "./DirectMessageMenu.scss";

function DirectMessageMenu() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { directMessageChannelRefs, isFriendListPageOpen, directMessageChannelList } =
        useSelector((state) => state.directMessage);

    useEffect(() => {
        if (user.id) {
            const q = query(
                collection(db, "privatechannels"),
                where("memberRef", "array-contains", user.id)
            );
            let data = {};
            onSnapshot(q, (QuerySnapshot) => {
                QuerySnapshot.forEach((doc) => {
                    const userRef = doc.data().memberRef;
                    const channelRef = doc.id;
                    const firstUser = userRef[0];
                    const secondUser = userRef[1];
                    if (firstUser === user.id) {
                        data[secondUser] = channelRef;
                    } else if (secondUser === user.id) {
                        data[firstUser] = channelRef;
                    }
                });
                dispatch(setDirectMessageChannelRefs(data));
            });
        }
    }, [user.id, dispatch]);

    const refsCount = Object.keys(directMessageChannelRefs).length;

    useEffect(() => {
        if (refsCount) {
            let userArr = [];
            for (const key in directMessageChannelRefs) {
                userArr.push(key);
            }
            const q = query(collection(db, "users"), where("id", "in", userArr));
            onSnapshot(q, (QuerySnapshot) => {
                let dmList = [];
                QuerySnapshot.forEach((doc) => {
                    dmList.push(doc.data());
                });
                dispatch(setDirectMessageChannelList(dmList));
            });
        }
    }, [refsCount, directMessageChannelRefs, dispatch]);

    return (
        <aside className="friend-container">
            <header className="friend-header focusable">
                <input
                    placeholder="Find or start a conversation"
                    required={true}
                    name="search"
                    className="form-style"
                    autoComplete="off"
                />
            </header>
            <section className="friend-menu-container">
                <ListItem disablePadding>
                    <ListItemButton
                        className={`friend-menu-open ${isFriendListPageOpen ? "friend-menu-open--active" : ""}`}
                        onClick={() => dispatch(setIsFriendListPageOpen(true))}
                    >
                        <SvgIcon edge="start" component={FriendIcon} className="friend-menu-icon" />
                        <ListItemText primary="Friends" />
                    </ListItemButton>
                </ListItem>
                <header className="friend-menu-header focusable">
                    <div>
                        <Typography component="h6" variant="h6">
                            Direct Messages
                        </Typography>
                    </div>
                    <div className="friend-menu-right">
                        <FunctionTooltip
                            title={
                                <Fragment>
                                    <Typography
                                        variant="body1"
                                        className="friend-menu-tooltip-text"
                                    >
                                        Create DM
                                    </Typography>
                                </Fragment>
                            }
                            placement="top"
                        >
                            <AddIcon />
                        </FunctionTooltip>
                    </div>
                </header>
                <ul className="friend-menu-conversation">
                    {directMessageChannelList?.map(
                        ({ displayName, avatar, id, status, createdAt }) => (
                            <DirectMessageList
                                key={id}
                                id={id}
                                displayName={displayName}
                                avatar={avatar}
                                status={status}
                                createdAt={createdAt}
                            />
                        )
                    )}
                </ul>
            </section>
            <UserFooter />
        </aside>
    );
}
export default DirectMessageMenu;
