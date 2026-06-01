import React from "react";
import AvatarWithStatus from "@/components/AvatarWithStatus/AvatarWithStatus";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AlertDialog } from "radix-ui";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { useDispatch, useSelector } from "react-redux";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut } from "@/utils/authentication";
import StatusList from "@/components/StatusList";
import { statusFormat } from "@/utils/formatter";
import { changeStatus } from "@/utils/authentication";
import { setUserDetailPopover } from "@/redux/features/popoverSlice";

export const UserMenu = React.memo(function UserMenu() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [confirmLogoutOpen, setConfirmLogoutOpen] = React.useState(false);

    const closePopover = React.useCallback(() => dispatch(setUserDetailPopover(false)), [dispatch]);
    const setStatus = React.useCallback((s) => changeStatus(s), []);

    const createdAtDate = React.useMemo(() => {
        const raw = user?.createdAt;
        if (!raw) return null;
        if (typeof raw === "number") return new Date(raw * 1000);
        if (raw.seconds) return new Date(raw.seconds * 1000);
        const p = new Date(raw);
        return isNaN(p.getTime()) ? null : p;
    }, [user?.createdAt]);

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

                    <DropdownMenu.Item className="user-menu-item" onSelect={closePopover}>
                        <SwapVertIcon className="user-menu-item-icon" />
                        <span className="user-menu-item-label">Switch Accounts</span>
                        <NavigateNextIcon className="user-menu-chevron" />
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                        className="user-menu-item user-menu-item--danger"
                        onSelect={(event) => {
                            event.preventDefault();
                            setConfirmLogoutOpen(true);
                        }}
                    >
                        <span className="user-menu-item-label">Log Out</span>
                        <LogoutIcon className="user-menu-item-icon" />
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
                                    className="modal-button modal-button-contained user-menu-item--danger"
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
