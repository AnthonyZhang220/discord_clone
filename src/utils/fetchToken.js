import axios from "axios";

export const fetchToken = async (config) => {
    return new Promise(function (resolve) {
        if (config.channel) {
            axios.get(config.serverUrl + '/rtc/' + config.channel + '/1/uid/' + "0" + '/?expiry=' + config.ExpireTime)
                .then(
                    response => {
                        resolve(response.data.rtcToken);
                    })
                .catch(error => {
                    console.log(error);
                });
        }
    });
}