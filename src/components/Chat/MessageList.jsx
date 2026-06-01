import React from "react";
import { ChatMessage } from "./ChatMessage";

const getAuthorGroupKey = (message) => {
    const ref = message?.userRef;

    if (typeof ref === "string" || typeof ref === "number") {
        return `ref:${String(ref)}`;
    }

    if (ref && typeof ref === "object") {
        if (typeof ref.path === "string" && ref.path.length > 0) {
            return `ref:${ref.path}`;
        }
        if (typeof ref.id === "string" && ref.id.length > 0) {
            return `ref:${ref.id}`;
        }
        if (typeof ref.uid === "string" && ref.uid.length > 0) {
            return `ref:${ref.uid}`;
        }
        if (Array.isArray(ref?._key?.path?.segments) && ref._key.path.segments.length > 0) {
            return `ref:${ref._key.path.segments.join("/")}`;
        }
    }

    if (typeof message?.displayName === "string" && message.displayName.length > 0) {
        return `name:${message.displayName}`;
    }

    if (typeof message?.userName === "string" && message.userName.length > 0) {
        return `name:${message.userName}`;
    }

    if (typeof message?.avatar === "string" && message.avatar.length > 0) {
        return `avatar:${message.avatar}`;
    }

    return "";
};

export default function MessageList({ messageList = [], chatScrollerRef, topContent = null }) {
    return (
        <>
            {topContent}
            <ol className="scrollerInner">
                {messageList.map((message, index, list) => {
                    const isDivider = Boolean(message?.dividerDate);
                    const firstMessageIndex = list.findIndex((item) => !item?.dividerDate);
                    let previousContentMessage = null;

                    for (let i = index - 1; i >= 0; i -= 1) {
                        if (!list[i]?.dividerDate) {
                            previousContentMessage = list[i];
                            break;
                        }
                    }

                    const isFirstVisibleMessage = !isDivider && index === firstMessageIndex;
                    const currentAuthorKey = getAuthorGroupKey(message);
                    const previousAuthorKey = getAuthorGroupKey(previousContentMessage);
                    const isGroupStart =
                        isFirstVisibleMessage ||
                        (!isDivider &&
                            (!previousContentMessage || previousAuthorKey !== currentAuthorKey));

                    return (
                        <ChatMessage
                            message={message}
                            isGroupStart={isGroupStart}
                            key={message.id || `divider-${message.dividerDate}-${index}`}
                        />
                    );
                })}
                <li className="scrollerSpacer" ref={chatScrollerRef}></li>
            </ol>
        </>
    );
}
