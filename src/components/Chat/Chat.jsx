import React, { useEffect, useMemo, Fragment, useRef } from "react";
//send meesage to db
import { collection } from "firebase/firestore";
//query get chat message from db
import { doc, getDoc, query, orderBy, onSnapshot, where, limitToLast } from "firebase/firestore";
import { db } from "@/firebase";

import NumbersIcon from "@mui/icons-material/Numbers";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ChannelMemberList from "@/components/ChannelMemberList/ChannelMemberList";
import MessageList from "./MessageList";
import "./Chat.scss";

import { Tooltip } from "@/components/compat/RadixCompat";
import { convertDateDivider } from "@/utils/formatter";
import { useDispatch, useSelector } from "react-redux";
import { setDraftMessage } from "@/redux/features/draftSlice";
import { setIsMemberListOpen } from "@/redux/features/memberListSlice";
import { setCurrChannel } from "@/redux/features/channelSlice";
import { handleSubmitMessage } from "@/handlers/messageHandlers";
import { setMessageList } from "@/redux/features/chatListSlice";
import MessageInput from "@/components/MessageInput/MessageInput";
// const URL = 'http://localhost:3000';
// export const socket = io(URL);

export default function Chat() {
    const formRef = useRef();
    const chatScroller = useRef();
    const dispatch = useDispatch();
    const { selectedChannel } = useSelector((state) => state.userSelectStore);
    const { currChannel } = useSelector((state) => state.channel);
    // user from auth slice not used in this component
    const { isMemberListOpen } = useSelector((state) => state.memberList);
    const { draftMessage } = useSelector((state) => state.draft);
    const { messageList } = useSelector((state) => state.chatList);

    useEffect(() => {
        if (selectedChannel) {
            const getChannelRef = async () => {
                const channelRef = doc(db, "channels", selectedChannel || "");
                const channelDoc = await getDoc(channelRef);
                dispatch(setCurrChannel({ name: channelDoc.data().name, id: channelDoc.id }));
            };
            getChannelRef();
        }
    }, [selectedChannel, dispatch]);

    useEffect(() => {
        if (selectedChannel) {
            const q = query(
                collection(db, "messages"),
                where("channelRef", "==", selectedChannel || ""),
                orderBy("createdAt"),
                limitToLast(20)
            );

            onSnapshot(q, (QuerySnapshot) => {
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

                dispatch(setMessageList(chatList));
                //scroll new message
            });
        }

        // chatScroller.current.scrollIntoView({ behavior: "smooth" });
    }, [selectedChannel, dispatch]);

    const ChatList = useMemo(() => {
        const topContent = (
            <div className="chat-welcome-header">
                <button type="button" className="chat-numbers-button">
                    <NumbersIcon className="chat-numbers-icon" />
                </button>
                <div className="message-heading">
                    <h3>Welcome to #{currChannel?.name || ""}!</h3>
                    <p className="message-subtitle">
                        This is the start of the #{currChannel?.name || ""} channel.
                    </p>
                </div>
            </div>
        );

        return (
            <MessageList
                messageList={messageList || []}
                chatScrollerRef={chatScroller}
                topContent={topContent}
            />
        );
    }, [messageList, currChannel?.name]);

    return (
        <div className="chat-container">
            <section className="chat-header">
                <div className="chat-header-name">
                    <NumbersIcon className="chat-header-icon" />
                    <span className="chat-header-hashtag">{currChannel?.name || ""}</span>
                </div>
                <div className="chat-header-feature">
                    <Tooltip
                        title={
                            <Fragment>
                                <span className="tooltip-text">
                                    {isMemberListOpen ? "Hide Member List" : "Show Member List"}
                                </span>
                            </Fragment>
                        }
                        placement="bottom"
                    >
                        <PeopleAltIcon
                            color="white"
                            onClick={() => dispatch(setIsMemberListOpen(!isMemberListOpen))}
                        />
                    </Tooltip>
                </div>
            </section>
            <div className="content">
                <main className="chat-content">
                    <div className="messageWrapper">
                        <div className="scroller">
                            <div className="scroller-content">{ChatList}</div>
                        </div>
                    </div>
                    <form className="form" ref={formRef} onSubmit={(e) => handleSubmitMessage(e)}>
                        <MessageInput
                            draft={draftMessage}
                            onChange={(v) => dispatch(setDraftMessage(v))}
                            placeholder={`Message #${currChannel?.name || ""}`}
                        />
                    </form>
                </main>
                {isMemberListOpen && <ChannelMemberList />}
            </div>
            {/* <Outlet /> */}
        </div>
    );
}
