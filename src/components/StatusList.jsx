import React, { memo } from "react";

import CircleIcon from "@mui/icons-material/Circle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import DarkModeIcon from "@mui/icons-material/DarkMode";

// styles moved to ThemeContextProvider / global SCSS

const StatusList = ({ status, size, edge }) => {
    const list = {
        online: (
            <CircleIcon
                edge={edge}
                className={`status-icon status-online`}
                style={{ fontSize: size }}
            />
        ),
        idle: (
            <DarkModeIcon
                edge={edge}
                className={`status-icon status-idle`}
                style={{ fontSize: size }}
            />
        ),
        donotdisturb: (
            <RemoveCircleIcon
                edge={edge}
                className={`status-icon status-dnd`}
                style={{ fontSize: size }}
            />
        ),
        invisible: (
            <StopCircleIcon
                edge={edge}
                className={`status-icon status-muted`}
                style={{ fontSize: size }}
            />
        ),
        offline: (
            <StopCircleIcon
                edge={edge}
                className={`status-icon status-muted`}
                style={{ fontSize: size }}
            />
        ),
    };

    return list[status];
};

export default memo(StatusList);
