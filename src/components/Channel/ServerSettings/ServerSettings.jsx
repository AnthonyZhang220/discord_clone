import React from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Divider, ListItem, ListItemButton, Typography } from "@mui/material";
import { Popover } from "@/components/compat/RadixCompat";
// ServerSettings styles merged into theme / global styles
import { toggleServerSettings } from "@/redux/features/popoverSlice";
import { handleInviteToServer, handleDeleteServer } from "@/handlers/serverHandlers";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SettingsIcon from "@mui/icons-material/Settings";
import { useDispatch, useSelector } from "react-redux";

//server settings menu
export default function ServerSettings({ channelHeaderRef }) {
    const dispatch = useDispatch();
    const { serverSettingsPopover } = useSelector((state) => state.popover);
    return (
        <Popover
            open={serverSettingsPopover}
            onClose={() => dispatch(toggleServerSettings())}
            anchorEl={channelHeaderRef.current}
            anchorReference="anchorEl"
            PaperProps={{ className: "server-settings-paper" }}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
        >
            <ListItem className="server-settings-item">
                <ListItemButton
                    onClick={() => handleInviteToServer()}
                    className="server-settings-button"
                >
                    <Typography variant="h6" className="server-settings-title">
                        Invite People
                    </Typography>
                    <PersonAddAlt1Icon className="server-settings-icon" />
                </ListItemButton>
            </ListItem>
            <ListItem className="server-settings-item">
                <ListItemButton
                    onClick={() => dispatch(toggleServerSettings())}
                    className="server-settings-button"
                >
                    <Typography variant="h6" className="server-settings-title">
                        Server Settings
                    </Typography>
                    <SettingsIcon className="server-settings-icon" />
                </ListItemButton>
            </ListItem>
            <Divider className="server-settings-divider" variant="middle" light={true} />
            <ListItem className="server-settings-item">
                <ListItemButton
                    onClick={() => handleDeleteServer()}
                    className="server-settings-button server-settings-danger"
                >
                    <Typography variant="h6" className="server-settings-title">
                        Delete Server
                    </Typography>
                    <DeleteForeverIcon className="server-settings-icon" />
                </ListItemButton>
            </ListItem>
        </Popover>
    );
}
