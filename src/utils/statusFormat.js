//Change the format of status text
export const statusFormat = (status) => {
    if (status === "online") {
        return "Online"
    }
    if (status === "offline") {
        return "Offline"
    }
    if (status === "donotdisturb") {
        return "Do Not Disturb"
    }
    if (status === "invisible") {
        return "Invisible"
    }
    if (status === "idle") {
        return "Idle"
    }
}