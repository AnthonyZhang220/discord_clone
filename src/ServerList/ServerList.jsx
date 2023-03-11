import React from 'react'
import { Stack } from '@mui/system'
import { Avatar } from '@mui/material'
import { Box } from '@mui/system'
import "./ServerList.scss"

const ServerList = () => {
    return (
        <Box component='aside' className="serverlist-container">
            <Box component="ul" className="serverlist-tree" role="tree">
                <Box className="serverlist-scroller">
                    <Box className="serverlist-items">
                        <Box className="listItem">
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                        </Box>
                        <Box className="listItem">
                            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                        </Box>
                        <Box className="listItem">
                            <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                        </Box>
                        <Box className="listItem">
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                        </Box>
                        <Box className="listItem">
                            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                        </Box>
                        <Box className="listItem">
                            <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                        </Box>
                        <Box className="listItem">
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                        </Box>
                        <Box className="listItem">
                            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                        </Box>
                        <Box className="listItem">
                            <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default ServerList