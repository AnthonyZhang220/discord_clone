import React, { useState } from "react";
import FriendActive from "./FriendActive/FriendActive";
import FriendList from "./FriendList/FriendList";
import AddFriend from "./AddFriend/AddFriend";
import { useSelector } from "react-redux";
import { handleSearchFriend } from "@/handlers/searchHandlers";
import { FRIEND_LIST_DEBOUNCE } from "@/config/searchConfig";
import SearchBox from "@/components/Search/SearchBox";
import "./FriendBody.scss";

export default function FriendBody() {
    const { friendFilter, friendList } = useSelector((state) => state.directMessage);
    const [noActive] = useState(true);

    return (
        <>
            {friendFilter === "addfriend" ? (
                <AddFriend noActive={noActive} />
            ) : (
                <div className="content">
                    <main className="friend-main-content">
                        <div className="friend-search-form">
                            <SearchBox
                                placeholder="Search"
                                onSearch={handleSearchFriend}
                                debounceMs={FRIEND_LIST_DEBOUNCE}
                                noResultsText={null}
                            />
                        </div>
                        <div className="friendListWrapper">
                            <div className="scroller">
                                <div className="scroll-content">
                                    <FriendList />
                                </div>
                            </div>
                        </div>
                    </main>
                    <FriendActive noActive={noActive} friendList={friendList} />
                </div>
            )}
        </>
    );
}
