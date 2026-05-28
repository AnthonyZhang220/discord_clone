import React from "react";
import { SvgIcon, Button, Divider, Typography } from "@mui/material";

import FriendIcon from "@/components/DirectMessage/DirectMessageBody/FriendBody/friend.svg";
import GroupDMIcon from "@/components/DirectMessage/DirectMessageBody/FriendBody/groupdm.svg";
import InboxIcon from "@mui/icons-material/Inbox";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import { Stack } from "@mui/material";

import StatusList from "@/components/StatusList";
import { FunctionTooltip } from "@/components/CustomUIComponents";
import { AlternateEmailSharp } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setFriendFilter } from "@/redux/features/directMessageSlice";
import { toggleDirectMessageSidebar } from "@/redux/features/directMessageSlice";
import "./DirectMessageHeader.scss";

export default function DirectMessageHeader() {
    const { isFriendListPageOpen } = useSelector((state) => state.directMessage);
    return <>{isFriendListPageOpen ? <FriendHeader /> : <PrivateChannelHeader />}</>;
}

export const FriendHeader = () => {
    const dispatch = useDispatch();
    const { friendFilter } = useSelector((state) => state.directMessage);

    return (
        <section className="friend-main-header">
            <div className="friend-main-header-name">
                <SvgIcon
                    component={FriendIcon}
                    inheritViewBox
                    className="friend-main-header-icon"
                />
                <Typography variant="h3" className="friend-main-header-text">
                    Friends
                </Typography>
                <Divider
                    orientation="vertical"
                    variant="fullWidth"
                    className="friend-main-header-divider"
                />
                <div>
                    <Stack direction="row" spacing={1}>
                        <Button
                            className={`friend-main-header-button ${friendFilter === "online" ? "active" : ""}`}
                            onClick={() => dispatch(setFriendFilter("online"))}
                            disableRipple
                        >
                            Online
                        </Button>
                        <Button
                            className={`friend-main-header-button ${friendFilter === "all" ? "active" : ""}`}
                            onClick={() => dispatch(setFriendFilter("all"))}
                            disableRipple
                        >
                            All
                        </Button>
                        <Button
                            className={`friend-main-header-button ${friendFilter === "pending" ? "active" : ""}`}
                            onClick={() => dispatch(setFriendFilter("pending"))}
                            disableRipple
                        >
                            Pending
                        </Button>
                        <Button
                            className={`friend-main-header-button ${friendFilter === "blocked" ? "active" : ""}`}
                            onClick={() => dispatch(setFriendFilter("blocked"))}
                            disableRipple
                        >
                            Blocked
                        </Button>
                        <Button
                            className={`addfriend-button ${friendFilter === "addfriend" ? "active" : ""}`}
                            variant="contained"
                            onClick={() => dispatch(setFriendFilter("addfriend"))}
                            disableRipple
                        >
                            Add Friend
                        </Button>
                    </Stack>
                </div>
            </div>
            <div className="friend-main-header-feature">
                <div className="friend-main-header-feature-icon">
                    <FunctionTooltip
                        title={
                            <React.Fragment>
                                <Typography variant="body1" className="tooltip-text">
                                    New Group DM
                                </Typography>
                            </React.Fragment>
                        }
                        placement="bottom"
                    >
                        <div>
                            <SvgIcon inheritViewBox component={GroupDMIcon} />
                        </div>
                    </FunctionTooltip>
                </div>
                <div className="friend-main-header-feature-icon">
                    <FunctionTooltip
                        title={
                            <React.Fragment>
                                <Typography variant="body1" className="tooltip-text">
                                    Inbox
                                </Typography>
                            </React.Fragment>
                        }
                        placement="bottom"
                    >
                        <div>
                            <InboxIcon />
                        </div>
                    </FunctionTooltip>
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
                <FunctionTooltip
                    title={
                        <React.Fragment>
                            <Typography variant="body1" className="tooltip-text">
                                More
                            </Typography>
                        </React.Fragment>
                    }
                    placement="bottom"
                >
                    <PeopleAltIcon
                        color="white"
                        onClick={() => dispatch(toggleDirectMessageSidebar())}
                    />
                </FunctionTooltip>
            </div>
        </section>
    );
};
