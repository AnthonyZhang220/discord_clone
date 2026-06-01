import React, { useEffect } from "react";
import PrivateChat from "./PrivateChat/PrivateChat";
import FriendBody from "./FriendBody/FriendBody";
import { useDispatch, useSelector } from "react-redux";
import DirectMessageHeader from "@/components/DirectMessage/DirectMessageHeader/DirectMessageHeader";
import {
    setCurrDirectMessageChannel,
    setCurrDirectMessageChannelRef,
    setIsFriendListPageOpen,
} from "@/redux/features/directMessageSlice";
import { setDirectMessageStore } from "@/utils/directMessageStore";
import "./DirectMessageBody.scss";

function DirectMessageBody() {
    const dispatch = useDispatch();
    const {
        isFriendListPageOpen,
        currDirectMessageChannelRef,
        directMessageChannelList,
        friendList,
    } = useSelector((state) => state.directMessage);

    useEffect(() => {
        const hasDirectMessage = Array.isArray(directMessageChannelList)
            ? directMessageChannelList.length > 0
            : false;
        const hasFriend = Array.isArray(friendList) ? friendList.length > 0 : false;
        const hasSelectedChannel = Boolean(currDirectMessageChannelRef);

        if (!hasFriend || !hasDirectMessage || !hasSelectedChannel) {
            if (!isFriendListPageOpen) {
                dispatch(setIsFriendListPageOpen(true));
            }

            if (!hasSelectedChannel) {
                dispatch(setCurrDirectMessageChannel({}));
                dispatch(setCurrDirectMessageChannelRef(""));
            }

            setDirectMessageStore({
                isFriendListPageOpen: true,
                selectedDirectMessageUserId: "",
            });
        }
    }, [
        currDirectMessageChannelRef,
        directMessageChannelList,
        friendList,
        dispatch,
        isFriendListPageOpen,
    ]);

    return (
        <div className="friend-main-container">
            <DirectMessageHeader />
            {isFriendListPageOpen ? <FriendBody /> : <PrivateChat />}
        </div>
    );
}

export default DirectMessageBody;
