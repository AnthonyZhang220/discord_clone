import React, { memo } from "react"

import CircleIcon from '@mui/icons-material/Circle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import DarkModeIcon from '@mui/icons-material/DarkMode';


const StatusList = ({ status, size, edge }) => {
    const list = {
        "online": <CircleIcon edge={edge} sx={{ color: "#23a55a", fontSize: size }} />,
        "idle": <DarkModeIcon edge={edge} sx={{ color: "#f0b132", fontSize: size }} />,
        "donotdisturb": <RemoveCircleIcon edge={edge} sx={{ color: "#f23f43", fontSize: size }} />,
        "invisible": <StopCircleIcon edge={edge} sx={{ color: "#80848e", fontSize: size }} />,
        "offline": <StopCircleIcon edge={edge} sx={{ color: "#80848e", fontSize: size }} />,
    }

    return (
        list[status]
    )
}

export default memo(StatusList);