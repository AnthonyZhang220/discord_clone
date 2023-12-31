import { EncryptionMode, UID, SDK_MODE } from "agora-rtc-sdk-ng";

const AgoraConfig = {
    uid: 0,
    serverUrl: process.env.REACT_APP_SERVER_URL,
    appId: process.env.REACT_APP_AGORA_APP_ID,
    channelName: 'test', // your agora channel
    rtcToken: "",
    tokenExpiryTime: 600,
    proxyUrl: "http://localhost:8080/",
    encryptionMode: "aes-128-gcm2",
    salt: "",
    encryptionKey: "",
    destChannelName: "",
    destChannelToken: "",
    destUID: 2,
    secondChannel: "",
    secondChannelToken: "",
    secondChannelUID: 2,
    selectedProduct: "rtc"
};

export default AgoraConfig;