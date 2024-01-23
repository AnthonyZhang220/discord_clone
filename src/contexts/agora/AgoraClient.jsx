import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import React, { useState } from "react";


export const AgoraClient = ({ children, clientConfig = { mode: "rtc", codec: "vp8" } }) => {
    const [client] = useState(() => AgoraRTC.createClient(clientConfig));
    return <AgoraRTCProvider client={client}>{children}</AgoraRTCProvider>;
};

export default AgoraClient;