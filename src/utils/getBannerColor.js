import { prominent } from "color.js";


export const getBannerColor = async (avatar) => {
    const color = await prominent(avatar, { amount: 1 })
    const rgbCode = `rgb(${color.join(", ")})`;
    return rgbCode;
}