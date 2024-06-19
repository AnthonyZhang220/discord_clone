import axios from "axios";
import store from "../redux/store";

export default async function fetchRTCToken(config, channelName) {
    const userId = store.getState().auth.user.id;
    return new Promise(function (resolve) {
        if (channelName) {
            const url = `${config.serverUrl}/rtc/${channelName}/publisher/uid/0/?expiry=${config.tokenExpiryTime}`
            console.log(url)
            axios.get(url).then(
                response => {
                    console.log(response.data.rtcToken)
                    resolve(response.data.rtcToken);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    });
}