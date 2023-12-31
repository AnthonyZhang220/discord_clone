export function copyToClip(text) {
    navigator.clipboard.writeText(text).then(() => {
        return true;
    })
}