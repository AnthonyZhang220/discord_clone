import React from "react";
import { Tooltip, tooltipClasses } from "@/components/compat/RadixCompat";
import { ListItemButton, InputBase, Button, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StatusMenu = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        background: theme.palette.background.paper,
        borderRadius: "4px",
        width: "340px",
        fontSize: 12,
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        maxHeight: "calc(100vh - 28px)",
    },
}));

export const MenuListItemButton = styled(ListItemButton)(() => ({
    padding: "2px 2px 2px 2px",
}));

export const ServerNameTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.background.paper,
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.background.paper,
    },
}));

export const InfoInput = styled(InputBase)(({ theme }) => ({
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
    },
}));

export const FunctionTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.background.paper,
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.background.paper,
    },
}));

export const MemberListItemButton = styled(ListItemButton)(() => ({
    padding: "2px 2px 2px 2px",
}));

export const FriendTopButton = styled(Button)(({ theme }) => ({
    "&:focus": {
        backgroundColor: theme.palette.background.paper,
    },
    "&:hover": {
        color: theme.palette.text.primary,
    },
}));

export const SearchFriendInput = styled(InputBase)(({ theme }) => ({
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
    },
}));

export const FriendMessageIconButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    "&:hover": {
        backgroundColor: theme.palette.background.paper,
    },
}));
