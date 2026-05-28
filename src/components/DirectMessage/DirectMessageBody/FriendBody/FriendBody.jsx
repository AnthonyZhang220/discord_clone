import React, { useState } from "react";
import FriendActive from "./FriendActive/FriendActive";
import FriendList from "./FriendList/FriendList";
import SearchIcon from "@mui/icons-material/Search";

import AddFriend from "./AddFriend/AddFriend";
import { useSelector } from "react-redux";
import { handleSearchFriend } from "@/handlers/searchHandlers";
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
                            <form className="friend-search-inner">
                                <input
                                    className="friend-search-input"
                                    type="search"
                                    name="search"
                                    placeholder="Search"
                                    onChange={(e) => handleSearchFriend(e)}
                                    autoComplete="off"
                                />
                                <SearchIcon />
                            </form>
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
