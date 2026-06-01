import React, { useState } from "react";
import FriendActive from "@/components/DirectMessage/DirectMessageBody/FriendBody/FriendActive/FriendActive";
import { useSelector } from "react-redux";
import { handleSearchFriend } from "@/handlers/searchHandlers";
import { ADD_FRIEND_DEBOUNCE } from "@/config/searchConfig";
import SearchBox from "@/components/Search/SearchBox";
import FriendTab from "@/components/DirectMessage/DirectMessageBody/FriendBody/FriendTab/FriendTab";
import { sendFriendRequest } from "@/handlers/friendHandlers";
import "./AddFriend.scss";

export default function AddFriend({ noActive }) {
    const { user } = useSelector((state) => state.auth);
    const { friendList, queryFriendList, pendingOutgoingList, blockedIdList, friendIdList } =
        useSelector((state) => state.directMessage);
    const { isLoading } = useSelector((state) => state.load);
    const [copyLoading, setCopyLoading] = useState(false);
    const [copyed, setCopyed] = React.useState(false);
    const [searchValue, setSearchValue] = useState("");
    const hasSearched = String(searchValue || "").trim().length >= 2;
    const copyToClip = () => {
        setCopyLoading(true);
        navigator.clipboard.writeText(user.id).then(() => {
            setCopyLoading(false);
            setCopyed(true);
        });
    };

    // stable debounced search function handled by SearchBox
    return (
        <div className="content">
            <main className="add-friend-content">
                <div className="add-friend-title">
                    <h4>ADD FRIEND</h4>
                </div>
                <div className="add-friend-subtitle">
                    <span>You can add a friend with their unique ID.</span>
                </div>
                <div className="add-friend-search-form">
                    <SearchBox
                        placeholder="Enter unique friend ID or their username"
                        onSearch={handleSearchFriend}
                        onChangeValue={setSearchValue}
                        debounceMs={ADD_FRIEND_DEBOUNCE}
                    />
                </div>
                <hr className="divider" />
                <div className="self-id-container">
                    <span>Your Unique ID:</span>
                    <input
                        className="bootstrap-input-base bootstrap-input-mt"
                        id="name"
                        name="name"
                        autoComplete="off"
                        defaultValue={user.id}
                        readOnly
                    />
                    <button
                        type="button"
                        className="copy-button"
                        onClick={() => copyToClip()}
                        disabled={copyLoading}
                    >
                        {copyed ? <span>Copied!</span> : <span>Copy</span>}
                    </button>
                </div>
                <hr className="divider" />
                <div className="add-friend-results">
                    {queryFriendList && queryFriendList.length > 0 ? (
                        queryFriendList.map(({ displayName, status, avatar, id }) => {
                            const isSelf = user?.id === id;
                            const isFriend = friendIdList.includes(id);
                            const isBlocked = blockedIdList.includes(id);
                            const isPending = pendingOutgoingList.some(
                                (request) => request.toUserId === id
                            );
                            const disableAdd = isSelf || isFriend || isBlocked || isPending;

                            let relationStatus = status;
                            if (isSelf) relationStatus = "you";
                            else if (isFriend) relationStatus = "already friends";
                            else if (isBlocked) relationStatus = "blocked";
                            else if (isPending) relationStatus = "pending";

                            return (
                                <FriendTab
                                    displayName={displayName}
                                    avatar={avatar}
                                    id={id}
                                    status={relationStatus}
                                    key={id}
                                    actionType="search"
                                    disableAdd={disableAdd}
                                    onAdd={() => sendFriendRequest({ id, displayName, avatar })}
                                />
                            );
                        })
                    ) : hasSearched && !isLoading ? (
                        <div className="no-search-results">无搜索结果</div>
                    ) : null}
                </div>
            </main>
            <FriendActive friendList={friendList} noActive={noActive} />
        </div>
    );
}
