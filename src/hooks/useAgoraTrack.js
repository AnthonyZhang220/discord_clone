import { useEffect } from "react";

export function useAgoraTrack({ track, shouldPublish, isConnected, client, name }) {
    useEffect(() => {
        if (!track || !isConnected) return;

        const controller = new AbortController();

        const run = async () => {
            try {
                if (shouldPublish) {
                    await track.setEnabled?.(true);
                    if (controller.signal.aborted) return;
                    await client.publish(track);
                } else {
                    await client.unpublish(track);
                    if (controller.signal.aborted) return;
                    await track.setEnabled?.(false);
                }
            } catch (e) {
                if (!e?.message?.includes("already")) {
                    console.warn(`[Agora] ${name} op failed:`, e);
                }
            }
        };

        run();
        return () => controller.abort();
    }, [track, shouldPublish, isConnected, client, name]);
}
