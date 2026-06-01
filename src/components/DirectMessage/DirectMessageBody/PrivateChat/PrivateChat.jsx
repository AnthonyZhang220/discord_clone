import React, { useRef, useEffect, useMemo } from "react";
//send meesage to db
import { onSnapshot, query, where, collection, orderBy, limitToLast } from "firebase/firestore";
import { db } from "@/firebase";
//material ui comp
import AvatarWithStatus from "@/components/AvatarWithStatus/AvatarWithStatus";
import MessageInput from "@/components/MessageInput/MessageInput";
import MessageList from "@/components/Chat/MessageList";
import { setDraftDirectMessage } from "@/redux/features/draftSlice";
import { convertDateDivider } from "@/utils/formatter";
import { useDispatch, useSelector } from "react-redux";
import { setDirectMessageList } from "@/redux/features/chatListSlice";
import { handleSubmitDirectMessage } from "@/handlers/messageHandlers";
import { UserSidebar } from "@/components/DirectMessage/DirectMessageBody/UserSidebar/UserSidebar";

import "./PrivateChat.scss";

export default function PrivateChat() {
    const formRef = useRef();
    const chatScroller = useRef();
    const dispatch = useDispatch();
    const { draftDirectMessage } = useSelector((state) => state.draft);
    const { currDirectMessageChannel, isDirectMessageSidebarOpen, currDirectMessageChannelRef } =
        useSelector((state) => state.directMessage);
    // removed unused `isMemberListOpen` to satisfy ESLint
    const { directMessageList } = useSelector((state) => state.chatList);

    useEffect(() => {
        if (chatScroller.current) {
            chatScroller.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [directMessageList]);

    useEffect(() => {
        let unsubscribe;
        if (currDirectMessageChannelRef) {
            const q = query(
                collection(db, "messages"),
                where("channelRef", "==", currDirectMessageChannelRef || ""),
                orderBy("createdAt"),
                limitToLast(20)
            );

            unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                let chatList = [];
                let previousDate = null;

                QuerySnapshot.forEach((doc) => {
                    const chatMessage = doc.data();
                    const currentDate = convertDateDivider(chatMessage.createdAt);
                    if (previousDate === null || currentDate != previousDate) {
                        chatList.push({ dividerDate: currentDate });
                    }
                    chatList.push({ ...chatMessage, id: doc.id });

                    previousDate = currentDate;
                });
                dispatch(setDirectMessageList(chatList));
                //scroll new message
            });
        }

        return () => {
            if (typeof unsubscribe === "function") unsubscribe();
        };
        // chatScroller.current.scrollIntoView({ behavior: "smooth" });
    }, [currDirectMessageChannelRef, dispatch]);

    const ChatList = useMemo(() => {
        const topContent = (
            <div className="private-chat-header">
                <AvatarWithStatus
                    containerClassName="private-chat-avatar"
                    avatarClassName="private-chat-avatar"
                    alt={currDirectMessageChannel.displayName}
                    src={currDirectMessageChannel.avatar}
                    status={currDirectMessageChannel?.status}
                />
                <div className="private-chat-header-text">
                    <h3>{currDirectMessageChannel.displayName}</h3>
                    <p className="private-chat-intro">
                        This is the beginning of your direct message history with{" "}
                        <b>{currDirectMessageChannel.displayName}</b>.
                    </p>
                </div>
            </div>
        );

        return (
            <MessageList
                messageList={directMessageList || []}
                chatScrollerRef={chatScroller}
                topContent={topContent}
            />
        );
    }, [
        currDirectMessageChannel.displayName,
        currDirectMessageChannel.avatar,
        currDirectMessageChannel.status,
        directMessageList,
    ]);

    return (
        <div className="friend-main-container">
            <div className="content">
                <main className="friend-main-content">
                    <div className="messageWrapper">
                        <div className="scroller">
                            <div className="scroller-content">{ChatList}</div>
                        </div>
                    </div>
                    <form
                        className="form"
                        ref={formRef}
                        onSubmit={(e) => handleSubmitDirectMessage(e)}
                    >
                        <MessageInput
                            draft={draftDirectMessage}
                            onChange={(v) => dispatch(setDraftDirectMessage(v))}
                            placeholder={`Message @${currDirectMessageChannel.displayName}`}
                        />
                    </form>
                </main>
                {isDirectMessageSidebarOpen && (
                    <UserSidebar currDirectMessageChannel={currDirectMessageChannel} />
                )}
            </div>
        </div>
    );
}
