import React, { useEffect } from "react";
import { db } from "@/firebase";
import { onSnapshot, query, where, collection } from "firebase/firestore";

import { Avatar, Typography, IconButton, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExploreIcon from "@mui/icons-material/Explore";
import { ServerNameTooltip } from "@/components/CustomUIComponents";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { CreateServerDialog, JoinServerDialog, ServerDialog } from "@/components/Modals/Modals";

import { handleSelectServer } from "@/handlers/serverHandlers";
import { setCreateServerModal } from "@/redux/features/modalSlice";
import { setCurrServerList } from "@/redux/features/serverSlice";
import "./ServerList.scss";

const ServerList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { createServerModal, createServerFormModal, joinServerModal } = useSelector(
        (state) => state.modal
    );
    const { currServerList } = useSelector((state) => state.server);
    const { user } = useSelector((state) => state.auth);
    const { selectedServer } = useSelector((state) => state.userSelectStore);
    const { isDirectMessagePageOpen } = useSelector((state) => state.directMessage);

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

    return (
        <aside className="servers">
            <div className="servers-list">
                <div
                    className={`server focusable server-friends ${isDirectMessagePageOpen ? "active" : ""}`}
                    role="button"
                    aria-label="Discord Friend"
                    onClick={() => navigate("/channels/@me")}
                >
                    <ServerNameTooltip
                        title={
                            <React.Fragment>
                                <Typography variant="body1" className="tooltip-text">
                                    Direct Messages
                                </Typography>
                            </React.Fragment>
                        }
                        placement="right"
                    >
                        <Avatar
                            className="server-icon"
                            src="https://cdn.discordapp.com/embed/avatars/0.png"
                        />
                    </ServerNameTooltip>
                </div>
                <Divider variant="fullWidth" flexItem className="server-divider" />
                {currServerList.map(({ name, avatar, id }) => (
                    <div
                        className={`server focusable ${id === selectedServer && !isDirectMessagePageOpen ? "active" : ""} ${mouseDown ? "transformDown" : ""}`}
                        role="button"
                        key={id}
                        onMouseDown={() => setMouseDown(true)}
                        onClick={() => {
                            handleSelectServer(name, id);
                            navigate("/channels");
                        }}
                    >
                        <ServerNameTooltip
                            title={
                                <React.Fragment>
                                    <Typography variant="body1" className="tooltip-text">
                                        {name}
                                    </Typography>
                                </React.Fragment>
                            }
                            placement="right"
                        >
                            <Avatar className="server-icon" src={avatar} />
                        </ServerNameTooltip>
                    </div>
                ))}
                <div className="server">
                    <ServerNameTooltip
                        title={
                            <React.Fragment>
                                <Typography variant="body1" className="tooltip-text">
                                    Add a Server
                                </Typography>
                            </React.Fragment>
                        }
                        placement="right"
                    >
                        <IconButton
                            className="server-add-button"
                            onClick={() => dispatch(setCreateServerModal(true))}
                        >
                            <AddIcon className="server-icon" />
                        </IconButton>
                    </ServerNameTooltip>
                </div>
                <ServerNameTooltip
                    title={
                        <React.Fragment>
                            <Typography variant="body1" className="tooltip-text">
                                Explore Public Servers
                            </Typography>
                        </React.Fragment>
                    }
                    placement="right"
                >
                    <div className="server server-explore">
                        <IconButton className="server-explore-button">
                            <ExploreIcon className="server-icon" />
                        </IconButton>
                    </div>
                </ServerNameTooltip>
            </div>
            {}
            <ServerDialog createServerModal={createServerModal} />
            <CreateServerDialog createServerFormModal={createServerFormModal} />
            <JoinServerDialog joinServerModal={joinServerModal} />
            {/* <Outlet /> */}
        </aside>
    );
};

export default ServerList;
