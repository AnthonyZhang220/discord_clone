import AgoraRTC, { AgoraRTCProvider, AgoraRTCScreenShareProvider } from "agora-rtc-react";
import React, { useState } from "react";


export const AgoraClient = ({ children, clientConfig = { mode: "rtc", codec: "vp8" } }) => {
    const [client] = useState(() => AgoraRTC.createClient(clientConfig));
    return <AgoraRTCScreenShareProvider client={client}>
        <AgoraRTCProvider client={client}>{children}</AgoraRTCProvider>;
    </AgoraRTCScreenShareProvider>
};

export default AgoraClient;