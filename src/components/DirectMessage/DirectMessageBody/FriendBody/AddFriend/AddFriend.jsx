import React, { useState } from "react";
import { Typography, FormControl, InputAdornment, InputBase, Divider } from "@mui/material";
import FriendActive from "@/components/DirectMessage/DirectMessageBody/FriendBody/FriendActive/FriendActive";
import SearchIcon from "@mui/icons-material/Search";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { handleSearchFriend } from "@/handlers/searchHandlers";
import { debounce } from "@/handlers/searchHandlers";
import FriendTab from "@/components/DirectMessage/DirectMessageBody/FriendBody/FriendTab/FriendTab";
import "./AddFriend.scss";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    "label + &": {
        marginTop: theme.spacing(3),
    },
    "& input": {
        borderRadius: 4,
        position: "relative",
        backgroundColor: theme.palette.background.paper,
        border: "none",
        fontSize: 16,
        padding: "10px 12px",
        color: theme.palette.text.primary,
    },
}));

export default function AddFriend({ noActive }) {
    const { user } = useSelector((state) => state.auth);
    const { friendList, queryFriendList } = useSelector((state) => state.directMessage);
    const [loading, setLoading] = useState(false);
    const [copyed, setCopyed] = React.useState(false);
    const copyToClip = () => {
        setLoading(true);
        navigator.clipboard.writeText(user.id).then(() => {
            setLoading(false);
            setCopyed(true);
        });
    };
    return (
        <div className="content">
            <main className="add-friend-content">
                <div className="add-friend-title">
                    <Typography variant="h4">ADD FRIEND</Typography>
                </div>
                <div className="add-friend-subtitle">
                    <Typography variant="body2">
                        You can add a friend with their unique ID.
                    </Typography>
                </div>
                <form className="add-friend-search-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="add-friend-search-inner">
                        <input
                            className="add-friend-search-input"
                            type="search"
                            name="search"
                            placeholder="Enter unique friend ID or their username"
                            onChange={(e) => debounce(handleSearchFriend(e), 5000)}
                            autoComplete="off"
                        />
                        <SearchIcon />
                    </div>
                </form>
                <Divider variant="middle"></Divider>
                <form className="self-id-container">
                    <FormControl variant="standard" fullWidth>
                        <Typography variant="h4">Your Unique ID:</Typography>
                        <BootstrapInput
                            id="name"
                            name="name"
                            variant="outlined"
                            autoComplete="off"
                            defaultValue={user.id}
                            readOnly
                            className="bootstrap-input-mt"
                            endAdornment={
                                <InputAdornment position="end">
                                    <LoadingButton
                                        onClick={() => copyToClip()}
                                        loading={loading}
                                        variant="contained"
                                    >
                                        {copyed ? <span>Copied!</span> : <span>Copy</span>}
                                    </LoadingButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </form>
                <Divider variant="middle"></Divider>
                <div>
                    {queryFriendList?.map(({ displayName, status, avatar, id }) => (
                        <FriendTab
                            displayName={displayName}
                            avatar={avatar}
                            id={id}
                            status={status}
                            key={id}
                        />
                    ))}
                </div>
            </main>
            <FriendActive firendList={friendList} noActive={noActive} />
        </div>
    );
}
