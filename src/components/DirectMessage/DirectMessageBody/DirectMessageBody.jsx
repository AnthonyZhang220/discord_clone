import React from "react";
import PrivateChat from "./PrivateChat/PrivateChat";
import FriendBody from "./FriendBody/FriendBody";
import { useSelector } from "react-redux";
import DirectMessageHeader from "@/components/DirectMessage/DirectMessageHeader/DirectMessageHeader";
import "./DirectMessageBody.scss";

function DirectMessageBody() {
    const { isFriendListPageOpen } = useSelector((state) => state.directMessage);

    return (
        <div className="friend-main-container">
            <DirectMessageHeader />
            {isFriendListPageOpen ? <FriendBody /> : <PrivateChat />}
        </div>
    );
}

export default DirectMessageBody;
