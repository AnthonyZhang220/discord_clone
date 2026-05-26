import axios from "axios";
import store from "@/redux/store";

export default async function fetchRTCToken(config, channelName) {
    const userId = store.getState().auth.user.id;

    return new Promise(function (resolve, reject) {
        if (channelName) {
            // 调用你的 Cloudflare Worker
            const workerUrl = config.serverUrl + "/token";

            axios
                .post(workerUrl, {
                    channelName: channelName,
                    uid: userId || 0,
                    expiry: config.tokenExpiryTime || 3600,
                    role: "publisher",
                })
                .then((response) => {
                    // Agora Token retrieved successfully
                    resolve(response.data.token);
                })
                .catch((error) => {
                    // Failed to get Agora token
                    reject(error);
                });
        } else {
            reject(new Error("channelName is required"));
        }
    });
}
