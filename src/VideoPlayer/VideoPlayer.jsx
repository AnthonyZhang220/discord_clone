import React, { useState, useEffect, useRef } from 'react'
import { Box, Avatar, Button } from '@mui/material'
import "./VideoPlayer.scss"


function VideoPlayer({ liveUser, currentAgoraUID }) {
    const videoRef = useRef()
    const audioRef = useRef()


    useEffect(() => {
        if (liveUser.videoTrack) {
            liveUser.videoTrack?.play(videoRef.current)
        }

        if (liveUser.audioTrack) {
            if (liveUser.uid !== currentAgoraUID) {
                liveUser.audioTrack?.play(audioRef.current)
            }
        }


    }, [liveUser.videoTrack])


    return (
        <React.Fragment>
            <video autoPlay ref={videoRef} style={{ position: "relative", opacity: 1, left: 0, top: 0 }} />
            <audio autoPlay ref={audioRef} />
        </React.Fragment>
    )
}

export default VideoPlayer