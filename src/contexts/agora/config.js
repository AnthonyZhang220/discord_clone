import { EncryptionMode, UID, SDK_MODE } from "agora-rtc-sdk-ng";

let appId = process.env.REACT_APP_AGORA_APP_ID;

// if (import.meta.env.AGORA_AES_SALT) {
//     // only for github-pages demo
//     const bytes = CryptoJS.AES.decrypt(import.meta.env.AGORA_APPID, import.meta.env.AGORA_AES_SALT);
//     appId = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
// }


const AgoraConfig = {
    uid: 0,
    serverUrl: process.env.REACT_APP_SERVER_URL,
    appId: process.env.REACT_APP_AGORA_APP_ID,
    channelName: 'test', // your agora channel
    rtcToken: "",
    tokenExpiryTime: 3600,
    token: "",
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