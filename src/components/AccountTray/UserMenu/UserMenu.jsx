import React, { useEffect, memo } from "react";
import AvatarWithStatus from "@/components/AvatarWithStatus/AvatarWithStatus";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AlertDialog } from "radix-ui";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { useSelector } from "react-redux";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut } from "@/utils/authentication";
import StatusList from "@/components/StatusList";
import { statusFormat } from "@/utils/formatter";
import { changeStatus } from "@/utils/authentication";
import { createdAtDate } from "@/utils/formatter";
import { MemberListItem } from "@/components/ChannelMemberList/ChannelMemberList";
import { getSavedAccounts, switchAccount } from "@/utils/accountStore";

export const UserMenu = memo(function UserMenu() {
    const { user } = useSelector((state) => state.auth);
    const [confirmLogoutOpen, setConfirmLogoutOpen] = React.useState(false);
    const [loggedInAccounts, setLoggedInAccounts] = React.useState([]);

    const setStatus = React.useCallback((s) => changeStatus(s), []);

    const createdAtDateMemo = React.useMemo(() => {
        return createdAtDate(user?.createdAt);
    }, [user?.createdAt]);

    useEffect(() => {
        const accounts = getSavedAccounts(); // { uid: { uid, email, displayName, photoURL, refreshToken } }
        setLoggedInAccounts(Object.values(accounts));
    }, []);

    return (
        <>
            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="user-menu-paper"
                    side="top"
                    align="start"
                    sideOffset={10}
                >
                    <div
                        className="user-menu-banner"
                        style={{ background: user?.bannerColor ?? "#5865f2" }}
                    />
                    <div className="user-menu-avatar-row">
                        <AvatarWithStatus
                            containerClassName="user-menu-avatar"
                            avatarClassName="user-menu-avatar-img"
                            alt={user?.displayName}
                            src={user?.avatar}
                            status={user?.status}
                        />
                    </div>

                    <div className="user-menu-identity">
                        <span className="user-menu-display-name">{user?.displayName}</span>
                        <span className="user-menu-tag">{user?.username ?? user?.email}</span>
                    </div>

                    {createdAtDateMemo && (
                        <>
                            <div className="user-menu-divider" />
                            <div className="user-menu-section-label">MEMBER SINCE</div>
                            <div className="user-menu-section-value">
                                {createdAtDateMemo.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "2-digit",
                                    year: "numeric",
                                })}
                            </div>
                        </>
                    )}

                    <div className="user-menu-divider" />

                    <DropdownMenu.Sub>
                        <DropdownMenu.SubTrigger className="user-menu-item">
                            <StatusList edge="start" status={user?.status} size={15} />
                            <span className="user-menu-item-label">
                                {statusFormat(user?.status)}
                            </span>
                            <NavigateNextIcon className="user-menu-chevron" />
                        </DropdownMenu.SubTrigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.SubContent className="user-menu-sub-paper" sideOffset={6}>
                                {["online", "idle", "donotdisturb", "invisible"].map((s) => (
                                    <DropdownMenu.Item
                                        key={s}
                                        className="user-menu-item"
                                        onSelect={() => setStatus(s)}
                                    >
                                        <StatusList status={s} size={16} edge="start" />
                                        <span className="user-menu-item-label">
                                            {
                                                {
                                                    online: "Online",
                                                    idle: "Idle",
                                                    donotdisturb: "Do Not Disturb",
                                                    invisible: "Invisible",
                                                }[s]
                                            }
                                        </span>
                                    </DropdownMenu.Item>
                                ))}
                            </DropdownMenu.SubContent>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Sub>

                    <div className="user-menu-divider" />

                    <DropdownMenu.Sub>
                        <DropdownMenu.SubTrigger className="user-menu-item">
                            <SwapVertIcon className="user-menu-item-icon" />
                            <span className="user-menu-item-label">Switch Accounts</span>
                            <NavigateNextIcon className="user-menu-chevron" />
                        </DropdownMenu.SubTrigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.SubContent className="user-menu-sub-paper" sideOffset={6}>
                                {loggedInAccounts.map((account) => (
                                    <MemberListItem
                                        key={account.uid}
                                        avatar={account.photoURL}
                                        displayName={account.displayName}
                                        email={account.email}
                                        onClick={() => switchAccount(account.uid)}
                                        disablePreview
                                        avatarSize={32}
                                    />
                                ))}
                            </DropdownMenu.SubContent>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Sub>

                    <DropdownMenu.Item
                        className="user-menu-item user-menu-item--danger"
                        onSelect={(event) => {
                            event.preventDefault();
                            setConfirmLogoutOpen(true);
                        }}
                    >
                        <span className="user-menu-item-label">Log Out</span>
                        <LogoutIcon color="error" className="user-menu-item-icon" />
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>

            <AlertDialog.Root open={confirmLogoutOpen} onOpenChange={setConfirmLogoutOpen}>
                <AlertDialog.Portal>
                    <AlertDialog.Overlay className="alert-dialog-overlay" />
                    <AlertDialog.Content className="alert-dialog-content modal-paper modal-paper--center">
                        <AlertDialog.Title className="modal-title">Log out?</AlertDialog.Title>
                        <AlertDialog.Description className="modal-description">
                            You will be signed out from this account on this device.
                        </AlertDialog.Description>
                        <div className="modal-actions">
                            <AlertDialog.Cancel asChild>
                                <button type="button" className="modal-button modal-button-back">
                                    Cancel
                                </button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild>
                                <button
                                    type="button"
                                    className="modal-button modal-button-contained modal-button-contained--danger user-menu-item--danger"
                                    onClick={() => {
                                        setConfirmLogoutOpen(false);
                                        signOut();
                                    }}
                                >
                                    Log Out
                                </button>
                            </AlertDialog.Action>
                        </div>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>
        </>
    );
});

export default UserMenu;
