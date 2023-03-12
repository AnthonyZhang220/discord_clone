import React from 'react'
import { Stack } from '@mui/system'
import { Avatar } from '@mui/material'
import { Box } from '@mui/system'
import "./ServerList.scss"

const ServerList = () => {



    const handleOnClick = () => {
    }
    
    React.useEffect(()=>{
        const $ = document.querySelectorAll.bind(document);
        
        $(".server").forEach(el => {
            el.addEventListener("click", () => {
                const activeServer = $(".server.active")[0];
                activeServer.classList.remove("active");
                activeServer.removeAttribute("aria-selected");
    
                el.classList.add("active");
                el.setAttribute("aria-selected", true);
            });
        })

        $(".focusable, .button").forEach(el => {
            // blur only on mouse click
            // for accessibility, keep focus when keyboard focused
            el.addEventListener("mousedown", e => e.preventDefault());
            el.setAttribute("tabindex", "0");
        });
        
    })
    return (
        <Box component='aside' className="servers">
            <Box component="ul" className="servers-list">
                <Box className="server focusable server-friends unread" component="li" role="button" aria-label="Discord Developers unread">
                    <Avatar className="server-icon" src="https://cdn.discordapp.com/embed/avatars/0.png"/>
                </Box>
                <Box className="server focusable unread" component="li" role="button" aria-label="My Server" aria-selected="true">
                    <Avatar className="server-icon"  src="https://cdn.discordapp.com/embed/avatars/1.png" />
                </Box>
                <Box className="server focusable unread" component="li">
                    <Avatar className="server-icon" src="https://cdn.discordapp.com/embed/avatars/2.png" />
                </Box>
                <Box className="server focusable active" component="li">
                    <Avatar className="server-icon" src="https://cdn.discordapp.com/embed/avatars/3.png" />
                </Box>
                <Box className="server focusable unread" component="li">
                    <Avatar className="server-icon" src="https://cdn.discordapp.com/embed/avatars/4.png" />
                </Box>
                <Box className="server focusable unread" component="li">
                    <Avatar className="server-icon" src="https://cdn.discordapp.com/embed/avatars/5.png" />
                </Box>
                <Box className="server focusable unread" component="li">
                    <Avatar className="server-icon" src="https://cdn.discordapp.com/embed/avatars/6.png" />
                </Box>
                <Box className="server focusable unread" component="li">
                    <Avatar className="server-icon" src="https://cdn.discordapp.com/embed/avatars/7.png" />
                </Box>
                <Box className="server focusable" component="li">
                    <Avatar className="server-icon" src="https://cdn.discordapp.com/embed/avatars/8.png" />
                </Box>
            </Box>
        </Box>
    )
}

export default ServerList

    // < aside class="servers" >
	// 	<div class="servers-collection">
	// 		<div class="server focusable server-friends unread" role="button" aria-label="Friends unread">
	// 			<div class="server-icon"><svg><use xlink:href="#icon-friends" /></svg></div>
	// 		</div>
	// 	</div>
		
	// 	<div class="servers-collection">
	// 		<div class="server focusable unread" role="button" aria-label="Discord Developers unread">
	// 			<div class="server-icon"><img src="https://cdn.discordapp.com/icons/41771983423143937/edc44e98a690a1f76c5ddec68a0a6b9e.png" /></div>
	// 		</div>
	// 	</div>
		
	// 	<div class="servers-collection">
	// 		<div class="server focusable active" role="button" aria-label="My Server" aria-selected="true">
	// 			<div class="server-icon"><img src="https://discordapp.com/assets/0e291f67c9274a1abdddeb3fd919cbaa.png" /></div>
	// 		</div>
	// 	</div>
	// </aside >