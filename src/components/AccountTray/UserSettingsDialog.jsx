import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogContent } from "@/components/compat/RadixCompat";
import AvatarWithStatus from "@/components/AvatarWithStatus/AvatarWithStatus";
import "./UserSettingsDialog.scss";
import SearchBox from "@/components/Search/SearchBox";
import { FRIEND_LIST_DEBOUNCE } from "@/config/searchConfig";

const navGroups = [
    {
        title: "Account",
        items: [
            { id: "account-info", label: "Account Info" },
            { id: "password-security", label: "Password & Security" },
            { id: "account-standing", label: "Account Standing" },
            { id: "family-center", label: "Family Center" },
        ],
    },
    {
        title: "Content & Social",
        items: [{ id: "content-social", label: "Content & Social" }],
    },
    {
        title: "Data & Privacy",
        items: [{ id: "data-privacy", label: "Data & Privacy" }],
    },
    {
        title: "Apps",
        items: [
            { id: "authorized-apps", label: "Authorized Apps" },
            { id: "connections", label: "Connections" },
        ],
    },
    {
        title: "Notifications",
        items: [{ id: "notifications", label: "Notifications" }],
    },
    {
        title: "Billing",
        items: [
            { id: "nitro", label: "Nitro" },
            { id: "server-boost", label: "Server Boost" },
            { id: "subscriptions", label: "Subscriptions" },
            { id: "gift-inventory", label: "Gift Inventory" },
            { id: "billing", label: "Billing" },
        ],
    },
    {
        title: "Experience",
        items: [
            { id: "voice-video", label: "Voice & Video" },
            { id: "appearance", label: "Appearance" },
            { id: "accessibility", label: "Accessibility" },
            { id: "keybinds", label: "Keybinds" },
            { id: "language-time", label: "Language & Time" },
            { id: "windows-settings", label: "Windows Settings" },
        ],
    },
    {
        title: "Activity",
        items: [{ id: "activity-privacy", label: "Activity Privacy" }],
    },
];

const sectionTitles = {
    "account-info": "Account Info",
    "password-security": "Password & Security",
    "account-standing": "Account Standing",
    "family-center": "Family Center",
    "content-social": "Content & Social",
    "data-privacy": "Data & Privacy",
    "authorized-apps": "Authorized Apps",
    connections: "Connections",
    notifications: "Notifications",
    nitro: "Nitro",
    "server-boost": "Server Boost",
    subscriptions: "Subscriptions",
    "gift-inventory": "Gift Inventory",
    billing: "Billing",
    "voice-video": "Voice & Video",
    appearance: "Appearance",
    accessibility: "Accessibility",
    keybinds: "Keybinds",
    "language-time": "Language & Time",
    "windows-settings": "Windows Settings",
    "activity-privacy": "Activity Privacy",
};

