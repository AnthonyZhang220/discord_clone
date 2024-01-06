import React from "react"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Divider } from '@mui/material';
import Fade from '@mui/material/Fade';
import Popper, { PopperPlacementType } from '@mui/material/Popper';
import { styled } from '@mui/material/styles';
import { ListItem, ListItemButton, Popover, Typography } from '@mui/material'
import { toggleServerSettings } from "../../../redux/features/popoverSlice";
import { handleInviteToServer, handleDeleteServer } from "../../../utils/handlers/serverHandlers";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SettingsIcon from '@mui/icons-material/Settings';
import { useDispatch, useSelector } from "react-redux";

//server settings menu
export default function ServerSettings({ channelHeaderRef }) {
    const dispatch = useDispatch();
    const { serverSettingsPopover } = useSelector(state => state.popover)
    return (
        <Popover
            open={serverSettingsPopover}
            onClose={() => dispatch(toggleServerSettings())}
            anchorEl={channelHeaderRef.current}
            anchorReference="anchorEl"
            PaperProps={{
                style: {
                    backgroundColor: "#111214", borderRadius: "4px", width: "220px"
                }
            }}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <ListItem sx={{
                p: 0.75
            }}>
                <ListItemButton onClick={() => handleInviteToServer()} sx={{
                    color: "#949cf7",
                    borderRadius: "4px",
                    "&:hover": {
                        backgroundColor: "#5865f2",
                        color: "#ffffff"
                    }
                }}>
                    <Typography variant='h6' sx={{ color: "inherit", marginRight: "auto" }}>
                        Invite People
                    </Typography>
                    <PersonAddAlt1Icon sx={{ marginLeft: "auto", fontSize: 20 }} />
                </ListItemButton>
            </ListItem>
            <ListItem sx={{ p: 0.75 }}>
                <ListItemButton onClick={() => dispatch(toggleServerSettings())} sx={{
                    color: "#ffffff",
                    borderRadius: "4px",
                    "&:hover": {
                        backgroundColor: "#5865f2",
                        color: "#ffffff"
                    }
                }}>
                    <Typography variant='h6' sx={{ color: "inherit", marginRight: "auto" }}>
                        Server Settings
                    </Typography>
                    <SettingsIcon sx={{ marginLeft: "auto", fontSize: 20 }} />
                </ListItemButton>
            </ListItem>
            <Divider sx={{ backgroundColor: "#8a8e94" }} variant="middle" light={true} />
            <ListItem sx={{ p: 0.75 }}>
                <ListItemButton onClick={() => handleDeleteServer()} sx={{
                    color: "#f23f42",
                    borderRadius: "4px",
                    "&:hover": {
                        backgroundColor: "#f23f42",
                        color: "#ffffff"
                    }
                }}>
                    <Typography variant='h6' sx={{ color: "inherit", marginRight: "auto" }}>
                        Delete Server
                    </Typography>
                    <DeleteForeverIcon sx={{ marginLeft: "auto", fontSize: 20 }} />
                </ListItemButton>
            </ListItem>
        </Popover>
    )
}