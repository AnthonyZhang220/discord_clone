import React from "react";
import { convertDate, convertTime } from "@/utils/formatter";
import AvatarWithStatus from "@/components/AvatarWithStatus/AvatarWithStatus";

const FormatChatContent = ({ content, type, fileName }) => {
    if (!type) {
        return <span>{content}</span>;
    }

    if (type.indexOf("image/") !== -1) {
        return <img alt={content} src={content} className="message-image" />;
    }

    if (type.indexOf("audio/") !== -1) {
        return (
            <div className="format-audio-column">
                <div className="audio-title">{fileName}</div>
                <audio controls src={content} preload="metadata" />
            </div>
        );
    }

    if (type.indexOf("video/") !== -1) {
        return (
            <video controls className="message-video" preload="metadata">
                <source src={content} type={type} />
            </video>
        );
    }

    return <span>{content}</span>;
};

export const ChatMessage = React.memo(function ChatMessage({ message, isGroupStart }) {
    const { content, displayName, avatar, createdAt, type, fileName, dividerDate } = message;

    if (dividerDate) {
        return (
            <li className="chat-divider" role="separator">
                <span>{dividerDate}</span>
            </li>
        );
    }

    const isNewBlock =
        typeof isGroupStart === "boolean" ? isGroupStart : Boolean(avatar && displayName);
    const authorName = displayName || message?.userName || "Unknown";

    const messageClass = `message ${isNewBlock ? "message-group-start" : "message-group-continuation"}`;
    const showAvatarSpacer = !isNewBlock;

    return (
        <li className={messageClass} role="listitem">
            {isNewBlock && (
                <AvatarWithStatus
                    containerClassName="message-avatar-wrap"
                    avatarClassName="avatar message-avatar"
                    alt={authorName}
                    src={avatar}
                    status={message?.status}
                />
            )}
            {showAvatarSpacer && (
                <div className="message-avatar-spacer message-avatar-spacer-continuation" />
            )}
            <div className="message-main">
                <div className="message-time-col">
                    <span className="message-time-hover">{convertTime(createdAt)}</span>
                </div>
                <div className="message-body">
                    {isNewBlock && (
                        <div className="message-header">
                            <span className="message-author">{authorName}</span>
                            <span className="message-meta">{convertDate(createdAt)}</span>
                        </div>
                    )}
                    <div className="message-bubble">
                        <FormatChatContent content={content} type={type} fileName={fileName} />
                    </div>
                </div>
            </div>
        </li>
    );
});
