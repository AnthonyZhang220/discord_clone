import React, { useState, useRef, useEffect } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import GifBoxIcon from "@mui/icons-material/GifBox";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { Tooltip } from "@/components/compat/RadixCompat";
import { handleUploadFile } from "@/handlers/messageHandlers";
import "../../styles/_message-input.scss";

export default function MessageInput({ draft, onChange, placeholder }) {
    const uploadAdornmentRef = useRef(null);
    const [openUpload, setOpenUpload] = useState(false);

    const handleUploadOpen = () => setOpenUpload(true);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                openUpload &&
                uploadAdornmentRef.current &&
                !uploadAdornmentRef.current.contains(event.target)
            ) {
                setOpenUpload(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [openUpload]);

    return (
        <div className="form-control">
            <div className="input-with-adornment">
                <span ref={uploadAdornmentRef} className="left-adornment">
                    <Tooltip
                        onClose={() => setOpenUpload(false)}
                        open={openUpload}
                        title={
                            <label className="upload-listitembutton">
                                <input
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept="audio/*,video/*,image/*"
                                    style={{ display: "none" }}
                                    onChange={(e) => handleUploadFile(e)}
                                />
                                <span className="upload-icon">
                                    <FileUploadIcon />
                                </span>
                                <span className="upload-text">
                                    <strong>Upload a File</strong>
                                    <span className="upload-description">
                                        Accept format, image, video, audio, text. File size limit
                                        &lt;50MB.
                                    </span>
                                </span>
                            </label>
                        }
                    >
                        <button type="button" className="icon-button" onClick={handleUploadOpen}>
                            <AddCircleIcon />
                        </button>
                    </Tooltip>
                </span>

                <input
                    className="message-input"
                    id="name"
                    name="message"
                    autoComplete="off"
                    onChange={(e) => onChange(e.target.value)}
                    value={draft}
                    placeholder={placeholder}
                />

                <span className="right-adornments">
                    <button type="button" className="icon-button" aria-label="Gift">
                        <CardGiftcardIcon />
                    </button>
                    <button type="button" className="icon-button" aria-label="GIF">
                        <GifBoxIcon />
                    </button>
                    <button type="button" className="icon-button" aria-label="Emoji">
                        <EmojiEmotionsIcon />
                    </button>
                </span>
            </div>
        </div>
    );
}
