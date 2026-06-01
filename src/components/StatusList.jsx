import React, { memo } from "react";

import CircleIcon from "@mui/icons-material/Circle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import DarkModeIcon from "@mui/icons-material/DarkMode";

// styles moved to ThemeContextProvider / global SCSS

const StatusList = ({ status, size = 16, edge }) => {
    const colorMap = {
        online: "var(--status-online)",
        idle: "var(--status-idle)",
        donotdisturb: "var(--status-dnd)",
        invisible: "var(--status-offline)",
        offline: "var(--status-offline)",
    };

    const color = colorMap[status] || "inherit";

    const commonProps = { edge, style: { fontSize: size, color } };

    const list = {
        online: <CircleIcon {...commonProps} className={`status-icon status-online`} />,
        idle: <DarkModeIcon {...commonProps} className={`status-icon status-idle`} />,
        donotdisturb: <RemoveCircleIcon {...commonProps} className={`status-icon status-dnd`} />,
        invisible: <StopCircleIcon {...commonProps} className={`status-icon status-muted`} />,
        offline: <StopCircleIcon {...commonProps} className={`status-icon status-muted`} />,
    };

    return list[status] || null;
};

export default memo(StatusList);
