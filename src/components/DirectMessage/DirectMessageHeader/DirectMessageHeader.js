import React from "react";

import FriendIcon from "@/components/DirectMessage/DirectMessageBody/FriendBody/friend.svg";
import GroupDMIcon from "@/components/DirectMessage/DirectMessageBody/FriendBody/groupdm.svg";
import InboxIcon from "@mui/icons-material/Inbox";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import StatusList from "@/components/StatusList";
import { Tooltip } from "@/components/compat/RadixCompat";
import { AlternateEmailSharp } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setFriendFilter } from "@/redux/features/directMessageSlice";
import { toggleDirectMessageSidebar } from "@/redux/features/directMessageSlice";
import { setIsFriendListPageOpen } from "@/redux/features/directMessageSlice";
import { setDirectMessageStore } from "@/utils/directMessageStore";
import "./DirectMessageHeader.scss";

export default function DirectMessageHeader() {
    const { isFriendListPageOpen } = useSelector((state) => state.directMessage);
    return <>{isFriendListPageOpen ? <FriendHeader /> : <PrivateChannelHeader />}</>;
}

export const FriendHeader = () => {
    const dispatch = useDispatch();
    const { friendFilter, inboxCount } = useSelector((state) => state.directMessage);

    const openPendingInbox = () => {
        dispatch(setIsFriendListPageOpen(true));
        dispatch(setFriendFilter("pending"));
        setDirectMessageStore({
            isFriendListPageOpen: true,
            selectedDirectMessageUserId: "",
        });
    };

    return (
        <section className="friend-main-header">
            <div className="friend-main-header-name">
                <FriendIcon className="friend-main-header-icon" aria-hidden="true" />
                <h3 className="friend-main-header-text">Friends</h3>
                <span className="friend-main-header-divider" />
                <div className="button-stack">
                    <button
                        type="button"
                        className={`friend-main-header-button ${friendFilter === "online" ? "active" : ""}`}
                        onClick={() => dispatch(setFriendFilter("online"))}
                    >
                        Online
                    </button>
                    <button
                        type="button"
                        className={`friend-main-header-button ${friendFilter === "all" ? "active" : ""}`}
                        onClick={() => dispatch(setFriendFilter("all"))}
                    >
                        All
                    </button>
                    <button
                        type="button"
                        className={`friend-main-header-button ${friendFilter === "pending" ? "active" : ""}`}
                        onClick={() => dispatch(setFriendFilter("pending"))}
                    >
                        Pending
                    </button>
                    <button
                        type="button"
                        className={`friend-main-header-button ${friendFilter === "blocked" ? "active" : ""}`}
                        onClick={() => dispatch(setFriendFilter("blocked"))}
                    >
                        Blocked
                    </button>
                    <button
                        type="button"
                        className={`addfriend-button ${friendFilter === "addfriend" ? "active" : ""}`}
                        onClick={() => dispatch(setFriendFilter("addfriend"))}
                    >
                        Add Friend
                    </button>
                </div>
            </div>
            <div className="friend-main-header-feature">
                <div className="friend-main-header-feature-icon">
                    <Tooltip
                        title={
                            <React.Fragment>
                                <span className="tooltip-text">New Group DM</span>
                            </React.Fragment>
                        }
                        placement="bottom"
                    >
                        <div>
                            <GroupDMIcon className="friend-main-header-icon" aria-hidden="true" />
                        </div>
                    </Tooltip>
                </div>
                <div className="friend-main-header-feature-icon">
                    <Tooltip
                        title={
                            <React.Fragment>
                                <span className="tooltip-text">Inbox</span>
                            </React.Fragment>
                        }
                        placement="bottom"
                    >
                        <button
                            type="button"
                            className="inbox-icon-button"
                            onClick={openPendingInbox}
                        >
                            <InboxIcon />
                            {inboxCount > 0 ? (
                                <span className="inbox-count-badge">{inboxCount}</span>
                            ) : null}
                        </button>
                    </Tooltip>
                </div>
            </div>
        </section>
    );
};

export const PrivateChannelHeader = () => {
    const dispatch = useDispatch();
    const { currDirectMessageChannel } = useSelector((state) => state.directMessage);

    return (
        <section className="friend-main-header">
            <div className="friend-main-header-name">
                <AlternateEmailSharp className="friend-main-header-icon" />
                <span className="friend-main-header-hashtag">
                    {currDirectMessageChannel.displayName}
                </span>
                <div>
                    <StatusList status={currDirectMessageChannel.status} size={15} />
                </div>
            </div>
            <div className="friend-main-header-feature">
                <Tooltip
                    title={
                        <React.Fragment>
                            <span className="tooltip-text">More</span>
                        </React.Fragment>
                    }
                    placement="bottom"
                >
                    <PeopleAltIcon
                        color="white"
                        onClick={() => dispatch(toggleDirectMessageSidebar())}
                    />
                </Tooltip>
            </div>
        </section>
    );
};
