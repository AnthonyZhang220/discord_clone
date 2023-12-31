export function bytesToMB(bytes) {
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(2);
}