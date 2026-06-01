import React, { useEffect, useCallback } from "react";
import { db } from "@/firebase";
import { onSnapshot, query, where, collection } from "firebase/firestore";

import AddIcon from "@mui/icons-material/Add";
import ExploreIcon from "@mui/icons-material/Explore";
import { Tooltip, Avatar } from "@/components/compat/RadixCompat";

import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    CreateServerDialog,
    CreateServerEntryDialog,
    JoinServerDialog,
} from "@/components/dialogs/server";

import { handleSelectServer } from "@/handlers/serverHandlers";
import { setCreateServerModal } from "@/redux/features/modalSlice";
import { setCurrServerList } from "@/redux/features/serverSlice";
import "./ServerList.scss";

const ServerItem = React.memo(function ServerItem({
    id,
    name,
    avatar,
    active,
    mouseDown,
    onMouseDown,
    onClick,
}) {
    return (
        <div
            className={`server focusable ${active ? "active" : ""} ${mouseDown ? "transformDown" : ""}`}
            role="button"
            key={id}
            onMouseDown={onMouseDown}
            onClick={onClick}
        >
            <Tooltip
                title={
                    <React.Fragment>
                        <span className="tooltip-text">{name}</span>
                    </React.Fragment>
                }
                placement="right"
            >
                <Avatar className="server-icon" src={avatar} alt={name} />
            </Tooltip>
        </div>
    );
});

const ServerList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { createServerModal, createServerFormModal, joinServerModal } = useSelector(
        (state) => state.modal
    );
    const { currServerList } = useSelector((state) => state.server);
    const { user } = useSelector((state) => state.auth);
    const { selectedServer } = useSelector((state) => state.userSelectStore);
    const location = useLocation();
    const isDirectMessagePageOpen = location.pathname.includes("/channels/@me");

    // Get list of servers that belong to the current user
    useEffect(() => {
        if (user?.id) {
            const q = query(collection(db, "servers"), where("members", "array-contains", user.id));
            onSnapshot(q, (snapshot) => {
                const userServers = [];
                snapshot.forEach((doc) => {
                    userServers.push({
                        name: doc.data().name,
                        avatar: doc.data().avatar,
                        id: doc.id,
                    });
                });
                dispatch(setCurrServerList(userServers));
            });
        }
    }, [user?.id, dispatch]);

    // Routing is now the source of truth; navigation is triggered by clicks below.

    const [mouseDown, setMouseDown] = React.useState(false);

    const handleMouseDown = useCallback(() => setMouseDown(true), []);
    const handleServerClick = useCallback(
        (name, id) => {
            handleSelectServer(name, id);
            navigate("/channels");
        },
        [navigate]
    );

    return (
        <aside className="servers">
            <div className="servers-list">
                <div
                    className={`server focusable server-friends ${isDirectMessagePageOpen ? "active" : ""}`}
                    role="button"
                    aria-label="Discord Friend"
                    onClick={() => navigate("/channels/@me")}
                >
                    <Tooltip
                        title={
                            <React.Fragment>
                                <span className="tooltip-text">Direct Messages</span>
                            </React.Fragment>
                        }
                        placement="right"
                    >
                        <Avatar
                            className="server-icon"
                            src="https://cdn.discordapp.com/embed/avatars/0.png"
                            alt="Direct Messages"
                        />
                    </Tooltip>
                </div>
                <div className="divider server-divider" />
                {currServerList.map(({ name, avatar, id }) => (
                    <ServerItem
                        key={id}
                        id={id}
                        name={name}
                        avatar={avatar}
                        active={id === selectedServer && !isDirectMessagePageOpen}
                        mouseDown={mouseDown}
                        onMouseDown={handleMouseDown}
                        onClick={() => handleServerClick(name, id)}
                    />
                ))}
                <div className="server">
                    <Tooltip
                        title={
                            <React.Fragment>
                                <span className="tooltip-text">Add a Server</span>
                            </React.Fragment>
                        }
                        placement="right"
                    >
                        <button
                            type="button"
                            className="server-add-button server-action-button"
                            onClick={() => dispatch(setCreateServerModal(true))}
                        >
                            <AddIcon className="server-icon" />
                        </button>
                    </Tooltip>
                </div>
                <Tooltip
                    title={
                        <React.Fragment>
                            <span className="tooltip-text">Explore Public Servers</span>
                        </React.Fragment>
                    }
                    placement="right"
                >
                    <div className="server server-explore">
                        <button
                            type="button"
                            className="server-explore-button server-action-button"
                        >
                            <ExploreIcon className="server-icon" />
                        </button>
                    </div>
                </Tooltip>
            </div>
            {}
            <CreateServerEntryDialog open={createServerModal} />
            <CreateServerDialog open={createServerFormModal} />
            <JoinServerDialog open={joinServerModal} />
            {/* <Outlet /> */}
        </aside>
    );
};

export default ServerList;
