import React, { useEffect, Fragment } from "react";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import Chat from "./components/Chat/Chat";
import ServerList from "./components/ServerList/ServerList";
import Channel from "./components/Channel/Channel";
import { Routes, Route, useNavigate } from "react-router-dom";
import LoginPage, { ResetPasswordPage } from "./components/LoginPage/LoginPage";
import { RegisterPage } from "./components/LoginPage/LoginPage";
import { db, auth } from "./firebase";
import { Outlet } from "react-router-dom";
// import { RtcRole } from "agora-token"
import VoiceChat from "./components/VoiceChat/VoiceChat";
import { useDispatch, useSelector } from "react-redux";
import DirectMessageMenu from "./components/DirectMessage/DirectMessageMenu/DirectMessageMenu";
import DirectMessageBody from "./components/DirectMessage/DirectMessageBody/DirectMessageBody";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import { onAuthStateChanged, getRedirectResult } from "firebase/auth";
import { getSelectStore } from "./utils/userSelectStore";
import { setUser, setIsLoggedIn } from "./redux/features/authSlice";
import { getBannerColor } from "./utils/getBannerColor";
import { joinVoiceChannel, loadVoiceChatSession } from "./redux/features/voiceChatSlice";
import ToastManager from "./components/ToastManager/ToastManager";
import "./App.scss";

function App() {
    const dispatch = useDispatch();
    // user state is not used in this component
    const isVoiceChatPageOpen = useSelector((state) => state.voiceChat.isVoiceChatPageOpen);
    const currVoiceChannel = useSelector((state) => state.channel.currVoiceChannel);
    const user = useSelector((state) => state.auth.user);

    const navigate = useNavigate();

    useEffect(() => {
        const resolveUserPayload = async (authUser) => {
            const fallbackPayload = {
                displayName: authUser?.displayName || "User",
                avatar: authUser?.photoURL || "",
                id: authUser?.uid || "",
                createdAt: null,
                status: "online",
                email: authUser?.email || "",
                bannerColor: "rgb(88, 101, 242)",
                friends: [],
            };

            if (!authUser?.uid) {
                return fallbackPayload;
            }

            try {
                const userRef = doc(db, "users", authUser.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data() || {};
                    return {
                        displayName: userData.displayName || fallbackPayload.displayName,
                        avatar: userData.avatar || fallbackPayload.avatar,
                        id: userData.id || fallbackPayload.id,
                        createdAt: userData.createdAt?.seconds || null,
                        status: userData.status || "online",
                        email: userData.email || fallbackPayload.email,
                        bannerColor: userData.bannerColor || fallbackPayload.bannerColor,
                        friends: userData.friends || [],
                    };
                }

                const createdAt = Timestamp.fromDate(new Date());
                const newUser = {
                    displayName: authUser.displayName,
                    email: authUser.email || "",
                    avatar: authUser.photoURL,
                    id: authUser.uid,
                    createdAt,
                    status: "online",
                    friends: [],
                    bannerColor: await getBannerColor(authUser.photoURL),
                };

                await setDoc(userRef, newUser);

                return {
                    displayName: newUser.displayName || fallbackPayload.displayName,
                    avatar: newUser.avatar || fallbackPayload.avatar,
                    id: newUser.id,
                    createdAt: createdAt.seconds,
                    status: newUser.status,
                    email: newUser.email,
                    bannerColor: newUser.bannerColor || fallbackPayload.bannerColor,
                    friends: newUser.friends,
                };
            } catch (error) {
                return fallbackPayload;
            }
        };

        const finalizeLogin = async (authUser) => {
            const payload = await resolveUserPayload(authUser);
            dispatch(setUser(payload));
            getSelectStore();
            dispatch(setIsLoggedIn(true));
        };

        const routeAfterLogin = () => {
            try {
                const cur = window.location.pathname || "";
                const hasVisited = localStorage.getItem("hasVisitedDirectMessage");
                if (!hasVisited) {
                    localStorage.setItem("hasVisitedDirectMessage", "1");
                    if (cur !== "/channels/@me") {
                        navigate("/channels/@me");
                    }
                } else if (!cur.startsWith("/channels")) {
                    navigate("/channels");
                }
            } catch (e) {
                navigate("/channels");
            }
        };

        const clearOAuthRedirectMarker = () => {
            try {
                sessionStorage.removeItem("oauthRedirectInFlight");
            } catch (e) {
                // ignore storage failures
            }
        };

        const hasOAuthRedirectMarker = () => {
            try {
                return sessionStorage.getItem("oauthRedirectInFlight") === "1";
            } catch (e) {
                return false;
            }
        };

        try {
            /* eslint-disable no-console */
            console.info("initial location:", window.location.href);
            console.info(
                "initial localStorage keys:",
                Object.keys(localStorage).filter((k) =>
                    /firebase|redirect|PENDING_REDIRECT|redirectUser/i.test(k)
                )
            );
            /* eslint-enable no-console */
        } catch (e) {
            // ignore non-browser
        }
        // Handle OAuth redirect results (optional: access tokens, credentials)
        (async () => {
            try {
                const result = await getRedirectResult(auth).catch(() => null);
                // eslint-disable-next-line no-console
                console.info("getRedirectResult:", result);
                if (result && result.user) {
                    try {
                        await finalizeLogin(result.user);
                        clearOAuthRedirectMarker();
                        routeAfterLogin();
                    } catch (e) {
                        // eslint-disable-next-line no-console
                        console.error("Error processing redirect user", e);
                    }
                }
            } catch (err) {
                // eslint-disable-next-line no-console
                console.warn("getRedirectResult failed", err);
            }
        })();

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            // eslint-disable-next-line no-console
            console.info("onAuthStateChanged user:", user);
            try {
                if (user) {
                    await finalizeLogin(user);
                    clearOAuthRedirectMarker();
                    routeAfterLogin();
                } else {
                    if (hasOAuthRedirectMarker()) {
                        return;
                    }
                    dispatch(setUser(null));
                    dispatch(setIsLoggedIn(false));
                    try {
                        const cur = window.location.pathname || "";
                        if (cur !== "/") {
                            navigate("/");
                        }
                    } catch (e) {
                        navigate("/");
                    }
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("Error fetching user data", error);
            }
        });

        return unsubscribe;
    }, [dispatch, navigate]);

    useEffect(() => {
        const savedSession = loadVoiceChatSession();
        if (user && savedSession?.id && !isVoiceChatPageOpen && !currVoiceChannel?.id) {
            dispatch(joinVoiceChannel({ name: savedSession.name, channelId: savedSession.id }));
        }
    }, [dispatch, user, isVoiceChatPageOpen, currVoiceChannel?.id]);

    return (
        <>
            <ToastManager />
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/reset" element={<ResetPasswordPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    element={
                        <div className="app-mount">
                            <div className="app-container">
                                <Outlet />
                            </div>
                        </div>
                    }
                >
                    <Route
                        path="/channels"
                        element={
                            <Fragment>
                                <ServerList />
                                <Outlet />
                            </Fragment>
                        }
                    >
                        <Route
                            index
                            element={
                                <Fragment>
                                    <Channel />
                                    {isVoiceChatPageOpen ? <VoiceChat /> : <Chat />}
                                </Fragment>
                            }
                        />
                        <Route
                            path="@me"
                            element={
                                <Fragment>
                                    <DirectMessageMenu />
                                    <DirectMessageBody />
                                </Fragment>
                            }
                        />
                    </Route>
                </Route>
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </>
    );
}

export default App;
