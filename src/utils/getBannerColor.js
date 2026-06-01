import { prominent } from "color.js";

export const getBannerColor = async (avatar) => {
    const fallback = "rgb(88, 101, 242)";

    if (!avatar) {
        return fallback;
    }

    try {
        const color = await prominent(avatar, { amount: 1 });
        if (!Array.isArray(color) || color.length < 3) {
            return fallback;
        }
        return `rgb(${color.join(", ")})`;
    } catch (error) {
        return fallback;
    }
};
