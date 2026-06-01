import React from "react";

import { Tooltip } from "@/components/compat/RadixCompat";
import { useSelector } from "react-redux";
import SignalCellularAltRoundedIcon from "@mui/icons-material/SignalCellularAltRounded";
import CallEndRoundedIcon from "@mui/icons-material/CallEndRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import ScreenShareRoundedIcon from "@mui/icons-material/ScreenShareRounded";
import { toggleScreenShare, toggleCamera } from "@/handlers/voiceControlHandlers";
import { handleLeaveVoiceChannel } from "@/handlers/voiceChannelHandlers";

import "./CallControls.scss";

export default function CallControls() {
    const { isCameraOn, isScreenSharingActive, connectionState, latency } = useSelector(
        (state) => state.voiceChat
    );
    const { currVoiceChannel } = useSelector((state) => state.channel);

    const latencyClass =
        latency < 100 ? "latency-good" : latency < 300 ? "latency-warn" : "latency-bad";

    return (
        <footer className="call-controls-container">
            <div className="call-controls-upper">
                <div className="call-controls-details">
                    <div
                        className={
                            "call-controls-status " +
                            (connectionState !== "DISCONNECTED" ? "call-controls-connected" : "")
                        }
                    >
                        <Tooltip
                            arrow
                            componentsProps={{
                                tooltip: { className: `latency-tooltip ${latencyClass}` },
                            }}
                            title={
                                <React.Fragment>
                                    <span>{latency} ms</span>
                                </React.Fragment>
                            }
                            placement="top"
                        >
                            <span>
                                <SignalCellularAltRoundedIcon className="callcontrols-signal-icon" />
                            </span>
                        </Tooltip>
                        <span
                            className={
                                connectionState !== "DISCONNECTED"
                                    ? "call-controls-link call-controls-connected"
                                    : "call-controls-link"
                            }
                        >
                            {connectionState}
                        </span>
                    </div>
                    <div className="callcontrols-breadcrumbs" aria-label="breadcrumb">
                        <button type="button" className="breadcrumb-link">
                            {connectionState !== "DISCONNECTED"
                                ? currVoiceChannel.serverName
                                : connectionState}
                        </button>
                        <span className="breadcrumb-separator">/</span>
                        <button type="button" className="breadcrumb-link">
                            {connectionState !== "DISCONNECTED"
                                ? currVoiceChannel.name
                                : connectionState}
                        </button>
                    </div>
                </div>
                <div className="call-controls-disconnected">
                    <Tooltip title="Disconnect" placement="top">
                        <span>
                            <button
                                type="button"
                                className="call-controls-button call-controls-disconnect"
                                aria-label="Disconnect"
                                onClick={() => {
                                    handleLeaveVoiceChannel();
                                }}
                            >
                                <CallEndRoundedIcon className="callcontrols-callend-icon" />
                            </button>
                        </span>
                    </Tooltip>
                </div>
            </div>
            <div className="call-controls-lower">
                <div className="call-controls-buttons button-group call-controls-buttons-right">
                    <Tooltip
                        title={isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
                        placement="top"
                    >
                        <span>
                            <button
                                type="button"
                                className={`call-controls-button toggle-camera ${isCameraOn ? "on" : "off"}`}
                                aria-label={isCameraOn ? "Camera On" : "Camera Off"}
                                onClick={() => {
                                    toggleCamera();
                                }}
                            >
                                <VideocamRoundedIcon className="callcontrols-toggle-icon" />
                            </button>
                        </span>
                    </Tooltip>
                    <Tooltip
                        title={
                            isScreenSharingActive ? "Stop sharing Your Screen" : "Share Your Screen"
                        }
                        placement="top"
                    >
                        <span>
                            <button
                                type="button"
                                className={`call-controls-button toggle-screenshare ${isScreenSharingActive ? "on" : "off"}`}
                                aria-label={
                                    isScreenSharingActive ? "sharing enabled" : "sharing disabled"
                                }
                                onClick={() => {
                                    toggleScreenShare();
                                }}
                            >
                                <ScreenShareRoundedIcon className="callcontrols-toggle-icon" />
                            </button>
                        </span>
                    </Tooltip>
                </div>
            </div>
        </footer>
    );
}
