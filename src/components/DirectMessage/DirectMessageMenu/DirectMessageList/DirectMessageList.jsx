import { ListItem, ListItemButton, ListItemText, ListItemAvatar, Badge, Avatar } from "@mui/material";

export const DirectMessageList = ({ userId, status, name, avatar }) => {

    return (
        <ListItem id={userId} disablePadding sx={{ p: 0, m: 0 }} className="friend-conversation-item">
            <ListItemButton onClick={() => handleCurrentPrivateChannel(userId)} sx={{
                backgroundColor: currentPrivateChannel.uid == userId ? lighten("#313338", 0.1) : "inherit",
            }}>
                <ListItemAvatar sx={{ minWidth: "0", mr: 1 }}>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                            <StatusList status={status} size={12} />
                        }
                    >
                        <Avatar alt={name} src={avatar} sx={{ width: 32, height: 32 }} />
                    </Badge>
                </ListItemAvatar>
                <ListItemText primary={name} />
            </ListItemButton>
        </ListItem>
    )
}