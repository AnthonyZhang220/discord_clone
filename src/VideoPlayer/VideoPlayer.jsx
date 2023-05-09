import React, { useState, useEffect, useRef } from 'react'
import { Box, IconButton, Avatar, Button, Typography } from '@mui/material'
import MicOffIcon from '@mui/icons-material/MicOff';
import "./VideoPlayer.scss"
import { Query, onSnapshot, query, where, collection } from 'firebase/firestore';
import { db } from '../firebase';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

function VideoPlayer({ liveUser }) {
    const videoRef = useRef()
    const audioRef = useRef()

    const [tileInfo, setTileInfo] = useState({ avatar: null, name: null, volume: 0 })

    useEffect(() => {
        if (liveUser.firebaseUID) {
            const q = query(collection(db, "users"), where("userRef", "==", liveUser.firebaseUID))

            const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                QuerySnapshot.forEach((doc) => {
                    if (doc.exists()) {
                        setTileInfo({ ...tileInfo, avatar: doc.data().profileURL, name: doc.data().displayName })
                    }
                })
            })
        }
    }, [liveUser.firebaseUID])

    useEffect(() => {
        if (liveUser.videoTrack) {
            liveUser.videoTrack?.play(videoRef.current)
        }

    }, [liveUser])


    return (
        <Box className="voicechat-row">
            <Box className="voicechat-tile">
                {
                    liveUser ?
                        <Box>
                            <Button variant="outlined" startIcon={<VideocamIcon />}>
                                {tileInfo.name}
                            </Button>
                            <Typography>
                                {liveUser.volume}
                            </Typography>
                            <video ref={videoRef} style={{ position: "relative", opacity: 1, left: 0, top: 0 }} />
                            {
                                liveUser.audioTrack?.muted ?
                                    <IconButton className="voicechat-indicator">
                                        <MicOffIcon />
                                    </IconButton>
                                    :
                                    null
                            }
                        </Box>
                        :
                        <Box>
                            <Button variant="outlined" startIcon={<VideocamOffIcon />}>
                                {tileInfo.name}
                            </Button>
                            <Avatar src={tileInfo.avatar} alt={tileInfo.name} sx={{ display: "flex", justifyContent: "center", alignItem: "center" }} />
                        </Box>
                }
            </Box>
        </Box>
    )
}

export default VideoPlayer