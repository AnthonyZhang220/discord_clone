import React from "react";
import { ListItem, ListItemText, Avatar, Badge, Divider } from "@mui/material";
import { Popover } from "@/components/compat/RadixCompat";
import { MemberListItemButton } from "@/components/CustomUIComponents";
import StatusList from "@/components/StatusList";
import { setMemberDetailPopover } from "@/redux/features/popoverSlice";
import { useDispatch, useSelector } from "react-redux";

export const MemberDetailPopover = ({ memberRef }) => {
    const dispatch = useDispatch();
    const { memberDetailPopover } = useSelector((state) => state.popover);
    const { memberDetail } = useSelector((state) => state.memberList);

    return (
        <Popover
            className="member-detail-paper"
            open={memberDetailPopover}
            onClose={() => dispatch(setMemberDetailPopover(false))}
            anchorReference="anchorEl"
            anchorEl={memberRef ? () => memberRef : null}
            PaperProps={{ className: "member-detail-paper__paper" }}
            anchorOrigin={{
                vertical: 0,
                horizontal: 0,
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
        >
            <div className="member-detail-top">
                <svg className="member-detail-banner">
                    <mask id="uid_347">
                        <rect></rect>
                        <circle></circle>
                    </mask>
                    <foreignObject className="member-detail-object">
                        <div className="member-detail-banner-box"></div>
                    </foreignObject>
                </svg>
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    className="member-detail-avatar"
                    badgeContent={<StatusList status={memberDetail.status} />}
                >
                    <Avatar
                        alt={memberDetail.displayName}
                        className="member-detail-avatar-img"
                        src={memberDetail.avatar}
                        imgProps={{ crossOrigin: "" }}
                    />
                </Badge>
            </div>
            <div className="member-detail-list">
                <ListItem dense>
                    <MemberListItemButton>
                        <ListItemText
                            primary={memberDetail.displayName}
                            primaryTypographyProps={{ variant: "h3" }}
                        />
                    </MemberListItemButton>
                </ListItem>
                <Divider className="member-detail-divider" variant="middle" light={true} />
                <ListItem dense>
                    <MemberListItemButton>
                        <ListItemText
                            primary="MEMBER SINCE"
                            primaryTypographyProps={{ variant: "h5" }}
                            secondary={new Date(
                                memberDetail.createdAt?.seconds * 1000
                            ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                            })}
                            secondaryTypographyProps={{ className: "member-detail-secondary" }}
                        />
                    </MemberListItemButton>
                </ListItem>
            </div>
        </Popover>
    );
};
