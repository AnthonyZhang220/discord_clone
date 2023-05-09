
import AgoraRTC from 'agora-rtc-sdk-ng';

export const AgoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })


export const AgoraConfig = {
    appId: process.env.REACT_APP_AGORA_APP_ID,
    // Set the channel name.
    channel: null,
    // Pass your temp token here.
    token: null,
    ExpireTime: 3600,
    // Set the user ID.
    uid: 0,
    serverUrl: process.env.REACT_APP_SERVER_URL,

}