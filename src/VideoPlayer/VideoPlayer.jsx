import React, { useState, useEffect, useRef } from 'react'
import { Box, Avatar, Button } from '@mui/material'
import "./VideoPlayer.scss"


function VideoPlayer({ remoteUser, currentAgoraUID }) {
    const videoRef = useRef()
    const audioRef = useRef()


    useEffect(() => {
        if (remoteUser.videoTrack) {
            remoteUser.videoTrack?.play(videoRef.current)
        }

        if (remoteUser.audioTrack) {
            if (remoteUser.uid !== currentAgoraUID) {
                remoteUser.audioTrack?.play(audioRef.current)
            }
        }


    }, [remoteUser.videoTrack])


    return (
        <React.Fragment>
            <video autoPlay ref={videoRef} style={{ position: "relative", opacity: 1, left: 0, top: 0 }} />
            <audio autoPlay ref={audioRef} />
        </React.Fragment>
    )
}

export default VideoPlayer