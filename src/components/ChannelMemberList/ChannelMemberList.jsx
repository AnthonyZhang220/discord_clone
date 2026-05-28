import React, { useState, useRef, useEffect } from "react";
import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Avatar,
    Badge,
    ListSubheader,
} from "@mui/material";

import { doc, getDoc, onSnapshot, query, collection, where } from "firebase/firestore";
import { db } from "@/firebase";
import StatusList from "@/components/StatusList";
import { useDispatch, useSelector } from "react-redux";
import { MemberDetailPopover } from "./MemberDetailPopover/MemberDetailPopover";
import { setMemberList, setMemberDetail } from "@/redux/features/memberListSlice";

import "./ChannelMemberList.scss";
import { setMemberDetailPopover } from "@/redux/features/popoverSlice";

function ChannelMemberList() {
    const dispatch = useDispatch();
    const { selectedServer } = useSelector((state) => state.userSelectStore);
    const { memberList } = useSelector((state) => state.memberList);
    const memberRefs = useRef({});
    const [memberRef, setMemberRef] = useState(null);

    useEffect(() => {
        if (selectedServer) {
            (async () => {
                const serverRef = doc(db, "servers", selectedServer);
                const serverDoc = await getDoc(serverRef);
                const memberIds = serverDoc.data().members;

                const q = query(collection(db, "users"), where("id", "in", memberIds));
                onSnapshot(q, (QuerySnapshot) => {
                    let fetchedMemberList = [];
                    QuerySnapshot.forEach((doc) => {
                        fetchedMemberList.push(doc.data());
                    });
                    dispatch(setMemberList(fetchedMemberList));
                });

                setMemberRef(memberIds);
            })();
        }
    }, [selectedServer, dispatch]);

    const handleOpenMemberDetail = (memberId) => {
        const currentMemberDetail = memberList.find((member) => member.id === memberId);
        dispatch(setMemberDetail(currentMemberDetail));

        const clickedMemberRefs = memberRefs.current[memberId];

        setMemberRef(clickedMemberRefs);
        dispatch(setMemberDetailPopover(true));
    };

    const online = (status) => {
        if (status === "online" || status === "idle" || status === "donotdisturb") {
            return true;
        } else {
            return false;
        }
    };

    return (
        <div className="userstatus-container">
            <aside className="userstatus-memberlist-wrapper">
                <div className="userstatus-memberlist">
                    <header className="userstatus-online focusable">
                        {memberList.find((member) => online(member.status) === true) ? (
                            <List
                                subheader={
                                    <ListSubheader component="div" className="member-subheader">
                                        Online -{" "}
                                        {
                                            memberList?.filter(
                                                (member) => online(member.status) === true
                                            ).length
                                        }
                                    </ListSubheader>
                                }
                            >
                                {memberList
                                    ?.filter((member) => online(member.status) === true)
                                    .map(({ displayName, avatar, status, id }) => (
                                        <ListItem
                                            key={id}
                                            disablePadding
                                            className="member-list-item"
                                            ref={(ele) => (memberRefs.current[id] = ele)}
                                        >
                                            <ListItemButton
                                                onClick={() => handleOpenMemberDetail(id)}
                                            >
                                                <ListItemAvatar>
                                                    <Badge
                                                        overlap="circular"
                                                        anchorOrigin={{
                                                            vertical: "bottom",
                                                            horizontal: "right",
                                                        }}
                                                        badgeContent={
                                                            <StatusList status={status} size={15} />
                                                        }
                                                    >
                                                        <Avatar alt={displayName} src={avatar} />
                                                    </Badge>
                                                </ListItemAvatar>
                                                <ListItemText primary={displayName} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                            </List>
                        ) : null}
                        {memberList.find((member) => online(member.status) === false) ? (
                            <List
                                subheader={
                                    <ListSubheader component="div" className="member-subheader">
                                        Offline -{" "}
                                        {
                                            memberList?.filter(
                                                (member) => online(member.status) === false
                                            ).length
                                        }
                                    </ListSubheader>
                                }
                            >
                                {memberList
                                    ?.filter((member) => online(member.status) === false)
                                    .map(({ displayName, avatar, id }) => (
                                        <ListItem
                                            key={id}
                                            disablePadding
                                            className="member-list-item member-list-item-muted"
                                            ref={(ele) => (memberRefs.current[id] = ele)}
                                        >
                                            <ListItemButton
                                                onClick={() => handleOpenMemberDetail(id)}
                                            >
                                                <ListItemAvatar>
                                                    <Badge
                                                        overlap="circular"
                                                        anchorOrigin={{
                                                            vertical: "bottom",
                                                            horizontal: "right",
                                                        }}
                                                        badgeContent={<StatusList size={15} />}
                                                    >
                                                        <Avatar alt={displayName} src={avatar} />
                                                    </Badge>
                                                </ListItemAvatar>
                                                <ListItemText primary={displayName} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                            </List>
                        ) : null}
                    </header>
                </div>
            </aside>
            <MemberDetailPopover memberRef={memberRef} />
        </div>
    );
}

export default ChannelMemberList;
