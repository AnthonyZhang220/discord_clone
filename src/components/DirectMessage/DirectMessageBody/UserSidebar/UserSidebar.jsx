import React from "react";
import AvatarWithStatus from "@/components/AvatarWithStatus/AvatarWithStatus";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { createdAtDate } from "@/utils/formatter";
import "./UserSidebar.scss";

export const UserSidebar = ({ currDirectMessageChannel }) => {
    const createdAtDateMemo = React.useMemo(() => {
        return createdAtDate(currDirectMessageChannel?.createdAt);
    }, [currDirectMessageChannel?.createdAt]);

    const u = currDirectMessageChannel;

    return (
        <div className="us-container">
            <div className="us-scroll">
                {/* ── Banner + Avatar ── */}
                <div
                    className="us-banner"
                    style={{ background: u?.bannerColor ?? "var(--dc-brand-color)" }}
                />
                <div className="us-avatar-wrap">
                    <AvatarWithStatus
                        containerClassName="us-avatar"
                        avatarClassName="us-avatar-img"
                        alt={u?.displayName}
                        src={u?.avatar}
                        status={u?.status}
                        imgProps={{ crossOrigin: "Anonymous" }}
                        badgeSize={14}
                    />
                </div>

                {/* ── Identity ── */}
                <div className="us-identity">
                    <span className="us-display-name">{u?.displayName}</span>
                    <span className="us-tag">
                        {u?.username ?? u?.email}
                        {u?.pronouns && <span className="us-dot"> • {u.pronouns}</span>}
                    </span>
                </div>

                <div className="us-divider" />

                {/* ── Bio + Member Since ── */}
                <div className="us-card">
                    {u?.bio && (
                        <>
                            <div className="us-card-label">Bio</div>
                            <div className="us-card-text us-bio">{u.bio}</div>
                        </>
                    )}

                    {createdAtDate && (
                        <>
                            <div className="us-card-label" style={{ marginTop: u?.bio ? 12 : 0 }}>
                                Member Since
                            </div>
                            <div className="us-card-text">
                                {createdAtDateMemo.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </div>
                        </>
                    )}
                </div>

                <div className="us-divider" />

                {/* ── Mutual Servers ── */}
                <button type="button" className="us-row-button">
                    <span className="us-row-label">Mutual Servers — {u?.mutualServers ?? 0}</span>
                    <NavigateNextIcon className="us-row-chevron" />
                </button>

                <div className="us-divider" />

                {/* ── Mutual Friends ── */}
                <button type="button" className="us-row-button">
                    <span className="us-row-label">Mutual Friends — {u?.mutualFriends ?? 0}</span>
                    <NavigateNextIcon className="us-row-chevron" />
                </button>
            </div>

            {/* ── Footer ── */}
            <div className="us-footer">
                <button type="button" className="us-footer-btn">
                    View Full Profile
                </button>
            </div>
        </div>
    );
};