export default function UserSettingsDialog({ open, onOpenChange, user }) {
    const [activeSection, setActiveSection] = useState("account-info");
    const [search, setSearch] = useState("");

    const sectionLabel = sectionTitles[activeSection] || "Account Info";

    const getInitials = () => {
        const name = user?.displayName || "User";
        return name
            .split(" ")
            .map((n) => n.charAt(0))
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    const filteredGroups = navGroups
        .map((g) => ({
            ...g,
            items: g.items.filter((it) => it.label.toLowerCase().includes(search.toLowerCase())),
        }))
        .filter((g) => g.items.length > 0);

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
            className="user-settings-dialog"
            PaperProps={{
                className: "user-settings-paper",
                style: {
                    width: "min(1600px, calc(100vw - 64px))",
                    maxWidth: "min(1600px, calc(100vw - 64px))",
                    height: "calc(100vh - 64px)",
                    padding: "0px",
                    boxSizing: "border-box",
                    overflow: "hidden",
                },
            }}
        >
            <DialogContent className="user-settings-content">
                <div className="dialog-body">
                    <aside className="dialog-sidebar">
                        <div className="sidebar-top">
                            <div className="avatar-wrap">
                                <div className="avatar">
                                    <AvatarWithStatus
                                        alt={user?.displayName || "User"}
                                        src={user?.photoURL}
                                        fallback={getInitials()}
                                        containerClassName="avatar"
                                    />
                                </div>
                                <div className="avatar-meta">
                                    <div className="avatar-name">
                                        {user?.displayName || "Unknown"}
                                    </div>
                                    <button className="avatar-edit">Edit Profiles</button>
                                </div>
                            </div>
                            <SearchBox
                                placeholder="Search"
                                onSearch={(v) => setSearch(v)}
                                debounceMs={FRIEND_LIST_DEBOUNCE}
                                noResultsText={null}
                            />
                        </div>

                        <nav className="sidebar-nav">
                            {filteredGroups.map((group) => (
                                <div key={group.title} className="sidebar-group">
                                    <div className="sidebar-group-title">{group.title}</div>
                                    <ul className="sidebar-items">
                                        {group.items.map((item) => (
                                            <li
                                                key={item.id}
                                                className={
                                                    activeSection === item.id ? "active" : ""
                                                }
                                            >
                                                <button
                                                    type="button"
                                                    className={`sidebar-item`}
                                                    onClick={() => setActiveSection(item.id)}
                                                >
                                                    {item.label}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </nav>
                    </aside>

                    <main className="dialog-panel">
                        <div className="panel-heading">
                            <div className="panel-title">{sectionLabel}</div>
                            <button
                                type="button"
                                className="user-settings-close"
                                onClick={() => onOpenChange(false)}
                                aria-label="Close settings dialog"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        <div className="panel-content">
                            {activeSection === "account-info" && (
                                <section className="panel-section">
                                    <div className="section-title">Account Info</div>

                                    <div className="section-row">
                                        <div className="row-label">Username</div>
                                        <div className="row-value">
                                            {user?.displayName || "Unknown"}
                                        </div>
                                        <div className="row-action">
                                            <button className="btn">Edit</button>
                                        </div>
                                    </div>

                                    <div className="section-row">
                                        <div className="row-label">Email</div>
                                        <div className="row-value">
                                            {user?.email || "no-email@example.com"}
                                            <button className="reveal">Reveal</button>
                                        </div>
                                        <div className="row-action">
                                            <button className="btn">Edit</button>
                                        </div>
                                    </div>

                                    <div className="section-row">
                                        <div className="row-label">Phone Number</div>
                                        <div className="row-value">
                                            ********0919
                                            <button className="reveal">Reveal</button>
                                        </div>
                                        <div className="row-action">
                                            <button className="btn">Edit</button>
                                        </div>
                                    </div>

                                    <hr className="section-divider" />

                                    <div className="section-title">Password & Security</div>

                                    <div className="card-list">
                                        <div className="card">
                                            <div>
                                                <div className="card-title">Password</div>
                                            </div>
                                            <div>
                                                <button className="btn">Edit</button>
                                            </div>
                                        </div>

                                        <div className="card">
                                            <div>
                                                <div className="card-title">
                                                    Multi-Factor Authentication
                                                </div>
                                                <div className="card-sub">Enabled</div>
                                            </div>
                                            <div>
                                                <button className="btn">Manage</button>
                                            </div>
                                        </div>

                                        <div className="card">
                                            <div>
                                                <div className="card-title">Logged-in Devices</div>
                                                <div className="card-sub">
                                                    5 devices currently signed in
                                                </div>
                                            </div>
                                            <div>
                                                <button className="btn">View</button>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="section-divider" />

                                    <div className="section-title">Account Standing</div>

                                    <div className="status-card">
                                        <div className="status-icon">✓</div>
                                        <div>
                                            <div className="status-heading">
                                                Your account is all good
                                            </div>
                                            <div className="card-sub">
                                                Thanks for upholding Discord&apos;s Terms of Service
                                                and Community Guidelines.
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="section-divider" />

                                    <div className="section-title">Family Center</div>

                                    <div className="card card-full">
                                        <div>
                                            <div className="card-title">Set up Family Center</div>
                                            <div className="card-sub">
                                                Stay informed about your teen&apos;s experience on
                                                Discord. See their activity, manage key safety
                                                settings, and start better conversations together.
                                            </div>
                                        </div>
                                        <div>
                                            <button className="btn">Learn More</button>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {(activeSection === "password-security" ||
                                activeSection === "account-standing" ||
                                activeSection === "family-center") && (
                                <div className="panel-placeholder">
                                    This section is under construction for the demo layout.
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </DialogContent>
        </Dialog>
    );
}
