import React, { useEffect } from 'react'
import { Box, Avatar, Grid, Button, Typography, IconButton } from '@mui/material'
import VideocamIcon from '@mui/icons-material/Videocam';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { Mic } from '@mui/icons-material';
import { LocalAudioTrack, LocalUser, LocalVideoTrack, RemoteAudioTrack, RemoteUser, RemoteVideoTrack, useRemoteAudioTracks, useRemoteVideoTracks } from 'agora-rtc-react';
import "./VoiceChatTile.scss";

function VoiceChatTile({ user, volume, hasVideo, hasAudio, videoTrack, audioTrack, localUser }) {
    useEffect(() => {
        console.log(hasVideo, hasAudio)
    }, [hasVideo, hasAudio])
    return (
        <Box className="voicechat-tile" sx={{ transition: "background-color 0.1s" }} >
            <Box className="video-wrapper">
                {
                    localUser ?
                        <>
                            <LocalVideoTrack track={videoTrack} play={hasVideo} disabled={!hasVideo} />
                            <LocalAudioTrack track={audioTrack} play={false} disabled={!hasAudio} />
                        </>
                        :
                        <div id={user.uid}>
                            {/* <RemoteVideoTrack track={videoTrack} play={hasVideo} muted={false} />
                            <RemoteAudioTrack track={audioTrack} play={hasAudio} /> */}
                            <RemoteUser user={user} playVideo={hasVideo} playAudio={hasAudio} />
                        </div>
                }
            </Box>
            <Box className="video-overlay">
                <Box className="overlay-container">
                    <Box className="overlay-top">
                    </Box>
                    {
                        !hasVideo &&
                        <Avatar src={user.avatar} alt={user.displayName} className='overlay-avatar' sx={{ width: 75, height: 75 }} imgProps={{ crossOrigin: "Anonymous" }} />
                    }
                    <Box className="overlay-bottom">
                        <Box>
                            <Button sx={{ color: volume > 50 ? "green" : "white" }} variant="outlined" startIcon={hasVideo ? <VideocamIcon /> : <VideocamOffIcon />}>
                                <Typography variant='h5'>
                                    {user.displayName}
                                    {user.uid}
                                </Typography>
                            </Button>
                        </Box>
                        <Box>
                            <IconButton sx={{ color: "white", border: "solid 1px" }} >
                                {
                                    hasAudio ?
                                        <Mic />
                                        :
                                        <MicOffIcon />
                                }
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default VoiceChatTile