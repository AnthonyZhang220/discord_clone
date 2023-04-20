import React from "react"
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { ListItemButton, InputBase, Button, ButtonBase, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StatusMenu = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        background: "#111214", borderRadius: "4px", width: "340px", fontSize: 12,
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
        color: "#1e2124",
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#1e2124",
    },
}));


export const InfoInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: "#e3e5e8",
        border: 'none',
        fontSize: 16,
        padding: '10px 12px',
    },
}));


export const FunctionTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#1e2124",
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: "#1e2124",
    },
}));


export const MemberListItemButton = styled(ListItemButton)(() => ({
    padding: "2px 2px 2px 2px",
}));


export const FriendTopButton = styled(Button)(() => ({
    "&:focus": {
        backgroundColor: "#ffffff",

    },
    "&:hover": {
        color: "lighten(#ffffff, 2.5%)",
    }
}))

export const SearchFriendInput = styled(InputBase)(() => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: "#e3e5e8",
        border: 'none',
        fontSize: 16,
        padding: '10px 12px',
    },
}))

export const FriendMessageIconButton = styled(IconButton)(() => ({
    '& .MuiIconButton-root': {
        backgroundColor: "#2b2d31",
    },
    "& .MuiButtonBase-root": {
        backgroundColor: "#2b2d31",
    },
    "&:hover": {
        backgroundColor: "#2b2d31",
    }

}))

