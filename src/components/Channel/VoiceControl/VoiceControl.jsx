import React from "react";

import { IconButton, Typography, Link, Breadcrumbs } from "@mui/material";
import { Tooltip } from "@/components/compat/RadixCompat";
import { useSelector } from "react-redux";
import SignalCellularAltRoundedIcon from "@mui/icons-material/SignalCellularAltRounded";
import CallEndRoundedIcon from "@mui/icons-material/CallEndRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import ScreenShareRoundedIcon from "@mui/icons-material/ScreenShareRounded";
import { toggleScreenShare, toggleCamera } from "@/handlers/voiceControlHandlers";
import { handleLeaveVoiceChannel } from "@/handlers/voiceChannelHandlers";

import "./VoiceControl.scss";

export default function VoiceControl() {
    const { isCameraOn, isScreenSharingOn, connectionState, latency } = useSelector(
        (state) => state.voiceChat
    );
    const { currVoiceChannel } = useSelector((state) => state.channel);

    const latencyClass =
        latency < 100 ? "latency-good" : latency < 300 ? "latency-warn" : "latency-bad";

    return (
        <footer className="voice-control-container">
            <div className="voice-control-upper">
                <div className="voice-control-details">
                    <div
                        className={
                            "voice-control-status " +
                            (connectionState !== "DISCONNECTED" ? "voice-control-connected" : "")
                        }
                    >
                        <Tooltip
                            arrow
                            componentsProps={{
                                tooltip: { className: `latency-tooltip ${latencyClass}` },
                            }}
                            title={
                                <React.Fragment>
                                    <Typography variant="body2">{latency} ms</Typography>
                                </React.Fragment>
                            }
                            placement="top"
                        >
                            <span>
                                <SignalCellularAltRoundedIcon className="voicecontrol-signal-icon" />
                            </span>
                        </Tooltip>
                        <Link
                            underline="hover"
                            variant="body1"
                            className={
                                connectionState !== "DISCONNECTED"
                                    ? "voice-control-link voice-control-connected"
                                    : "voice-control-link"
                            }
                        >
                            {connectionState}
                        </Link>
                    </div>
                    <Breadcrumbs
                        aria-label="breadcrumb"
                        separator="/"
                        className="voicecontrol-breadcrumbs"
                    >
                        <Link underline="hover" variant="body2">
                            {connectionState !== "DISCONNECTED"
                                ? currVoiceChannel.serverName
                                : connectionState}
                        </Link>
                        <Link underline="hover" variant="body2">
                            {connectionState !== "DISCONNECTED"
                                ? currVoiceChannel.name
                                : connectionState}
                        </Link>
                    </Breadcrumbs>
                </div>
                <div className="voice-control-disconnected">
                    <Tooltip title="Disconnect" placement="top">
                        <IconButton
                            className="voice-control-button"
                            aria-label="Defen"
                            onClick={() => {
                                handleLeaveVoiceChannel();
                            }}
                        >
                            <CallEndRoundedIcon className="voicecontrol-callend-icon" />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <div className="voice-control-lower">
                <div className="voice-control-buttons button-group voice-control-buttons-right">
                    <Tooltip
                        title={isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
                        placement="top"
                    >
                        <div
                            className={
                                "voice-control-button toggle-camera " + (isCameraOn ? "on" : "off")
                            }
                            aria-label={isCameraOn ? "Camera On" : "Camera Off "}
                            onClick={() => {
                                toggleCamera();
                            }}
                        >
                            <IconButton>
                                <VideocamRoundedIcon className="voicecontrol-toggle-icon" />
                            </IconButton>
                        </div>
                    </Tooltip>
                    <Tooltip
                        title={isScreenSharingOn ? "Stop sharing Your Screen" : "Share Your Screen"}
                        placement="top"
                    >
                        <div
                            className={
                                "voice-control-button toggle-screenshare " +
                                (isScreenSharingOn ? "on" : "off")
                            }
                            aria-label={isScreenSharingOn ? "sharing enabled" : "sharing disabled"}
                            onClick={() => {
                                toggleScreenShare();
                            }}
                        >
                            <IconButton>
                                <ScreenShareRoundedIcon className="voicecontrol-toggle-icon" />
                            </IconButton>
                        </div>
                    </Tooltip>
                </div>
            </div>
        </footer>
    );
}
