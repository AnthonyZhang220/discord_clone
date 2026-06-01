import React from "react";
import * as HoverCard from "@radix-ui/react-hover-card";
import AvatarWithStatus from "@/components/AvatarWithStatus/AvatarWithStatus";
import { useSelector } from "react-redux";
import { setMemberDetailPopover } from "@/redux/features/popoverSlice";
import { useDispatch } from "react-redux";
import { handleCurrDirectMessageChannel } from "@/handlers/channelHandlers";

export const MemberDetailContent = ({ member, onClose, showActions = true }) => {
    const { memberDetail } = useSelector((state) => state.memberList);
    const dispatch = useDispatch();

    const memberData = member ?? memberDetail;

    const createdAtDate = React.useMemo(() => {
        const raw = memberData?.createdAt;
        if (!raw) return null;
        if (typeof raw === "number") return new Date(raw * 1000);
        if (raw.seconds && typeof raw.seconds === "number") return new Date(raw.seconds * 1000);
        const parsed = new Date(raw);
        return isNaN(parsed.getTime()) ? null : parsed;
    }, [memberData?.createdAt]);

    const handleMessage = () => {
        if (memberData?.id) {
            handleCurrDirectMessageChannel(
                memberData.id,
                memberData.status,
                memberData.displayName,
                memberData.avatar,
                memberData.createdAt
            );
        }
        if (onClose) onClose();
        dispatch(setMemberDetailPopover(false));
    };

    return (
        <div className="user-menu-popover-content">
            <div
                className="user-menu-banner"
                style={{ background: memberData?.bannerColor ?? "#5865f2" }}
            />

            <div className="user-menu-avatar-row">
                <AvatarWithStatus
                    containerClassName="user-menu-avatar"
                    avatarClassName="user-menu-avatar-img"
                    alt={memberData?.displayName}
                    src={memberData?.avatar}
                    imgProps={{ crossOrigin: "" }}
                    status={memberData?.status}
                />
            </div>

            <div className="user-menu-identity">
                <span className="user-menu-display-name">{memberData?.displayName}</span>
                <span className="user-menu-tag">{memberData?.username ?? memberData?.email}</span>
            </div>

            {createdAtDate && (
                <>
                    <div className="user-menu-divider" />
                    <div className="user-menu-section-label">MEMBER SINCE</div>
                    <div className="user-menu-section-value">
                        {createdAtDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                        })}
                    </div>
                </>
            )}

            {showActions && (
                <>
                    <div className="user-menu-divider" />

                    <div className="user-menu-list">
                        <div className="user-menu-listitem">
                            <button
                                type="button"
                                className="menu-listitem-button"
                                onClick={handleMessage}
                            >
                                <div className="user-menu-listitem-text">
                                    <span className="user-menu-primary">Message</span>
                                </div>
                            </button>
                        </div>

                        <div className="user-menu-listitem">
                            <button
                                type="button"
                                className="menu-listitem-button"
                                onClick={() => {
                                    if (onClose) onClose();
                                    dispatch(setMemberDetailPopover(false));
                                }}
                            >
                                <div className="user-menu-listitem-text">
                                    <span className="user-menu-primary">View Profile</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export const MemberPreviewCard = ({
    member,
    children,
    showActions = false,
    openDelay = 50,
    closeDelay = 50,
}) => {
    const [open, setOpen] = React.useState(false);

    return (
        <HoverCard.Root
            open={open}
            onOpenChange={setOpen}
            openDelay={openDelay}
            closeDelay={closeDelay}
        >
            <HoverCard.Trigger asChild>{children}</HoverCard.Trigger>
            <HoverCard.Portal>
                <HoverCard.Content
                    side="right"
                    align="center"
                    sideOffset={6}
                    className="user-menu-popover-paper"
                >
                    <MemberDetailContent
                        member={member}
                        onClose={() => setOpen(false)}
                        showActions={showActions}
                    />
                </HoverCard.Content>
            </HoverCard.Portal>
        </HoverCard.Root>
    );
};

export default MemberPreviewCard;
