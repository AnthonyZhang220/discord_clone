import React, { useRef, useEffect, useMemo, useCallback, memo } from "react";
import AvatarWithStatus from "@/components/AvatarWithStatus/AvatarWithStatus";

import { doc, getDoc, onSnapshot, query, collection, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useDispatch, useSelector } from "react-redux";
import MemberPreviewCard from "./MemberDetailPopover/MemberDetailPopover";
import { setMemberList, setMemberDetail } from "@/redux/features/memberListSlice";
import { setMemberDetailPopover } from "@/redux/features/popoverSlice";

import "./ChannelMemberList.scss";

export const MemberListItem = memo(function MemberListItem({
    id,
    displayName,
    avatar,
    status,
    muted,
    onClick,
    setRef = { current: {} },
    disablePreview = false,
    avatarSize,
}) {
    const member = { id, displayName, avatar, status };

    const button = (
        <button
            type="button"
            className={`sidebar-item member-list-item`}
            onClick={() => onClick(id)}
        >
            <AvatarWithStatus
                containerClassName="member-list-avatar-wrap"
                avatarClassName="avatar"
                alt={displayName}
                src={avatar}
                status={muted ? undefined : status}
                size={avatarSize}
            />
            <div className="member-list-text">{displayName}</div>
        </button>
    );

    return (
        <div
            key={id}
            className={`member-list-item ${muted ? "member-list-item-muted" : ""}`}
            ref={(ele) => (setRef.current[id] = ele)}
        >
            {disablePreview ? (
                button
            ) : (
                <MemberPreviewCard member={member}>{button}</MemberPreviewCard>
            )}
        </div>
    );
});

const ChannelMemberList = memo(function ChannelMemberList() {
    const dispatch = useDispatch();
    const { selectedServer } = useSelector((state) => state.userSelectStore);
    const { memberList } = useSelector((state) => state.memberList);
    const memberRefs = useRef({});

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

                // don't set memberRef here; it should be a DOM element used as anchor
            })();
        }
    }, [selectedServer, dispatch]);

    const handleOpenMemberDetail = useCallback(
        (memberId) => {
            const currentMemberDetail = memberList.find((member) => member.id === memberId);
            dispatch(setMemberDetail(currentMemberDetail));

            dispatch(setMemberDetailPopover(true));
        },
        [memberList, dispatch]
    );

    const online = useCallback((status) => {
        return status === "online" || status === "idle" || status === "donotdisturb";
    }, []);

    const onlineMembers = useMemo(
        () => memberList?.filter((m) => online(m.status)) || [],
        [memberList, online]
    );
    const offlineMembers = useMemo(
        () => memberList?.filter((m) => !online(m.status)) || [],
        [memberList, online]
    );

    return (
        <div className="userstatus-container">
            <aside className="userstatus-memberlist-wrapper">
                <div className="userstatus-memberlist">
                    <header className="userstatus-online focusable">
                        {onlineMembers.length > 0 ? (
                            <div className="member-list">
                                <div className="member-subheader">
                                    <span>Online - {onlineMembers.length}</span>
                                </div>
                                {onlineMembers.map(({ displayName, avatar, status, id }) => (
                                    <MemberListItem
                                        key={id}
                                        id={id}
                                        displayName={displayName}
                                        avatar={avatar}
                                        status={status}
                                        onClick={handleOpenMemberDetail}
                                        setRef={memberRefs}
                                    />
                                ))}
                            </div>
                        ) : null}
                        {offlineMembers.length > 0 ? (
                            <div className="member-list">
                                <div className="member-subheader">
                                    <span>Offline - {offlineMembers.length}</span>
                                </div>
                                {offlineMembers.map(({ displayName, avatar, id }) => (
                                    <MemberListItem
                                        key={id}
                                        id={id}
                                        displayName={displayName}
                                        avatar={avatar}
                                        muted
                                        onClick={handleOpenMemberDetail}
                                        setRef={memberRefs}
                                    />
                                ))}
                            </div>
                        ) : null}
                    </header>
                </div>
            </aside>
        </div>
    );
});

export default ChannelMemberList;
