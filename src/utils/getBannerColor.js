import { prominent } from "color.js";


export const getBannerColor = async (profileURL) => {
    const color = await prominent(profileURL, { amount: 1 })
    const rgbCode = `rgb(${color.join(", ")})`;
    return rgbCode;
}