import axios from "axios";

export default async function fetchRTCToken(config, channelName) {
    if (config.serverUrl !== "") {
        try {
            const bodyData = {
                tokenType: "rtc",
                channel: channelName,
                role: "publisher",
                uid: 0,
                expire: 3600,
            };

            const bodyString = JSON.stringify(bodyData);
            const getUrl = `${config.serverUrl}/rtc/${channelName}/publisher/rtc/0`;
            const postUrl = `${config.serverUrl}/getToken`
            const response = await fetch(getUrl, {
                method: "GET",
            });
            const data = await response.json();
            console.log("RTC token fetched from server: ", data.rtcToken);
            return data.rtcToken;
        } catch (error) {
            console.error(error);
            throw error;
        }
    } else {
        return config.rtcToken;
    }
}