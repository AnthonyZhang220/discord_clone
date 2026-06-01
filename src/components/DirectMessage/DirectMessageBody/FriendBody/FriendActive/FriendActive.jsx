import React from "react";
import "./FriendActive.scss";

export default function FriendActive({ noActive }) {
    return (
        <div className="friend-active">
            <div className="friend-active-container">
                <aside className="friend-active-wrapper">
                    {noActive ? <h4>Active Now</h4> : <span>Friend Active</span>}
                </aside>
            </div>
        </div>
    );
}
