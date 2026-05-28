import React from "react";
import { Typography } from "@mui/material";
import "./FriendActive.scss";

export default function FriendActive({ noActive }) {
    return (
        <div className="friend-active">
            <div className="friend-active-container">
                <aside className="friend-active-wrapper">
                    {noActive ? (
                        <Typography variant="h4">Active Now</Typography>
                    ) : (
                        <Typography>Friend Active</Typography>
                    )}
                </aside>
            </div>
        </div>
    );
}
