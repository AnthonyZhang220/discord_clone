export const convertDate = (date) => {
    const newDate = new Date(date.seconds * 1000)
    const formattedDate = newDate.toLocaleDateString('en-US', { month: "2-digit", day: "2-digit", year: "2-digit" })
    const now = new Date();
    const timeDiff = Math.abs(now.getTime() - newDate.getTime())

    const oneDay = 24 * 60 * 60 * 1000;

    const millisecondsInCurrentDay = now.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    if (timeDiff <= millisecondsInCurrentDay) {
        return "Today at"
    }

    if (timeDiff <= millisecondsInCurrentDay + oneDay) {
        return "Yesterday at"
    }

    return formattedDate;

}

export const convertDateDivider = (date) => {
    const newDate = new Date(date.seconds * 1000)
    const formattedDate = newDate.toLocaleDateString('en-US', { month: "long", day: "numeric", year: "numeric" })
    const now = new Date();
    const timeDiff = Math.abs(now.getTime() - newDate.getTime())

    const oneDay = 24 * 60 * 60 * 1000;

    const millisecondsInCurrentDay = now.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();


    return formattedDate;

}

export const convertTime = (time) => {
    const newTime = new Date(time.seconds * 1000)
    const formattedTime = newTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    return formattedTime;
}